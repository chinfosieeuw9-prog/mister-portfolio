<#
Cheatsheet PowerShell (mister.us.kg)

Gebruik:
  1) Open PowerShell in de repo-root
     Set-Location "c:\Users\Jordan\Desktop\sites\mister.us.kg"
  2) Dot-source dit bestand:
     . .\tmp\cheatsheet.ps1
  3) Detecteer backend en check health:
     Set-BackendBase; Backend-Health

Opmerking:
- BackendBase slaat op de lokale Node backend (uploads/nieuws/logs/workflow); Supabase staat hier los van.
- Poorten: 3001 of 3002. De UI detecteert automatisch; hieronder kan het ook via PowerShell.
#>

$script:BackendBase = $null

function Get-BackendBase {
  param(
    [int[]]$Ports = @(3001,3002),
    [int]$TimeoutSec = 2
  )
  foreach ($p in $Ports) {
    try {
      $u = "http://localhost:$p/health"
      $r = Invoke-RestMethod -Uri $u -TimeoutSec $TimeoutSec -ErrorAction Stop
      if ($r.ok) { return "http://localhost:$p" }
    } catch {}
  }
  throw "Backend offline (3001/3002)."
}

function Set-BackendBase {
  $script:BackendBase = Get-BackendBase
  Write-Host "BackendBase = $script:BackendBase" -ForegroundColor Cyan
  return $script:BackendBase
}

function Backend-Health {
  param([string]$Base = $script:BackendBase)
  if (-not $Base) { $Base = Get-BackendBase }
  Invoke-RestMethod -Uri "$Base/health"
}

function Backend-Diag {
  param([string]$Base = $script:BackendBase)
  if (-not $Base) { $Base = Get-BackendBase }
  Invoke-RestMethod -Uri "$Base/__diag"
}

function Backend-Restart {
  param([string]$Base = $script:BackendBase, [int]$TimeoutSec = 20)
  if (-not $Base) { $Base = Get-BackendBase }
  Write-Host "POST $Base/admin/restart" -ForegroundColor Yellow
  Invoke-RestMethod -Uri "$Base/admin/restart" -Method Post | Out-Null
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  do {
    Start-Sleep -Seconds 1
    try { if ((Invoke-RestMethod -Uri "$Base/health" -TimeoutSec 2 -ErrorAction Stop).ok) { Write-Host "Backend online" -ForegroundColor Green; return } } catch {}
  } while ($sw.Elapsed.TotalSeconds -lt $TimeoutSec)
  throw "Restart timeout na $TimeoutSec seconden."
}

function News-List {
  param([string]$Base = $script:BackendBase)
  if (-not $Base) { $Base = Get-BackendBase }
  Invoke-RestMethod -Uri "$Base/news"
}

function News-Create {
  param(
    [Parameter(Mandatory)] [string]$Title,
    [Parameter(Mandatory)] [string]$Body,
    [string]$Author = "admin",
    [string]$Base = $script:BackendBase
  )
  if (-not $Base) { $Base = Get-BackendBase }
  $payload = @{ title = $Title; body = $Body; author = $Author } | ConvertTo-Json
  Invoke-RestMethod -Uri "$Base/news" -Method Post -ContentType "application/json" -Body $payload
}

function News-Update {
  param(
    [Parameter(Mandatory)] [string]$Id,
    [Parameter(Mandatory)] [string]$Title,
    [Parameter(Mandatory)] [string]$Body,
    [string]$Base = $script:BackendBase
  )
  if (-not $Base) { $Base = Get-BackendBase }
  $payload = @{ title = $Title; body = $Body } | ConvertTo-Json
  Invoke-RestMethod -Uri "$Base/news/$Id" -Method Put -ContentType "application/json" -Body $payload
}

function News-Delete {
  param([Parameter(Mandatory)] [string]$Id, [string]$Base = $script:BackendBase)
  if (-not $Base) { $Base = Get-BackendBase }
  Invoke-RestMethod -Uri "$Base/news/$Id" -Method Delete
}

function Logs-Append {
  param(
    [Parameter(Mandatory)] [string]$Message,
    [string]$VersionTag = "pwsh",
    [switch]$UseGet,
    [string]$Base = $script:BackendBase
  )
  if (-not $Base) { $Base = Get-BackendBase }
  if ($UseGet) {
    $msg = [uri]::EscapeDataString($Message)
    Invoke-RestMethod -Uri "$Base/logs/append?message=$msg&versionTag=$VersionTag"
  } else {
    try {
      $payload = @{ message = $Message; versionTag = $VersionTag } | ConvertTo-Json -Depth 5
      Invoke-RestMethod -Uri "$Base/logs/append" -Method Post -ContentType "application/json" -Body $payload
    } catch {
      Write-Host "POST faalde, probeer GET fallback..." -ForegroundColor Yellow
      $msg = [uri]::EscapeDataString($Message)
      Invoke-RestMethod -Uri "$Base/logs/append?message=$msg&versionTag=$VersionTag"
    }
  }
}

function Workflow-Run {
  param([string]$Base = $script:BackendBase)
  if (-not $Base) { $Base = Get-BackendBase }
  Invoke-RestMethod -Uri "$Base/workflow/run" -Method Post
}

function Find-UploadBackendPids {
  Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -match 'upload-backend' } | Select-Object ProcessId, CommandLine
}

function Kill-Port {
  param([Parameter(Mandatory)] [int]$Port)
  try {
    $conns = Get-NetTCPConnection -LocalPort $Port -ErrorAction Stop
    $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($pid in $pids) { Stop-Process -Id $pid -Force }
    Write-Host "Killed PIDs: $($pids -join ', ')" -ForegroundColor Red
  } catch {
    Write-Host "Fallback via netstat..." -ForegroundColor Yellow
    $lines = netstat -ano | findstr ":$Port"
    if (-not $lines) { Write-Host "Geen PID gevonden op poort $Port"; return }
    $pids = @()
    foreach ($ln in $lines) { $parts = $ln -split "\s+"; if ($parts.Length -ge 5) { $pids += [int]$parts[-1] } }
    $pids = $pids | Select-Object -Unique
    foreach ($pid in $pids) { try { Stop-Process -Id $pid -Force } catch {} }
    if ($pids.Count -gt 0) { Write-Host "Killed PIDs: $($pids -join ', ')" -ForegroundColor Red } else { Write-Host "Geen PID gevonden" }
  }
}

function Start-Backend3002 {
  $backendDir = Join-Path $PSScriptRoot "..\upload-backend"
  if (-not (Test-Path $backendDir)) { throw "upload-backend map niet gevonden: $backendDir" }
  $cmd = "cd '$backendDir'; if (!(Test-Path node_modules)) { npm install }; \n$env:PORT=3002; node index.js"
  Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command $cmd" -WindowStyle Minimized | Out-Null
  Write-Host "Backend gestart in nieuw PowerShell venster op PORT=3002" -ForegroundColor Green
}

<#
Voorbeelden:
  . .\tmp\cheatsheet.ps1
  Set-BackendBase; Backend-Health
  News-List
  News-Create -Title "Test" -Body "Vanuit PowerShell" -Author "jordan"
  Logs-Append -Message "Cheatsheet test" -VersionTag "cheatsheet"
  Workflow-Run
  Backend-Restart
  Find-UploadBackendPids
  Kill-Port -Port 3002
  Start-Backend3002
#>