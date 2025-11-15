
import React, { useEffect, useState } from "react";
import { getVersion } from '../utils/version';
import { supabase } from "../utils/supabaseClient";

function AdminPage() {
  const [showDetails, setShowDetails] = useState(false);
  const [detailsLog, setDetailsLog] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [version, setVersion] = useState("");

  // Laad logboek direct uit Supabase workflows-tabel
  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('started_at', { ascending: false });
      if (error) throw error;
      setLogs(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Kan logboek niet laden: " + (e.message || e));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
    // Laad versie uit version.json
    (async () => {
      const v = await getVersion();
      setVersion(v);
    })();
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
      // Haal versie op uit version.js (optioneel, fallback naar v1.0.0)
      let versie = version;
      try {
        const mod = await import('../utils/version');
        versie = (await mod.getVersion?.()) || version || 'v1.0.0';
      } catch {}
      const { error } = await supabase
        .from('workflows')
        .insert([{ type: 'backup', started_at: new Date().toISOString(), message: 'Backup gestart door admin', status: 'success', versie }]);
      if (error) throw error;
      alert('Backup workflow gestart!');
      fetchLogs();
    } catch (e) {
      setError("Kan workflow niet starten: " + (e.message || e));
    }
    setLoading(false);
  };
  const handleOpenBackup = () => alert('Open laatste backup (dummy)');
  // Voeg handmatige notitie toe aan logboek
  const handleAddNote = async () => {
    const note = window.prompt('Voer je notitie in:');
    if (!note || note.trim() === '') return;
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase
        .from('workflows')
        .insert([{ type: 'notitie', started_at: new Date().toISOString(), message: note.trim() }]);
      if (error) throw error;
      fetchLogs();
    } catch (e) {
      setError("Kan notitie niet toevoegen: " + (e.message || e));
    }
    setLoading(false);
  };

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
              <div key={log.id || i} style={{background:'#23234a',borderRadius:10,padding:18,marginBottom:18,boxShadow:'0 1px 6px #0001'}}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:6}}>
                  <span style={{fontWeight:700,fontSize:18,color:'#7ee6fd'}}>{log.type ? log.type : 'workflow'}</span>
                  {log.status && <span style={{background:log.status==='success'?'#22c55e':'#ef4444',color:'#fff',borderRadius:6,padding:'2px 10px',fontSize:13,fontWeight:600}}>{log.status}</span>}
                  <span style={{color:'#aaa',fontSize:13}}>{log.started_at ? new Date(log.started_at).toLocaleString() : ''}</span>
                  {log.versie && <span style={{background:'#181828',color:'#facc15',borderRadius:6,padding:'2px 8px',fontSize:13,marginLeft:8}}>v{log.versie}</span>}
                </div>
                <div style={{marginBottom:8,color:'#fff'}}>{log.message}</div>
                <div style={{display:'flex',gap:8}}>
                  <button style={{padding:'4px 12px',background:'#23234a',color:'#fff',border:'none',borderRadius:6,cursor:'pointer',fontSize:13}} onClick={()=>{setDetailsLog(log);setShowDetails(true);}}>Details</button>
                  <button style={{padding:'4px 12px',background:'#23234a',color:'#7ee6fd',border:'none',borderRadius:6,cursor:'pointer',fontSize:13}}>Permalink</button>
                  <button style={{padding:'4px 12px',background:'#23234a',color:'#fff',border:'none',borderRadius:6,cursor:'pointer',fontSize:13}} onClick={()=>navigator.clipboard.writeText(JSON.stringify(log,null,2))}>Copy</button>
                </div>
              </div>
            ))}

      {/* Details Modal */}
      {showDetails && detailsLog && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.7)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setShowDetails(false)}>
          <div style={{background:'#23234a',padding:32,borderRadius:12,minWidth:340,maxWidth:480,color:'#fff',boxShadow:'0 4px 32px #000a',position:'relative'}} onClick={e=>e.stopPropagation()}>
            <h3 style={{marginTop:0,marginBottom:16}}>Log details</h3>
            <pre style={{whiteSpace:'pre-wrap',wordBreak:'break-all',fontSize:15,background:'#181828',padding:12,borderRadius:8,maxHeight:320,overflowY:'auto'}}>{JSON.stringify(detailsLog,null,2)}</pre>
            <button style={{position:'absolute',top:12,right:16,background:'#ef4444',color:'#fff',border:'none',padding:'6px 16px',borderRadius:6,fontWeight:600,cursor:'pointer'}} onClick={()=>setShowDetails(false)}>Sluiten</button>
          </div>
        </div>
      )}
          </div>
        </div>
      </section>
      <footer style={{textAlign:'center',color:'#aaa',marginTop:40,fontSize:15}}>
        &copy; Copyright 2025 Misterplace - V{version || '?'} Rights Reserved
      </footer>
    </div>
  );
}

export default AdminPage;
