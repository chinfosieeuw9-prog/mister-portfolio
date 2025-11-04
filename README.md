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

## Logs & Backups

- `logs/logs.json`: recente acties en backups.
- Knop “📌 Open laatste backup” staat op `logs.html` en in de Admin Logboek‑tab.

## Lokaal vs Live

- Lokaal: Live Server op poort 8000. Backend detectie op 3002 met auto‑detect.
- Live: lokale scripts en workflows zijn uitgeschakeld op de Script Runner; gebruik de Live Tools links.
