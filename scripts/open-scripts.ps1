$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$u = "http://localhost:8000/scripts.html"
Write-Host "Openen: $u" -ForegroundColor Cyan
Start-Process $u
if (-not $env:__NO_PAUSE) {
  Write-Host "\nKlaar. Sluit dit venster als het open is." -ForegroundColor DarkGray
}