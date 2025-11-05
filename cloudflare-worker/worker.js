export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    try {
      const allowedOrigin = (env.ALLOW_ORIGIN || '*');
      const url = new URL(request.url);
      const p = url.pathname;
      // Support mounting at root (/dispatch) or as a route under the site (/api/gh/dispatch)
      if (p === '/' || p === '/dispatch' || p === '/api/gh/dispatch' || p === '/api/gh/dispatch/') {
        if (request.method !== 'POST') {
          return json({ error: 'Use POST' }, 405, allowedOrigin);
        }
        const body = await request.json().catch(() => ({}));
        const workflow = String(body.workflow || '').trim(); // e.g. 'ci.yml'
        const ref = String(body.ref || 'main');
        const inputs = body.inputs || {};

        const owner = env.GH_OWNER || 'chinfosieeuw9-prog';
        const repo = env.GH_REPO || 'mister-portfolio';
        const token = env.GH_TOKEN; // Fine-grained PAT with repo:actions:write
        if (!token) return json({ error: 'Missing GH_TOKEN' }, 500, allowedOrigin);

        // allowlist to prevent arbitrary dispatches
        const allowlist = (env.ALLOWED_WORKFLOWS || 'ci.yml').split(',').map(s=>s.trim()).filter(Boolean);
        if (!allowlist.includes(workflow)) {
          return json({ error: 'Workflow not allowed', workflow }, 400, allowedOrigin);
        }

        const ghUrl = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${encodeURIComponent(workflow)}/dispatches`;
        const resp = await fetch(ghUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'cf-gh-dispatch-worker'
          },
          body: JSON.stringify({ ref, inputs })
        });

        if (!resp.ok) {
          const text = await resp.text();
          return json({ ok: false, status: resp.status, body: text }, 502, allowedOrigin);
        }
        return json({ ok: true }, 200, allowedOrigin);
      }
      return json({ error: 'Not found' }, 404, (env.ALLOW_ORIGIN||'*'));
    } catch (e) {
      return json({ error: String(e && e.message || e) }, 500, (env && env.ALLOW_ORIGIN) || '*');
    }
  }
}

function corsHeaders(env){
  return {
    'Access-Control-Allow-Origin': env && env.ALLOW_ORIGIN ? env.ALLOW_ORIGIN : '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
}
function json(data, status = 200, origin='*'){
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin'
    }
  });
}
