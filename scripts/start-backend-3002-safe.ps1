$ErrorActionPreference = 'Stop'
$scriptDir = $PSScriptRoot
Write-Host "Vrijmaken poort 3002 (indien bezet) ..." -ForegroundColor Yellow
$env:__NO_PAUSE = '1'
& "$scriptDir\kill-port.ps1" -Port 3002
Remove-Item Env:__NO_PAUSE -ErrorAction SilentlyContinue
Write-Host "Start backend op PORT=3002..." -ForegroundColor Cyan
& "$scriptDir\start-backend-3002.ps1"