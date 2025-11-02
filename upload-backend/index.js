import express from 'express';
import multer from 'multer';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import Ably from 'ably';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const upload = multer({ dest: 'tmp/' });

// ESM dirname helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');


const {
  GITHUB_TOKEN,
  GITHUB_REPO,
  GITHUB_BRANCH = 'main',
  GITHUB_UPLOAD_PATH = 'uploads/'
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json());

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
    res.json({ success: true, url: response.data.content.html_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload naar GitHub mislukt.' });
  }
});

// Simple health endpoint for uptime checks
app.get('/health', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ ok: true, ts: Date.now() });
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
    exec(cmd, { cwd: repoRoot, timeout: 180000, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        const code = error.killed && error.signal === 'SIGTERM' ? 'TIMEOUT' : (error.code || 'ERR');
        return res.status(500).json({ ok: false, error: error.message, code, stdout, stderr });
      }
      res.json({ ok: true, stdout, stderr });
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Append a note entry to logs/logs.json
app.post('/logs/append', (req, res) => {
  try {
    const { message = '', versionTag = 'note', type = 'note' } = req.body || {};
    const logsPath = path.resolve(repoRoot, 'logs', 'logs.json');
    if (!fs.existsSync(logsPath)) {
      fs.mkdirSync(path.dirname(logsPath), { recursive: true });
      fs.writeFileSync(logsPath, JSON.stringify({ entries: [] }, null, 2));
    }
    const json = JSON.parse(fs.readFileSync(logsPath, 'utf8') || '{"entries":[]}');
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

app.listen(PORT, () => {
  console.log(`✅ Upload backend draait op http://localhost:${PORT}`);
});
