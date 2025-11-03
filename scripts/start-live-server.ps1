$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
Write-Host "Start Live Server op http://localhost:8000 ..." -ForegroundColor Cyan

# Check python aanwezig
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
	Write-Host "Python niet gevonden. Installeer Python of voeg het aan PATH toe." -ForegroundColor Red
	if (-not $env:__NO_PAUSE) { Write-Host "\nDruk op Enter om af te sluiten..." -ForegroundColor DarkGray; Read-Host | Out-Null }
	exit 1
}

python -m http.server 8000
if (-not $env:__NO_PAUSE) {
	Write-Host "\nDruk op Enter om af te sluiten..." -ForegroundColor DarkGray
	Read-Host | Out-Null
}