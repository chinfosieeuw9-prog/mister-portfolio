$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$backendDir = Join-Path $root 'upload-backend'
if (-not (Test-Path $backendDir)) { throw "upload-backend map niet gevonden: $backendDir" }
Set-Location $backendDir
if (-not (Test-Path 'node_modules')) { npm install }
$env:PORT = 3002
Write-Host "Start backend op PORT=3002..." -ForegroundColor Cyan

# Check node aanwezig
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
	Write-Host "Node.js niet gevonden. Installeer Node (https://nodejs.org), of voeg het aan PATH toe." -ForegroundColor Red
	if (-not $env:__NO_PAUSE) { Write-Host "\nDruk op Enter om af te sluiten..." -ForegroundColor DarkGray; Read-Host | Out-Null }
	exit 1
}

# Waarschuwing als .env ontbreekt (gaat wel starten)
$envPath = Join-Path $backendDir '.env'
if (-not (Test-Path $envPath)) {
	Write-Warning ".env ontbreekt in upload-backend (GITHUB_TOKEN / GITHUB_REPO). Certain routes kunnen falen."
}

node index.js
$code = $LASTEXITCODE
if ($code -ne 0) {
	Write-Host "Backend gestopt met exit code $code" -ForegroundColor Red
}
if (-not $env:__NO_PAUSE) {
	Write-Host "\nDruk op Enter om af te sluiten..." -ForegroundColor DarkGray
	Read-Host | Out-Null
}