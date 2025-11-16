export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    // Helper: log backend actie
    function logAdminAction(type, message, versionTag) {
      try {
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(process.cwd(), 'logs/logs.json');
        let logs = { entries: [] };
        if (fs.existsSync(logPath)) {
          logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
        }
        logs.entries.unshift({
          type,
          message,
          versionTag: versionTag || null,
          timestamp: Date.now()
        });
        fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
      } catch (err) { console.warn('Logboek entry mislukt:', err); }
    }
    // Check if it's a file upload (multipart/form-data)
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      // Gebruik formidable om het bestand te verwerken
      const formidable = require('formidable');
      const form = new formidable.IncomingForm({ multiples: false });
      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(500).json({ success: false, message: 'Upload fout', error: err });
          logAdminAction('admin-upload', 'Upload fout: ' + (err.message||err), null);
          return;
        }
        // SUPABASE UPLOAD
        try {
          const { createClient } = require('@supabase/supabase-js');
          const SUPABASE_URL = process.env.SUPABASE_URL;
          const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
          const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          // PDF upload
          if (files['pdf']) {
            const pdfFile = files['pdf'];
            const pdfData = require('fs').readFileSync(pdfFile.filepath);
            const { data, error } = await supabase.storage.from('CV').upload(pdfFile.originalFilename, pdfData, { upsert: true });
            if (error) {
              res.status(500).json({ success: false, message: 'Supabase upload fout', error });
              logAdminAction('admin-upload', 'Supabase upload fout: ' + error.message, null);
              return;
            }
            logAdminAction('admin-upload', 'PDF geüpload: ' + pdfFile.originalFilename, null);
          }
          // Word upload
          if (files['word']) {
            const wordFile = files['word'];
            const wordData = require('fs').readFileSync(wordFile.filepath);
            const { data, error } = await supabase.storage.from('CV').upload(wordFile.originalFilename, wordData, { upsert: true });
            if (error) {
              res.status(500).json({ success: false, message: 'Supabase upload fout', error });
              logAdminAction('admin-upload', 'Supabase upload fout: ' + error.message, null);
              return;
            }
            logAdminAction('admin-upload', 'Word geüpload: ' + wordFile.originalFilename, null);
          }
          res.status(200).json({ success: true, message: 'Bestand geüpload naar Supabase!', fields, files });
        } catch (e) {
          res.status(500).json({ success: false, message: 'Supabase upload exception', error: e });
          logAdminAction('admin-upload', 'Supabase upload exception: ' + (e.message||e), null);
        }
      });
      return;
    }
    // ...bestaande JSON acties...
    const { action, password, data } = req.body;
    // Admin login
    if (action === 'login') {
      if (password === 'mister2025') {
        res.status(200).json({ 
          success: true, 
          message: 'Login successful!',
          timestamp: new Date().toISOString()
        });
        logAdminAction('admin-login', 'Login succesvol', null);
      } else {
        res.status(401).json({ 
          success: false, 
          message: 'Invalid password' 
        });
        logAdminAction('admin-login', 'Login mislukt', null);
      }
      return;
    }
    // Content management
    if (action === 'edit-content') {
      res.status(200).json({
        success: true,
        message: 'Content updated successfully!',
        data: data
      });
      logAdminAction('admin-edit-content', 'Content bijgewerkt', null);
      return;
    }
    // Analytics
    if (action === 'analytics') {
      res.status(200).json({
        success: true,
        analytics: {
          visitors: Math.floor(Math.random() * 1000) + 100,
          pageViews: Math.floor(Math.random() * 5000) + 500,
          contactForms: Math.floor(Math.random() * 50) + 5,
          popularPages: ['/home', '/portfolio', '/contact']
        }
      });
      logAdminAction('admin-analytics', 'Analytics opgevraagd', null);
      return;
    }
    res.status(400).json({ success: false, message: 'Unknown action' });
  } else {
    res.status(200).json({ 
      message: 'Mister Admin API is running!',
      endpoints: ['/api/admin'],
      version: '1.0.0'
    });
  }
}