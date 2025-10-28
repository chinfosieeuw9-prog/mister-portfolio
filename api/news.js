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
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update news.json' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
