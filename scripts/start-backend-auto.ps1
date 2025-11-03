$ErrorActionPreference = 'Stop'
$scriptDir = $PSScriptRoot
$root = Split-Path -Parent $scriptDir
$backendDir = Join-Path $root 'upload-backend'
if (-not (Test-Path $backendDir)) { Write-Host "upload-backend map niet gevonden: $backendDir" -ForegroundColor Red; if (-not $env:__NO_PAUSE) { Write-Host "\nDruk op Enter om af te sluiten..." -ForegroundColor DarkGray; Read-Host | Out-Null }; exit 1 }
Set-Location $backendDir

# Node check
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js niet gevonden. Installeer Node (https://nodejs.org) of voeg het aan PATH toe." -ForegroundColor Red
  if (-not $env:__NO_PAUSE) { Write-Host "\nDruk op Enter om af te sluiten..." -ForegroundColor DarkGray; Read-Host | Out-Null }
  exit 1
}

# Dependencies indien nodig
if (-not (Test-Path 'node_modules')) { npm install }

function Invoke-KillPort {
  param([Parameter(Mandatory=$true)][int]$Port)
  $env:__NO_PAUSE = '1'
  & (Join-Path $scriptDir 'kill-port.ps1') -Port $Port
  Remove-Item Env:__NO_PAUSE -ErrorAction SilentlyContinue
}

function Try-StartOnPort {
  param([Parameter(Mandatory=$true)][int]$Port, [switch]$KillFirst)
  if ($KillFirst) { Write-Host "Vrijmaken poort $Port (indien bezet) ..." -ForegroundColor Yellow; Invoke-KillPort -Port $Port }
  $env:PORT = $Port
  Write-Host "Start backend op PORT=$Port..." -ForegroundColor Cyan
  & node index.js
  $code = $LASTEXITCODE
  if ($code -ne 0) {
    Write-Host "Start op poort $Port mislukte (exit code $code)." -ForegroundColor Red
  }
  return $code
}

# Strategie: 3002 -> (kill)3002 -> (kill)3001
$code = Try-StartOnPort -Port 3002
if ($code -ne 0) {
  $code = Try-StartOnPort -Port 3002 -KillFirst
}
if ($code -ne 0) {
  $code = Try-StartOnPort -Port 3001 -KillFirst
}

if ($code -ne 0) {
  Write-Host "Kon backend niet starten op 3002 of 3001." -ForegroundColor Red
  if (-not $env:__NO_PAUSE) { Write-Host "\nDruk op Enter om af te sluiten..." -ForegroundColor DarkGray; Read-Host | Out-Null }
  exit $code
}
