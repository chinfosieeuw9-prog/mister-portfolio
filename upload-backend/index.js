import express from 'express';
import multer from 'multer';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import Ably from 'ably';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM dirname helpers first, so we can load the correct .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const upload = multer({ dest: 'tmp/' });

const repoRoot = path.resolve(__dirname, '..');


const {
  GITHUB_TOKEN,
  GITHUB_REPO,
  GITHUB_BRANCH = 'main',
  GITHUB_UPLOAD_PATH = 'uploads/',
  PUBLIC_BASE_URL = 'https://mister.us.kg/'
} = process.env;

let UPLOAD_DISABLED = false;
if (!GITHUB_TOKEN || !GITHUB_REPO) {
  console.warn('⚠️  GITHUB upload is uitgeschakeld: zet GITHUB_TOKEN en GITHUB_REPO in .env om uploads te activeren.');
  UPLOAD_DISABLED = true;
}

const PORT = process.env.PORT || 3001;
const { ABLY_API_KEY } = process.env;


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
// Use JSON body parser for all routes EXCEPT /logs/append (we handle that route manually to tolerate BOM/odd clients)
app.use((req, res, next) => {
  if (req.path === '/logs/append') return next();
  return express.json()(req, res, next);
});

// Helper: safely read JSON from file (strip BOM if present)
function safeReadJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const raw = fs.readFileSync(file, 'utf8');
    const s = String(raw || '').replace(/^\uFEFF/, '');
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

// Helper: detect the most recent versionTag from logs or artifacts
function detectCurrentVersionTag() {
  try {
    const logsPath = path.resolve(repoRoot, 'logs', 'logs.json');
    const artPath = path.resolve(repoRoot, 'artifacts', 'last-backup.json');
    // Prefer logs entries: last workflow/backup entry with versionTag
    if (fs.existsSync(logsPath)) {
      const j = safeReadJson(logsPath, { entries: [] });
      const arr = Array.isArray(j.entries) ? j.entries : [];
      for (let i = arr.length - 1; i >= 0; i--) {
        const e = arr[i];
        if (e && (e.type === 'workflow' || e.type === 'backup') && e.versionTag) {
          return String(e.versionTag);
        }
      }
    }
    // Fallback to artifacts/last-backup.json
    if (fs.existsSync(artPath)) {
      const a = safeReadJson(artPath, null);
      if (a && a.versionTag) return String(a.versionTag);
    }
  } catch {}
  return null;
}

app.post('/upload', upload.single('file'), async (req, res) => {
  if (UPLOAD_DISABLED) {
    return res.status(503).json({ error: 'Upload functionaliteit is niet geconfigureerd (GITHUB_TOKEN/GITHUB_REPO ontbreekt)' });
  }
  try {
    const { originalname, path: tempPath } = req.file;
    const { name, category, description } = req.body;
    if (!originalname || !name || !category) {
      return res.status(400).json({ error: 'Bestand, naam en categorie zijn verplicht.' });
    }
    const content = fs.readFileSync(tempPath, { encoding: 'base64' });
    const githubPath = `${GITHUB_UPLOAD_PATH}${Date.now()}_${originalname}`;
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${githubPath}`;
    const message = `Upload ${originalname} via web (${name}, ${category})`;
    const response = await axios.put(apiUrl, {
      message,
      content,
      branch: GITHUB_BRANCH
    }, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'User-Agent': 'upload-backend'
      }
    });
    fs.unlinkSync(tempPath);
  const ghContentMeta = response && response.data && response.data.content ? response.data.content : {};
  const htmlUrl = ghContentMeta.html_url || '';
  const downloadUrl = ghContentMeta.download_url || '';
    // Provide an easily usable Pages URL for the uploaded asset
    const base = String(PUBLIC_BASE_URL || '').replace(/\/+$/,'');
    const pagesUrl = base && githubPath ? `${base}/${githubPath}` : '';
    res.json({ success: true, path: githubPath, html_url: htmlUrl, download_url: downloadUrl, pages_url: pagesUrl });
  } catch (err) {
    // Bubble up as much diagnostic info as possible to ease troubleshooting
    try {
      const status = err && err.response && err.response.status ? err.response.status : 500;
      const ghData = err && err.response && err.response.data ? err.response.data : null;
      const ghMsg = ghData && (ghData.message || ghData.error) ? (ghData.message || ghData.error) : undefined;
      console.error('GitHub upload error:', {
        status,
        ghMessage: ghMsg,
        rateLimit: err && err.response && err.response.headers ? {
          remaining: err.response.headers['x-ratelimit-remaining'],
          reset: err.response.headers['x-ratelimit-reset']
        } : undefined
      });
      res.status(status === 401 || status === 403 ? 403 : 500).json({
        error: 'Upload naar GitHub mislukt.',
        status,
        github: ghMsg || ghData || null
      });
    } catch (e2) {
      console.error('Upload error (fallback):', e2);
      res.status(500).json({ error: 'Upload naar GitHub mislukt.' });
    }
  }
});

// Simple health endpoint for uptime checks
app.get('/health', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ ok: true, ts: Date.now() });
});

// Diagnostics: verify GitHub token/repo access quickly
app.get('/diag/github', async (req, res) => {
  try {
    if (UPLOAD_DISABLED) return res.status(503).json({ ok:false, error:'GITHUB env ontbreekt' });
    const url = `https://api.github.com/repos/${GITHUB_REPO}`;
    const resp = await axios.get(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'User-Agent': 'upload-backend'
      },
      validateStatus: () => true
    });
    const scopes = resp.headers && (resp.headers['x-oauth-scopes'] || resp.headers['github-authentication-token-expiration']) || undefined;
    const minimal = resp.data && typeof resp.data === 'object' ? {
      name: resp.data.name,
      full_name: resp.data.full_name,
      private: resp.data.private,
      default_branch: resp.data.default_branch,
      permissions: resp.data.permissions
    } : null;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(resp.status).json({ ok: resp.status>=200 && resp.status<300, status: resp.status, scopes, repo: minimal });
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message });
  }
});

