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
    const { action, password, data } = req.body;

    // Admin login
    if (action === 'login') {
      if (password === 'mister2025') {
        res.status(200).json({ 
          success: true, 
          message: 'Login successful!',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: 'Invalid password' 
        });
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