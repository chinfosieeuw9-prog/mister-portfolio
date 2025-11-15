import React, { useEffect, useState } from "react";
import { getVersion } from "../utils/version";
import AdminLogs from "./AdminLogs";

export default function AdminDashboard() {
  const [version, setVersion] = useState("");
  useEffect(() => {
    getVersion().then(v => setVersion(v));
  }, []);
  return (
    <div style={{ maxWidth: 1000, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Admin Dashboard</h1>
      <nav style={{ marginBottom: 24 }}>
        <a href="#logs" style={{ marginRight: 16 }}>Backup & Logbeheer</a>
        {/* Voeg hier meer admin-links toe */}
      </nav>
      <section id="logs">
        <AdminLogs />
      </section>

      {/* Footer in moderne stijl */}
      <footer style={{
        marginTop: 48,
        background: '#181f2a',
        color: '#a3adc2',
        borderTop: '1px solid #232b3b',
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: 16,
        letterSpacing: 0.1,
        width: '100%',
        padding: 0
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '32px 24px 0 24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          minHeight: 180
        }}>
          <div style={{ flex: '1 1 180px', minWidth: 120 }}>
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4C13.0589 4 4 13.0589 4 24C4 34.9411 13.0589 44 24 44C34.9411 44 44 34.9411 44 24C44 13.0589 34.9411 4 24 4Z" fill="#6366F1"/>
              <path d="M34 24C34 29.5228 29.5228 34 24 34C18.4772 34 14 29.5228 14 24C14 18.4772 18.4772 14 24 14C29.5228 14 34 18.4772 34 24Z" fill="#A5B4FC"/>
            </svg>
          </div>
          <div style={{ flex: '2 1 600px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', minWidth: 400 }}>
            <div>
              <div style={{ fontWeight: 600, color: '#fff', marginBottom: 8 }}>Solutions</div>
              <div>Marketing</div>
              <div>Analytics</div>
              <div>Automation</div>
              <div>Commerce</div>
              <div>Insights</div>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#fff', marginBottom: 8 }}>Support</div>
              <div>Submit ticket</div>
              <div>Documentation</div>
              <div>Guides</div>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#fff', marginBottom: 8 }}>Company</div>
              <div>About</div>
              <div>Blog</div>
              <div>Jobs</div>
              <div>Press</div>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: '#fff', marginBottom: 8 }}>Legal</div>
              <div>Terms of service</div>
              <div>Privacy policy</div>
              <div>License</div>
            </div>
          </div>
        </div>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #232b3b',
          fontSize: 15
        }}>
          <div>
            © Copyright 2025 Misterplace - Version v{version || "1.0.0"} - All Rights Reserved
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            <a href="#" style={{ color: '#a3adc2' }} aria-label="Facebook"><svg width="22" height="22" fill="currentColor"><circle cx="11" cy="11" r="11" fill="#232b3b"/><text x="7" y="16" fontSize="12" fill="#fff">f</text></svg></a>
            <a href="#" style={{ color: '#a3adc2' }} aria-label="Instagram"><svg width="22" height="22" fill="currentColor"><circle cx="11" cy="11" r="11" fill="#232b3b"/><text x="5" y="16" fontSize="12" fill="#fff">ig</text></svg></a>
            <a href="#" style={{ color: '#a3adc2' }} aria-label="X"><svg width="22" height="22" fill="currentColor"><circle cx="11" cy="11" r="11" fill="#232b3b"/><text x="7" y="16" fontSize="12" fill="#fff">X</text></svg></a>
            <a href="#" style={{ color: '#a3adc2' }} aria-label="GitHub"><svg width="22" height="22" fill="currentColor"><circle cx="11" cy="11" r="11" fill="#232b3b"/><text x="4" y="16" fontSize="12" fill="#fff">gh</text></svg></a>
            <a href="#" style={{ color: '#a3adc2' }} aria-label="YouTube"><svg width="22" height="22" fill="currentColor"><circle cx="11" cy="11" r="11" fill="#232b3b"/><text x="2" y="16" fontSize="12" fill="#fff">yt</text></svg></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
