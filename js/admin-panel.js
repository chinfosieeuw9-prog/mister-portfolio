// Admin access - triple click on footer to show admin login
let clickCount = 0;
let clickTimer = null;
document.querySelector('.footer').addEventListener('click', function() {
    clickCount++;
    console.log(`🖱️ Footer click ${clickCount}/3`);
    if (clickCount === 1) {
        clickTimer = setTimeout(() => { clickCount = 0; }, 1000);
    } else if (clickCount === 3) {
        clearTimeout(clickTimer);
        clickCount = 0;
        console.log('🔓 Triple-click detected - opening admin access');
        toggleAdminAccess();
    }
});
// Admin login button click handler - MOVED TO DOMContentLoaded
// Admin login form handler - MOVED TO DOMContentLoaded
function toggleAdminAccess() {
    const adminAccess = document.getElementById('admin-access');
    if (adminAccess.classList.contains('hidden')) {
        adminAccess.classList.remove('hidden');
        adminAccess.scrollIntoView({ behavior: 'smooth' });
    } else {
        adminAccess.classList.add('hidden');
    }
}
// Secure admin login - MOVED TO DOMContentLoaded
// Create admin panel
function createAdminPanel() {
    const adminPanel = document.createElement('div');
    adminPanel.className = 'card';
    adminPanel.innerHTML = `
        <h2>🛠️ Admin Panel</h2>
        <div style="display: grid; gap: 12px; margin-top: 16px;">
            <button class="submit-btn" onclick="uploadCV()">📄 Upload CV</button>
            <button class="submit-btn" onclick="manageContent()">✏️ Edit Content</button>
            <button class="submit-btn" onclick="viewAnalytics()">📊 View Analytics</button>
            <button class="submit-btn" onclick="openSoftwareExplorer()">💾 Software Explorer</button>
            <button class="submit-btn" onclick="manageImages()">🖼️ Manage Images</button>
            <button class="submit-btn" style="background: #ff4444;" onclick="logout()">🚪 Logout</button>
        </div>
    `;
    document.querySelector('.container').appendChild(adminPanel);
    adminPanel.scrollIntoView({ behavior: 'smooth' });
    // Show admin-only buttons
    showAdminButtons();
}
// ... Plaats hier de rest van je admin functies ...

// Supabase config
const SUPABASE_URL = 'https://dvwmphrmrbczgasuouiz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2d21waHJtcmJjemdhc3VvdWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDM4MDUsImV4cCI6MjA3NzIxOTgwNX0.TWP5tnVgA4HO7h-pebXiRG_pIq21XGxYgqUE-gipvBE';

async function fetchNews() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/news?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  return await res.json();
}

async function addNews(article) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/news`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify([article])
  });
  return await res.json();
}
