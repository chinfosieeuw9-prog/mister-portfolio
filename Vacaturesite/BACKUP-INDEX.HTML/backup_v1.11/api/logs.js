import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'logs/logs.json');

  if (req.method === 'POST') {
    try {
      const { type, message, versionTag } = req.body;
      if (!type || !message) {
        res.status(400).json({ error: 'Missing fields' });
        return;
      }
      let data = { entries: [] };
      if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      const entry = {
        type,
        message,
        versionTag: versionTag || null,
        timestamp: Date.now()
      };
      data.entries.unshift(entry);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update logs.json' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
