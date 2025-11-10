// Minimal GitHub Actions dispatch helper used across admin/logs/live-tools
// It posts to a Cloudflare Worker routed at /api/gh/dispatch (live),
// or falls back to opening the GitHub UI if unavailable.
(function(global){
  function toast(msg, ok){
    try{
      const el = document.createElement('div');
      el.textContent = msg;
      el.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:18px;padding:10px 14px;border-radius:10px;font-weight:700;z-index:9999;'+
        (ok===false ? 'background:#ef4444;color:#210909;' : 'background:#16a34a;color:#081b10;');
      document.body.appendChild(el);
      setTimeout(function(){ el.remove(); }, 2400);
    }catch{}
  }

  function onLiveHost(){
    try{
      var h = location.hostname||'';
      return h === 'mister.us.kg' || h.endsWith('.mister.us.kg');
    }catch{return false}
  }

  async function tryDispatch(kind){
    const readErr = async (res) => {
      try{
        const ct = res.headers.get('content-type')||'';
        if (ct.includes('application/json')){
          const j = await res.json();
          return (j && (j.message||j.error)) || JSON.stringify(j);
        }
        return await res.text();
      }catch{return ''}
    };
    const candidates = [];
    if (kind === 'ci') candidates.push('ci','ci.yml','.github/workflows/ci.yml');
    else if (kind === 'pages') candidates.push('pages');
    else if (kind) candidates.push(kind);
    else candidates.push('ci','ci.yml','.github/workflows/ci.yml');

    const controller = new AbortController();
    const timer = setTimeout(function(){ try{controller.abort();}catch{} }, 6500);
    const endpoint = onLiveHost() ? '/api/gh/dispatch' : 'https://mister.us.kg/api/gh/dispatch';
    try{
      for (var i=0;i<candidates.length;i++){
        var wf = candidates[i];
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'content-type':'application/json' },
          body: JSON.stringify({ workflow: wf, ref: 'main' }),
          signal: controller.signal
        });
        if (res.ok){
          clearTimeout(timer);
          const data = await res.json().catch(function(){return {}});
          toast((data && data.message) || ("Workflow '"+wf+"' gestart"));
          return true;
        }
        const detail = await readErr(res);
        console.warn('[gh-dispatch]', wf, '->', res.status, res.statusText, detail||'');
      }
      clearTimeout(timer);
      return false;
    }catch(e){
      clearTimeout(timer);
      console.error('[gh-dispatch] fout:', e);
      return false;
    }
  }

  async function open(kind){
    toast('Actie starten…');
    const ok = await tryDispatch(kind);
    if (ok) return;
    // Fallback: open GitHub UI
    const base = 'https://github.com/chinfosieeuw9-prog/mister-portfolio';
    if (kind === 'ci'){
      window.open(base + '/actions/workflows/ci.yml', '_blank', 'noopener');
      toast('Worker niet ingesteld: open CI in GitHub', false);
      return;
    }
    if (kind === 'pages'){
      window.open(base + '/actions?query=workflow%3A%22pages+build+and+deployment%22', '_blank', 'noopener');
      toast('Worker niet ingesteld: open Pages in GitHub', false);
      return;
    }
    window.open(base + '/actions', '_blank', 'noopener');
    toast('Worker niet ingesteld: open Actions in GitHub', false);
  }

  global.GHDispatch = { try: tryDispatch, open: open, toast: toast };
})(window);
