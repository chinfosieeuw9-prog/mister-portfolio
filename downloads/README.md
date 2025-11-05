# Downloads folder

Plaats hier je bestanden voor directe downloads via de site.

Ondersteunde paden (zonder software.url):
- /downloads/<categorie>/<bestand>
- /downloads/<bestand>
- /files/<categorie>/<bestand>
- /files/<bestand>
- /<bestand>

Voorbeeld:
- Tool.exe in `downloads/utilities/Tool.exe`
- games.exe in `downloads/games/games.exe`

Let op: Live Server op poort 8000 serveert dit direct. In productie via Cloudflare Pages of een andere static host werkt dit identiek zolang de bestanden in de repo staan.