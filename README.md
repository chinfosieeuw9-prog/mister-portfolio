# Mister Portfolio

Korte notities voor beheer en hosting van deze site.

## Kaartstijl (site‑breed)

De rand/radius/schaduw van kaarten is gecentraliseerd via CSS‑variabelen in `css/style.css`:

```css
:root {
  --card-border-w: 1.5px;
  --card-radius: 14px;
  --card-border-color: #333;
  --card-shadow: 0 4px 16px #0002;
}
```

- Alle `.card` elementen lezen deze variabelen uit.
- Op `scripts.html` kun je snel presets proberen (dun/normaal/dik/extra); dit wijzigt dezelfde variabelen runtime.

## Cloudflare HTTPS (Strict + HSTS + CSP)

Productie loopt via Cloudflare (proxy) met GitHub Pages/Vercel erachter. Aanbevolen instellingen:

1. DNS (Proxy aan): Zet de relevante DNS‑records (A/AAAA/CNAME) op “Proxied” (oranje wolkje) zodat Cloudflare TLS afhandelt.
2. SSL/TLS‑modus: Stel in op “Full (strict)” voor end‑to‑end certificaatvalidatie.
3. HSTS: Onder SSL/TLS → Edge Certificates → HSTS, zet HSTS aan met minimaal 6 maanden en includeSubDomains. Activeer preload indien gewenst.
4. Redirects: Forceer https → Stel een redirect rule of gebruik Always Use HTTPS.
5. CSP: Mixed content vermijden.
   - Frontend injecteert `upgrade-insecure-requests` automatisch op https‑pagina’s (zie `js/status-indicators.js`).
   - Vermijd hard‑gecodeerde `http://` assets; gebruik protocol‑relatieve of https‑URLs.
6. CORS/Workers: Als je een Cloudflare Worker gebruikt voor GitHub Actions dispatch of API‑proxy, zorg voor correcte CORS‑headers en beperk origins naar de live domeinen.

## CI / GitHub Actions

- Workflows zijn te triggeren via de Live Tools pagina (via een Worker endpoint) of handmatig in GitHub (workflow_dispatch).
- Zorg dat de Worker `GH_TOKEN` secret heeft met voldoende rechten voor `workflow`.

### Worker route en 1‑klik dispatch

- Route: `mister.us.kg/api/gh/dispatch*` (Workers & Pages → jouw Worker → Settings → Domains & Routes → Add route)
- Endpoint accepteert POST `{ workflow: "ci.yml", ref: "main" }` en is al geïntegreerd in `live-tools.html`, `admin.html` en `logs.html`.
- Optionele variabelen (Workers & Pages → Settings → Variables and Secrets):
  - `ALLOW_ORIGIN = https://mister.us.kg`
  - `ALLOWED_WORKFLOWS = ci.yml`

## Security headers via Cloudflare (Transform Rules)

Stel deze in op je ZONE (niet in het Worker‑scherm):

1) Ga naar de zone `mister.us.kg` → Rules → Transform Rules → HTTP Response Header Modification → Create rule
2) Rule name: `security-headers-baseline`
3) If incoming requests match: `All incoming requests`
4) Then (Modify response header): voeg/set de volgende headers (klik “Set new header” per regel)

- Action: Set static, Header name: `X-Content-Type-Options`, Value: `nosniff`
- Action: Set static, Header name: `Referrer-Policy`, Value: `strict-origin-when-cross-origin`
- Action: Set static, Header name: `Permissions-Policy`, Value: `camera=(), microphone=(), geolocation=()`

Opslaan/Deploy. Verifiëren kan via DevTools → Network → Response Headers of met curl.

## Logs & Backups

- `logs/logs.json`: recente acties en backups.
- Knop “📌 Open laatste backup” staat op `logs.html` en in de Admin Logboek‑tab.

## Lokaal vs Live

- Lokaal: Live Server op poort 8000. Backend detectie op 3002 met auto‑detect.
- Live: lokale scripts en workflows zijn uitgeschakeld op de Script Runner; gebruik de Live Tools links.
