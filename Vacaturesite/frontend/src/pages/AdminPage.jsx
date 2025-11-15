
import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

function AdminPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [version, setVersion] = useState("");

  // Laad logs.json uit public folder
  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/logs.json?_=" + Date.now());
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length > 0 && data[0].version) {
        setVersion(data[0].version);
      }
    } catch (e) {
      setError("Kan logs.json niet laden");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Download logs.json
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = '/logs.json?_=' + Date.now();
    a.download = 'logs.json';
    a.click();
  };

  // Dummy handlers voor knoppen
  // Start backup workflow via Supabase
  const handleRunWorkflow = async () => {
    setLoading(true);
    setError("");
    try {
      // Voeg een entry toe aan een Supabase tabel 'workflows' (of 'backups')
      const { error } = await supabase
        .from('workflows')
        .insert([{ type: 'backup', started_at: new Date().toISOString() }]);
      if (error) throw error;
      alert('Backup workflow gestart!');
      // Optioneel: logs opnieuw laden
      fetchLogs();
    } catch (e) {
      setError("Kan workflow niet starten: " + (e.message || e));
    }
    setLoading(false);
  };
  const handleOpenBackup = () => alert('Open laatste backup (dummy)');
  const handleAddNote = () => alert('Notitie toevoegen (dummy)');

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: 24 }}>
      <h1 style={{marginBottom:24}}>Admin: Log & Backup Beheer</h1>
      <section style={{ marginBottom: 40 }}>
        <h2 style={{marginBottom:16}}>Logboek</h2>
        <div style={{background:'#181828',borderRadius:12,padding:24,boxShadow:'0 2px 12px #0002',marginBottom:24}}>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16}}>
            <button onClick={fetchLogs} style={{padding:'8px 18px',background:'#23234a',color:'#fff',border:'none',borderRadius:6,cursor:'pointer'}}>Vernieuwen</button>
            <button onClick={handleRunWorkflow} style={{padding:'8px 18px',background:'#23234a',color:'#fff',border:'none',borderRadius:6,cursor:'pointer'}}>Run workflow</button>
            <button onClick={handleOpenBackup} style={{padding:'8px 18px',background:'#22c55e',color:'#fff',border:'none',borderRadius:6,cursor:'pointer'}}>Open laatste backup</button>
            <button onClick={handleAddNote} style={{padding:'8px 18px',background:'#23234a',color:'#fff',border:'none',borderRadius:6,cursor:'pointer'}}>Notitie toevoegen</button>
            <button onClick={handleDownload} style={{padding:'8px 18px',background:'#23234a',color:'#fff',border:'none',borderRadius:6,cursor:'pointer'}}>Download logs.json</button>
          </div>
          {loading && <div style={{color:'#aaa'}}>Laden...</div>}
          {error && <div style={{color:'#ef4444'}}>{error}</div>}
          <div style={{maxHeight:400,overflowY:'auto'}}>
            {logs.length === 0 && !loading && <div style={{color:'#aaa'}}>Geen logregels gevonden.</div>}
            {logs.map((log, i) => (
              <div key={i} style={{background:'#23234a',borderRadius:10,padding:18,marginBottom:18,boxShadow:'0 1px 6px #0001'}}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:6}}>
                  <span style={{fontWeight:700,fontSize:18,color:'#7ee6fd'}}>v{log.version || '?'}</span>
                  <span style={{background:log.status==='success'?'#22c55e':'#ef4444',color:'#fff',borderRadius:6,padding:'2px 10px',fontSize:13,fontWeight:600}}>{log.status}</span>
                  <span style={{color:'#aaa',fontSize:13}}>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div style={{marginBottom:8,color:'#fff'}}>{log.message}</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:8}}>
                  {log.items && log.items.map((item, idx) => (
                    <span key={idx} style={{background:'#181828',color:'#7ee6fd',borderRadius:6,padding:'2px 8px',fontSize:13}}>{item}</span>
                  ))}
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button style={{padding:'4px 12px',background:'#23234a',color:'#fff',border:'none',borderRadius:6,cursor:'pointer',fontSize:13}}>Details</button>
                  <button style={{padding:'4px 12px',background:'#23234a',color:'#7ee6fd',border:'none',borderRadius:6,cursor:'pointer',fontSize:13}}>Permalink</button>
                  <button style={{padding:'4px 12px',background:'#23234a',color:'#fff',border:'none',borderRadius:6,cursor:'pointer',fontSize:13}} onClick={()=>navigator.clipboard.writeText(JSON.stringify(log,null,2))}>Copy</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer style={{textAlign:'center',color:'#aaa',marginTop:40,fontSize:15}}>
        Versie: <b>v{version || '?'}</b> &mdash; Mister Admin
      </footer>
    </div>
  );
}

export default AdminPage;