// Ably token endpoint (TokenRequest for authUrl)
app.get('/ably/token', async (req, res) => {
  try {
    console.log('[GET] /ably/token', { from: req.ip, q: req.query });
    if (!ABLY_API_KEY) return res.status(500).json({ error: 'ABLY_API_KEY ontbreekt op de server' });
    const rest = new Ably.Rest({ key: ABLY_API_KEY });
    const clientId = req.query.clientId || 'web-' + Math.random().toString(36).slice(2);
    const tokenRequest = await new Promise((resolve, reject) => {
      rest.auth.createTokenRequest({ clientId }, (err, tokenParams) => {
        if (err) return reject(err);
        resolve(tokenParams);
      });
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(tokenRequest);
  } catch (e) {
    console.error('Ably token error', e);
    res.status(500).json({ error: 'Kon geen Ably token aanmaken' });
  }
});

// Run the full PowerShell backup workflow and return the output
app.post('/workflow/run', async (req, res) => {
  try {
    const scriptPath = path.resolve(repoRoot, 'full-backup-workflow.ps1');
    const cmd = `powershell.exe -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`;
    const startedAt = Date.now();
  exec(cmd, { cwd: repoRoot, timeout: 180000, maxBuffer: 10 * 1024 * 1024 }, async (error, stdout, stderr) => {
      if (error) {
        const code = error.killed && error.signal === 'SIGTERM' ? 'TIMEOUT' : (error.code || 'ERR');
        return res.status(500).json({ ok: false, error: error.message, code, stdout, stderr });
      }
      // On success: append a small release note with detected versionTag and artifact + HTTPS details
      try {
        const ver = detectCurrentVersionTag();
        const logsPath = path.resolve(repoRoot, 'logs', 'logs.json');
        if (!fs.existsSync(logsPath)) {
          fs.mkdirSync(path.dirname(logsPath), { recursive: true });
          fs.writeFileSync(logsPath, JSON.stringify({ entries: [] }, null, 2));
        }
        const json = safeReadJson(logsPath, { entries: [] });
        // Try to read artifact details for nicer message
        let details = '';
        try {
          const artPath = path.resolve(repoRoot, 'artifacts', 'last-backup.json');
          if (fs.existsSync(artPath)) {
            const a = safeReadJson(artPath, null);
            if (a) {
              const files = (a.filesCount != null) ? `files: ${a.filesCount}` : '';
              const mb = (a.zipBytes != null) ? `zip: ${((Number(a.zipBytes)||0)/1e6).toFixed(2)} MB` : '';
              const zip = a.zipPath ? `(${a.zipPath})` : '';
              details = [files, mb].filter(Boolean).join(', ') + (zip ? ' ' + zip : '');
            }
          }
        } catch {}
        // Optional: check HTTPS status of the public site
        let httpsInfo = '';
        try {
          const url = 'https://mister.us.kg/';
          const resp = await axios.get(url, { timeout: 5000, validateStatus: ()=>true });
          httpsInfo = `https: ${resp.status}`;
        } catch (e) { httpsInfo = 'https: offline'; }
        const durMs = Math.max(0, Date.now() - startedAt);
        const dur = (durMs/1000).toFixed(1) + 's';
        const entry = {
          type: 'note',
          timestamp: new Date().toISOString(),
          versionTag: ver ? `release-${ver}` : 'release',
          message: [`Workflow run voltooid (backend) in ${dur}.`, details, httpsInfo].filter(Boolean).join(' ').trim()
        };
        json.entries = Array.isArray(json.entries) ? json.entries : [];
        json.entries.push(entry);
        fs.writeFileSync(logsPath, JSON.stringify(json, null, 2));
      } catch (e) { console.warn('Append release note failed:', e && e.message ? e.message : e); }
      res.json({ ok: true, stdout, stderr });
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Append a note entry to logs/logs.json
// Route-specific parser: accept any content-type as raw text, then parse safely (handles BOM)
app.post('/logs/append', express.text({ type: '*/*' }), (req, res) => {
  try {
    // Be tolerant to different client encodings/bodies
    let body = req.body;
    if (typeof body === 'string') {
      // Strip BOM if present and try JSON parse; if that fails, attempt to parse urlencoded
      let s = body.replace(/^\uFEFF/, '');
      try {
        body = JSON.parse(s);
      } catch {
        // Try very simple urlencoded parse (message=...&versionTag=...&type=...)
        try {
          const params = new URLSearchParams(s);
          body = Object.fromEntries(params.entries());
        } catch {
          body = { message: s };
        }
      }
    }
    const { message = '', versionTag = 'note', type = 'note' } = body || {};
    const logsPath = path.resolve(repoRoot, 'logs', 'logs.json');
    if (!fs.existsSync(logsPath)) {
      fs.mkdirSync(path.dirname(logsPath), { recursive: true });
      fs.writeFileSync(logsPath, JSON.stringify({ entries: [] }, null, 2));
    }
    const json = safeReadJson(logsPath, { entries: [] });
    const entry = { type, timestamp: new Date().toISOString(), versionTag, message };
    json.entries = Array.isArray(json.entries) ? json.entries : [];
    json.entries.push(entry);
    fs.writeFileSync(logsPath, JSON.stringify(json, null, 2));
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ ok: true, entry });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Fallback: allow GET with query params (for clients that struggle with JSON bodies)
app.get('/logs/append', (req, res) => {
  try {
    const { message = '', versionTag = 'note', type = 'note' } = req.query || {};
    const logsPath = path.resolve(repoRoot, 'logs', 'logs.json');
    if (!fs.existsSync(logsPath)) {
      fs.mkdirSync(path.dirname(logsPath), { recursive: true });
      fs.writeFileSync(logsPath, JSON.stringify({ entries: [] }, null, 2));
    }
    const json = safeReadJson(logsPath, { entries: [] });
    const entry = { type: String(type||'note'), timestamp: new Date().toISOString(), versionTag: String(versionTag||'note'), message: String(message||'') };
    json.entries = Array.isArray(json.entries) ? json.entries : [];
    json.entries.push(entry);
    fs.writeFileSync(logsPath, JSON.stringify(json, null, 2));
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ ok: true, entry });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Update a log entry (by index or timestamp). Allows updating message, versionTag, type, pinned.
app.put('/logs/update', express.json(), (req, res) => {
  try {
    const { index, timestamp, message, versionTag, type, pinned } = req.body || {};
    const logsPath = path.resolve(repoRoot, 'logs', 'logs.json');
    if (!fs.existsSync(logsPath)) return res.status(404).json({ ok:false, error:'logs.json niet gevonden' });
    const json = safeReadJson(logsPath, { entries: [] });
    let arr = Array.isArray(json.entries) ? json.entries : [];
    let idx = Number.isInteger(index) ? index : arr.findIndex(e => e && e.timestamp === timestamp);
    if (!Number.isInteger(idx) || idx < 0 || idx >= arr.length) return res.status(400).json({ ok:false, error:'Ongeldige index/timestamp' });
    const cur = arr[idx] || {};
    if (typeof message === 'string') cur.message = message;
    if (typeof versionTag === 'string') cur.versionTag = versionTag;
    if (typeof type === 'string') cur.type = type;
    if (typeof pinned !== 'undefined') cur.pinned = !!pinned;
    arr[idx] = cur;
    json.entries = arr;
    fs.writeFileSync(logsPath, JSON.stringify(json, null, 2));
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ ok:true, index: idx, entry: cur });
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message });
  }
});

// Delete a log entry (by index or timestamp)
app.delete('/logs/delete', express.json(), (req, res) => {
  try {
    const idxBody = req.body && req.body.index;
    const idxQuery = typeof req.query.index !== 'undefined' ? Number(req.query.index) : undefined;
    const ts = req.body && req.body.timestamp ? req.body.timestamp : (req.query && req.query.timestamp);
    const logsPath = path.resolve(repoRoot, 'logs', 'logs.json');
    if (!fs.existsSync(logsPath)) return res.status(404).json({ ok:false, error:'logs.json niet gevonden' });
    const json = safeReadJson(logsPath, { entries: [] });
    let arr = Array.isArray(json.entries) ? json.entries : [];
    let idx = Number.isInteger(idxBody) ? idxBody : (Number.isInteger(idxQuery) ? idxQuery : arr.findIndex(e => e && e.timestamp === ts));
    if (!Number.isInteger(idx) || idx < 0 || idx >= arr.length) return res.status(400).json({ ok:false, error:'Ongeldige index/timestamp' });
    const removed = arr.splice(idx, 1);
    json.entries = arr;
    fs.writeFileSync(logsPath, JSON.stringify(json, null, 2));
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ ok:true, removed: removed[0] || null, count: arr.length });
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message });
  }
});

// Simple news API backed by news.json (for homepage/admin use)
app.get('/news', (req, res) => {
  try {
    const newsPath = path.resolve(repoRoot, 'news.json');
    const list = fs.existsSync(newsPath)
      ? (Array.isArray(JSON.parse(fs.readFileSync(newsPath, 'utf8') || '[]'))
          ? JSON.parse(fs.readFileSync(newsPath, 'utf8') || '[]')
          : [])
      : [];
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (Object.prototype.hasOwnProperty.call(req.query, 'pretty')) {
      // Pretty-printed JSON for easy viewing in a browser
      res.type('application/json').send(JSON.stringify(list, null, 2));
    } else {
      res.json(list);
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.post('/news', (req, res) => {
  try {
    const { title, date, content, link, linkTitle } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ ok: false, error: 'title en content zijn verplicht' });
    }
    const newsPath = path.resolve(repoRoot, 'news.json');
    let list = [];
    if (fs.existsSync(newsPath)) {
      try { list = JSON.parse(fs.readFileSync(newsPath, 'utf8') || '[]'); } catch {}
    }
    if (!Array.isArray(list)) list = [];
    const item = {
      title: String(title).trim(),
      date: date ? String(date).trim() : new Date().toISOString().slice(0,10),
      content: String(content).trim(),
      link: link ? String(link).trim() : '#',
      linkTitle: linkTitle ? String(linkTitle).trim() : 'Open',
    };
    // Prepend newest first
    list.unshift(item);
    fs.writeFileSync(newsPath, JSON.stringify(list, null, 2));
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ ok: true, item, count: list.length });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Delete a news item by index (newest-first order). Accepts query ?index= or JSON body { index }
app.delete('/news', (req, res) => {
  try {
    const newsPath = path.resolve(repoRoot, 'news.json');
    if (!fs.existsSync(newsPath)) {
      return res.status(404).json({ ok: false, error: 'news.json niet gevonden' });
    }
    const listRaw = fs.readFileSync(newsPath, 'utf8') || '[]';
    let list = [];
    try { list = JSON.parse(listRaw); } catch { list = []; }
    if (!Array.isArray(list)) list = [];

    // Read index from query or body
    let idx = undefined;
    if (typeof req.query.index !== 'undefined') idx = Number(req.query.index);
    else if (req.body && typeof req.body.index !== 'undefined') idx = Number(req.body.index);

    if (!Number.isInteger(idx) || idx < 0 || idx >= list.length) {
      return res.status(400).json({ ok: false, error: 'Ongeldige index' });
    }

    const removed = list.splice(idx, 1);
    fs.writeFileSync(newsPath, JSON.stringify(list, null, 2));
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ ok: true, removed: removed[0] || null, count: list.length });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Insert a news item at a specific index (or prepend if index invalid)
app.post('/news/insert', (req, res) => {
  try {
    const newsPath = path.resolve(repoRoot, 'news.json');
    let list = [];
    if (fs.existsSync(newsPath)) {
      try { list = JSON.parse(fs.readFileSync(newsPath, 'utf8') || '[]'); } catch {}
    }
    if (!Array.isArray(list)) list = [];
    const { index, item } = req.body || {};
    if (!item || typeof item !== 'object') {
      return res.status(400).json({ ok: false, error: 'item ontbreekt' });
    }
    const clean = {
      title: String(item.title || '').trim(),
      date: String(item.date || new Date().toISOString().slice(0,10)).trim(),
      content: String(item.content || '').trim(),
      link: String(item.link || '#').trim(),
      linkTitle: String(item.linkTitle || 'Open').trim(),
    };
    let idx = Number(index);
    if (!Number.isInteger(idx) || idx < 0 || idx > list.length) idx = 0; // default prepend
    list.splice(idx, 0, clean);
    fs.writeFileSync(newsPath, JSON.stringify(list, null, 2));
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ ok: true, inserted: clean, index: idx, count: list.length });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Update a news item by index; accepts any subset of fields in body
app.put('/news', (req, res) => {
  try {
    const newsPath = path.resolve(repoRoot, 'news.json');
    if (!fs.existsSync(newsPath)) {
      return res.status(404).json({ ok: false, error: 'news.json niet gevonden' });
    }
    const listRaw = fs.readFileSync(newsPath, 'utf8') || '[]';
    let list = [];
    try { list = JSON.parse(listRaw); } catch { list = []; }
    if (!Array.isArray(list)) list = [];

    let idx = undefined;
    if (typeof req.query.index !== 'undefined') idx = Number(req.query.index);
    else if (req.body && typeof req.body.index !== 'undefined') idx = Number(req.body.index);
    if (!Number.isInteger(idx) || idx < 0 || idx >= list.length) {
      return res.status(400).json({ ok: false, error: 'Ongeldige index' });
    }

    const { title, date, content, link, linkTitle } = req.body || {};
    const current = list[idx];
    if (typeof title === 'string') current.title = title.trim();
    if (typeof date === 'string') current.date = date.trim();
    if (typeof content === 'string') current.content = content.trim();
    if (typeof link === 'string') current.link = link.trim();
    if (typeof linkTitle === 'string') current.linkTitle = linkTitle.trim();

    list[idx] = current;
    fs.writeFileSync(newsPath, JSON.stringify(list, null, 2));
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ ok: true, item: current, index: idx, count: list.length });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Diagnostics: list routes and environment info to help debugging
function listRoutes() {
  try {
    const routes = [];
    app._router.stack.forEach((m) => {
      if (m.route && m.route.path) {
        const methods = Object.keys(m.route.methods).filter(Boolean).map(s=>s.toUpperCase());
        routes.push({ path: m.route.path, methods });
      } else if (m.name === 'router' && m.handle && m.handle.stack) {
        m.handle.stack.forEach((h) => {
          if (h.route && h.route.path) {
            const methods = Object.keys(h.route.methods).filter(Boolean).map(s=>s.toUpperCase());
            routes.push({ path: h.route.path, methods });
          }
        });
      }
    });
    return routes;
  } catch (e) { return []; }
}

app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const routes = listRoutes();
  const html = [
    '<!doctype html><meta charset="utf-8"><title>upload-backend</title>',
    '<h1>Upload Backend</h1>',
    '<p>Beschikbare endpoints:</p>',
    '<ul>',
    ...routes.map(r=>'<li>'+r.methods.join(', ')+' '+r.path+'</li>'),
    '</ul>',
  ].join('');
  res.type('html').send(html);
});

app.get('/__diag', (req, res) => {
  try {
    const newsPath = path.resolve(repoRoot, 'news.json');
    const logsPath = path.resolve(repoRoot, 'logs', 'logs.json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      ok: true,
      cwd: process.cwd(),
      dirname: __dirname,
      repoRoot,
      node: process.version,
      port: PORT,
      routes: listRoutes(),
      files: {
        newsJsonExists: fs.existsSync(newsPath),
        logsJsonExists: fs.existsSync(logsPath)
      }
    });
  } catch (e) {
    res.status(500).json({ ok:false, error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Upload backend draait op http://localhost:${PORT}`);
  try {
    const routes = listRoutes();
    console.log('➡️  Routes:', routes.map(r=>`${r.methods.join(',')} ${r.path}`).join(' | '));
  } catch {}
});
