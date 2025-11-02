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


const {
  GITHUB_TOKEN,
  GITHUB_REPO,
  GITHUB_BRANCH = 'main',
  GITHUB_UPLOAD_PATH = 'uploads/'
} = process.env;

const PORT = process.env.PORT || 3001;
const { ABLY_API_KEY } = process.env;

if (!GITHUB_TOKEN || !GITHUB_REPO) {
  console.error('❌ GITHUB_TOKEN en GITHUB_REPO zijn verplicht in .env');
  process.exit(1);
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.post('/upload', upload.single('file'), async (req, res) => {
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
    const scriptPath = path.resolve(__dirname, '..', 'full-backup-workflow.ps1');
    const cmd = `powershell.exe -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`;
    exec(cmd, { cwd: path.resolve(__dirname, '..') }, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ ok: false, error: error.message, stdout, stderr });
      }
      res.json({ ok: true, stdout, stderr });
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Upload backend draait op http://localhost:${PORT}`);
});
