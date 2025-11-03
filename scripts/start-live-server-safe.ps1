$ErrorActionPreference = 'Stop'
$scriptDir = $PSScriptRoot
Write-Host "Vrijmaken poort 8000 (indien bezet) ..." -ForegroundColor Yellow
$env:__NO_PAUSE = '1'
& "$scriptDir\kill-port.ps1" -Port 8000
Remove-Item Env:__NO_PAUSE -ErrorAction SilentlyContinue
Write-Host "Start Live Server op http://localhost:8000 ..." -ForegroundColor Cyan
& "$scriptDir\start-live-server.ps1"