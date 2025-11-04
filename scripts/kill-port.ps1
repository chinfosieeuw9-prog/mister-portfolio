param([Parameter(Mandatory=$false)] [int]$Port = 3002)
$ErrorActionPreference = 'Stop'
Write-Host "Zoek proces op poort $Port ..." -ForegroundColor Cyan
try {
  $conns = Get-NetTCPConnection -LocalPort $Port -ErrorAction Stop
  $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
  if ($pids.Count -eq 0) { Write-Host "Geen proces gevonden op poort $Port"; } else {
    foreach ($procId in $pids) { try { Stop-Process -Id $procId -Force } catch {} }
    Write-Host "Killed PIDs: $($pids -join ', ')" -ForegroundColor Red
  }
} catch {
  Write-Host "Fallback via netstat..." -ForegroundColor Yellow
  $lines = netstat -ano | findstr ":$Port"
  if (-not $lines) { Write-Host "Geen PID gevonden op poort $Port"; } else {
    $pids = @()
    foreach ($ln in $lines) { $parts = $ln -split "\s+"; if ($parts.Length -ge 5) { $pids += [int]$parts[-1] } }
    $pids = $pids | Select-Object -Unique
    foreach ($procId in $pids) { try { Stop-Process -Id $procId -Force } catch {} }
    if ($pids.Count -gt 0) { Write-Host "Killed PIDs: $($pids -join ', ')" -ForegroundColor Red } else { Write-Host "Geen PID gevonden" }
  }
}
if (-not $env:__NO_PAUSE) {
  Write-Host "\nDruk op Enter om af te sluiten..." -ForegroundColor DarkGray
  Read-Host | Out-Null
}