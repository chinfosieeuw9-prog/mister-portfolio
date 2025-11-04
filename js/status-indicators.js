(function(){
  try{
    // Inject minimal CSS once
    if (!document.getElementById('status-indicators-css')){
      const css = document.createElement('style');
      css.id = 'status-indicators-css';
      css.textContent = `
      .si-dock{position:fixed;top:8px;right:8px;display:flex;gap:6px;flex-wrap:wrap;z-index:9998}
      .si-chip{display:inline-flex;align-items:center;gap:6px;padding:2px 8px;border-radius:999px;border:1px solid #333;color:#9ca3af;font:12px/1.4 ui-sans-serif,system-ui,Segoe UI,Roboto,Arial,sans-serif;background:rgba(0,0,0,.25)}
      .si-chip.si-ok{color:#22c55e;border-color:#195b37}
      .si-chip.si-warn{color:#f59e0b;border-color:#5b4a1d}
      .si-chip.si-err{color:#ef4444;border-color:#5b1d1d}
      .si-pill{display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;border:1px dashed #444;color:#cbd5e1;background:rgba(0,0,0,.15);cursor:default}
      .si-pill.si-click{cursor:pointer;border-style:solid}
      `;
      document.head.appendChild(css);
    }

    // When on HTTPS, add a CSP meta to auto-upgrade insecure requests (prevents mixed-content warnings on Pages)
    try{
      if (location.protocol === 'https:' && !document.getElementById('si-csp-upgrade')){
        const m = document.createElement('meta');
        m.id = 'si-csp-upgrade';
        m.httpEquiv = 'Content-Security-Policy';
        m.content = 'upgrade-insecure-requests';
        // Insert as early as possible
        const head = document.head || document.getElementsByTagName('head')[0];
        head.insertBefore(m, head.firstChild || null);
      }
    }catch{}

    function normBase(u){ try{ return String(u||'').trim().replace(/\/$/,''); }catch{ return 'http://localhost:3002'; } }
    function getBase(){
      try{
        const ls = localStorage.getItem('backendBase')||'';
        const ss = sessionStorage.getItem('backendBase')||'';
        return normBase(ls||ss||'http://localhost:3002');
      }catch{ return 'http://localhost:3002'; }
    }
    function setBase(u){ try{ localStorage.setItem('backendBase', normBase(u)); sessionStorage.setItem('backendBase', normBase(u)); }catch{} }

    // Environment mode (local | live)
    function getEnvMode(){
      try{ return (localStorage.getItem('envMode')||'local').toLowerCase(); }catch{ return 'local'; }
    }
    function setEnvMode(mode){
      try{ localStorage.setItem('envMode', (mode||'local').toLowerCase()); }catch{}
    }

    async function detectBaseOnce(){
      const cands = [];
      try{ const saved = (localStorage.getItem('backendBase')||'').trim(); if(saved) cands.push(saved);}catch{}
      cands.push('http://localhost:3002','http://localhost:3001');
      const uniq = [...new Set(cands.map(normBase))];
      for (const b of uniq){
        try{ const r = await fetch(normBase(b)+'/health',{cache:'no-store'}); if(r.ok){ try{ sessionStorage.setItem('backendBase', normBase(b)); }catch{} return normBase(b);} }catch{}
      }
      return normBase(uniq[0]);
    }

    async function pingBackend(){
      // In LIVE omgeving geen lokale backend meten
      try { if (getEnvMode && getEnvMode()==='live') { return { ok:false, ms:null, base: getBase() }; } } catch { /* no-op */ }
      const base = await detectBaseOnce();
      const ctrl = new AbortController();
      const t0 = performance.now();
      let ok=false, ms=null;
      try{
        const to = setTimeout(()=>ctrl.abort(), 4000);
        const r = await fetch(base.replace(/\/$/,'')+'/health',{signal:ctrl.signal,cache:'no-store'});
        clearTimeout(to);
        ok = r.ok;
        ms = Math.max(0, Math.round(performance.now()-t0));
      }catch{ ok=false; }
      return { ok, ms, base };
    }

    function liveInfo(){
      try{
        const on8000 = String(location.port||'') === '8000';
        return { ok:on8000, txt: on8000 ? 'live: 8000' : 'live: niet 8000' };
      }catch{ return { ok:false, txt:'live: —' }; }
    }

    function shouldHideDock(){
      try{
        // Hide on homepage for non-admin visitors
        const p = String(location.pathname||'');
        const isHome = /(?:^|\/)index\.html$/i.test(p) || p === '/' || p === '';
        const params = new URLSearchParams(location.search||'');
        const adminFlag = params.get('admin') === '1';
        const isAdmin = (localStorage.getItem('isAdmin') === 'true') || adminFlag;
        return isHome && !isAdmin;
      }catch{ return false; }
    }

    function ensureDock(){
      if (shouldHideDock()){
        // Do not render dock for regular visitors on homepage
        return null;
      }
      let dock = document.querySelector('.si-dock');
      if (!dock){
        dock = document.createElement('div');
        dock.className = 'si-dock';
        dock.innerHTML = `
          <span id="si-chip-backend" class="si-chip">backend: —</span>
          <span id="si-chip-live" class="si-chip">live: —</span>
          <span id="si-pill-base" class="si-pill si-click" title="Klik om base te wisselen">base: —</span>
          <span id="si-pill-env" class="si-pill si-click" title="Klik om omgeving te wisselen">omgeving: —</span>
          <a id="si-pill-live-tools" class="si-pill si-click" href="https://mister.us.kg/live-tools.html" target="_blank" rel="noopener" title="Open Live Tools (https)">Live Tools</a>
        `;
        document.body.appendChild(dock);
      }
      return dock;
    }

    async function update(){
  const dock = ensureDock();
  if (!dock){ return; }
      const elB = document.getElementById('si-chip-backend');
      const elL = document.getElementById('si-chip-live');
  const elBase = document.getElementById('si-pill-base');
  const elEnv = document.getElementById('si-pill-env');

      // Live server
      const L = liveInfo();
      if (elL){
        elL.textContent = L.txt;
        elL.classList.remove('si-ok','si-warn','si-err');
        elL.classList.add(L.ok ? 'si-ok' : 'si-warn');
      }
      // Backend
      try{
        const { ok, ms, base } = await pingBackend();
        if (elB){
          elB.textContent = ok ? `backend: online (${ms}ms)` : 'backend: offline';
          elB.classList.remove('si-ok','si-warn','si-err');
          elB.classList.add(ok ? 'si-ok' : 'si-err');
        }
        if (elBase){ elBase.textContent = 'base: '+base; }
      }catch{
        if (elB){
          elB.textContent = 'backend: offline';
          elB.classList.remove('si-ok','si-warn','si-err');
          elB.classList.add('si-err');
        }
        if (elBase){ elBase.textContent = 'base: '+getBase(); }
      }

      // Environment pill
      try{
        const mode = getEnvMode();
        if (elEnv){ elEnv.textContent = 'omgeving: ' + (mode==='live'?'live':'lokaal'); }
      }catch{}
    }

    function cycleBase(){
      const cur = getBase();
      const order = ['http://localhost:3002','http://localhost:3001'];
      const idx = Math.max(0, order.indexOf(normBase(cur)));
      const next = order[(idx+1)%order.length];
      setBase(next);
      update();
    }

    function toggleEnv(){
      const cur = getEnvMode();
      const next = (cur==='live') ? 'local' : 'live';
      setEnvMode(next);
      // Optional: when switching to local, ensure a sensible base is set
      if (next==='local'){
        const b = getBase();
        if (!/^http:\/\/localhost:(3001|3002)$/i.test(b)){
          setBase('http://localhost:3002');
        }
      }
      update();
    }

    // Public init (optional)
    window.StatusIndicators = {
      init(){ ensureDock(); update(); if(!window.__siTimer){ window.__siTimer = setInterval(update, 6000); } },
      update,
      setBase,
      getBase,
      detectBaseOnce,
      getEnvMode,
      setEnvMode
    };

    // Auto-init after DOM ready
    if (document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', ()=>{
        if (!shouldHideDock()){
          StatusIndicators.init();
          const elBase = document.getElementById('si-pill-base');
          if (elBase){ elBase.addEventListener('click', cycleBase); }
          const elEnv = document.getElementById('si-pill-env');
          if (elEnv){ elEnv.addEventListener('click', toggleEnv); }
        }
      });
    } else {
      if (!shouldHideDock()){
        StatusIndicators.init();
        const elBase = document.getElementById('si-pill-base');
        if (elBase){ elBase.addEventListener('click', cycleBase); }
        const elEnv = document.getElementById('si-pill-env');
        if (elEnv){ elEnv.addEventListener('click', toggleEnv); }
      }
    }
  }catch(e){ /* no-op */ }
})();
