import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'news.json');

  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      res.status(200).json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: 'Failed to read news.json' });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { title, date, content, link } = req.body;
      if (!title || !date || !content) {
        res.status(400).json({ error: 'Missing fields' });
        return;
      }
      const data = fs.readFileSync(filePath, 'utf8');
      const news = JSON.parse(data);
      news.unshift({ title, date, content, link: link || '#' });
      fs.writeFileSync(filePath, JSON.stringify(news, null, 2));

      // Automatisch log entry toevoegen aan logs.json
      try {
        const logPath = path.join(process.cwd(), 'logs/logs.json');
        let logs = { entries: [] };
        if (fs.existsSync(logPath)) {
          logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
        }
        const entry = {
          type: 'news',
          message: `[NEWS] ${title} - ${content.substring(0, 120)}...`,
          versionTag: null,
          timestamp: Date.now()
        };
        logs.entries.unshift(entry);
        fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
      } catch (logErr) {
        // Logging mag niet falen op nieuws toevoegen
        console.warn('Kon log entry niet toevoegen:', logErr);
      }

      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update news.json' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
