$ErrorActionPreference = 'Stop'
$scriptDir = $PSScriptRoot
$root = Split-Path -Parent $scriptDir
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$adminUrl = "http://localhost:8000/admin.html?v=$ts"

# Probeer backend base te detecteren (niet fataal als offline)
$backendBase = $null
try {
  . "$scriptDir\common.ps1"
  $backendBase = Get-BackendBase
  Write-Host ("Backend gedetecteerd: {0}" -f $backendBase) -ForegroundColor Green
} catch {
  Write-Host "Backend kon nu niet gedetecteerd worden (offline?). Admin opent wel; lampje toont status." -ForegroundColor Yellow
}

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

# Open admin in default browser
Write-Host ("Openen: {0}" -f $adminUrl) -ForegroundColor Cyan
Start-Process $adminUrl | Out-Null

if ($backendBase) {
  Write-Host ("Tip: backend base = {0}" -f $backendBase) -ForegroundColor DarkCyan
}

if (-not $env:__NO_PAUSE) {
  Write-Host "\nDruk op Enter om af te sluiten..." -ForegroundColor DarkGray
  Read-Host | Out-Null
}