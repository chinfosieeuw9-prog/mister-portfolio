Cloudflare Worker: 1‑click GitHub Actions Dispatch

This worker exposes a POST endpoint to trigger a workflow_dispatch on your GitHub repository without exposing tokens to the frontend.

What it does
- Accepts JSON: { "workflow": "ci.yml", "ref": "main", "inputs": { ... } }
- Validates the workflow is allow‑listed (env ALLOWED_WORKFLOWS, default: ci.yml)
- Calls GitHub API: /repos/<owner>/<repo>/actions/workflows/<workflow>/dispatches
- Adds CORS for your site (ALLOW_ORIGIN)

Deploy (quick)
1) Install Wrangler (once): npm i -g wrangler
2) cd cloudflare-worker
3) Copy wrangler.toml.example to wrangler.toml and edit values if needed.
4) Set secrets:
   wrangler secret put GH_TOKEN
   # Use a fine‑grained GitHub token with Actions: write for this repo only
5) Route it under your production domain (recommended):
   - In Cloudflare Dashboard → Workers & Pages → your Worker → Triggers → Add route
   - Route pattern: mister.us.kg/api/gh/dispatch*
   - Or in wrangler.toml, set routes (see example below)
6) Publish:
   wrangler deploy

Environment variables (wrangler.toml [vars])
- ALLOW_ORIGIN: https://mister.us.kg (recommended)
- GH_OWNER: chinfosieeuw9-prog
- GH_REPO: mister-portfolio
- ALLOWED_WORKFLOWS: ci.yml

Use from the site
- Live Tools already posts to https://mister.us.kg/api/gh/dispatch (or relative /api/gh/dispatch when on the live host).
- Once the route is configured, the 1‑click buttons will trigger Actions securely via the Worker.

Test locally
- wrangler dev
- curl -X POST http://127.0.0.1:8787/dispatch -H "content-type: application/json" \
   -d '{"workflow":"ci.yml","ref":"main"}'

Security notes
- Never put the GH token in the frontend.
- Restrict ALLOW_ORIGIN to your production site.
- Use an allowlist for workflows and a fine‑grained PAT scoped to this single repo.

wrangler.toml route example

```
name = "gh-dispatch-worker"
main = "worker.js"
compatibility_date = "2024-01-01"

# Optional, but recommended to restrict CORS
[vars]
ALLOW_ORIGIN = "https://mister.us.kg"
GH_OWNER = "chinfosieeuw9-prog"
GH_REPO = "mister-portfolio"
ALLOWED_WORKFLOWS = "ci.yml"

# Bind to production route
routes = [
   { pattern = "mister.us.kg/api/gh/dispatch*", zone_name = "mister.us.kg" }
]

# Set via CLI (not committed)
# wrangler secret put GH_TOKEN
```
