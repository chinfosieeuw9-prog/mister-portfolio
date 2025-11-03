$ErrorActionPreference = 'Stop'
$scriptDir = $PSScriptRoot
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$adminTabsUrl = "http://localhost:8000/index.html#admin?v=$ts"

# Check of poort 8000 luistert; zo niet: start live server safe
$port8000Listening = $false
try {
  $conns = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction Stop
  if ($conns) { $port8000Listening = $true }
} catch {}
if (-not $port8000Listening) {
  Write-Host "Live Server niet gevonden, start 'start-live-server-safe'..." -ForegroundColor Cyan
  $env:__NO_PAUSE = '1'
  & "$scriptDir\start-live-server-safe.ps1"
  Remove-Item Env:__NO_PAUSE -ErrorAction SilentlyContinue
  Start-Sleep -Seconds 1
}

Write-Host ("Openen: {0}" -f $adminTabsUrl) -ForegroundColor Cyan
Start-Process $adminTabsUrl | Out-Null

if (-not $env:__NO_PAUSE) {
  Write-Host "\nDruk op Enter om af te sluiten..." -ForegroundColor DarkGray
  Read-Host | Out-Null
}