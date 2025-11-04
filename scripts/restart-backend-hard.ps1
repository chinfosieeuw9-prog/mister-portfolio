$ErrorActionPreference = 'Stop'
$scriptDir = $PSScriptRoot

Write-Host "Herstart backend (hard): kill 3002 -> start -> health -> open admin" -ForegroundColor Cyan

# 1) Kill port 3002 (zonder pauze)
$env:__NO_PAUSE = '1'
& "$scriptDir\kill-port.ps1" -Port 3002
Remove-Item Env:__NO_PAUSE -ErrorAction SilentlyContinue

# 2) Start backend in nieuw PowerShell venster (blijft open)
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$scriptDir\start-backend-3002.ps1`"" -WindowStyle Normal | Out-Null

# 3) Health polling (max 30s) met common helper
. "$scriptDir\common.ps1"
$base = $null
$sw = [System.Diagnostics.Stopwatch]::StartNew()
while ($sw.Elapsed.TotalSeconds -lt 30) {
  try {
    $base = Get-BackendBase
    $ok = (Invoke-RestMethod -Uri "$base/health" -TimeoutSec 2 -ErrorAction Stop).ok
    if ($ok) { Write-Host "Backend online op $base" -ForegroundColor Green; break }
  } catch {}
  Start-Sleep -Milliseconds 800
}
if (-not $base) { Write-Host "Kon backend niet detecteren binnen 30s." -ForegroundColor Red }

# 4) Open admin (standalone) met cache-buster (zonder pauze)
$env:__NO_PAUSE = '1'
& "$scriptDir\open-admin.ps1"
Remove-Item Env:__NO_PAUSE -ErrorAction SilentlyContinue

if (-not $env:__NO_PAUSE) {
  Write-Host "\nKlaar. Druk op Enter om af te sluiten..." -ForegroundColor DarkGray
  Read-Host | Out-Null
}