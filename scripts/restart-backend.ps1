$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$base = Get-BackendBase
Write-Host "POST $base/admin/restart" -ForegroundColor Yellow
try {
  Invoke-RestMethod -Uri "$base/admin/restart" -Method Post | Out-Null
} catch {
  Write-Host "Fout bij restart-call: $($_.Exception.Message)" -ForegroundColor Red
  try {
    $diag = Invoke-RestMethod -Uri "$base/__diag" -TimeoutSec 3 -ErrorAction Stop
    if ($diag -and $diag.routes) {
      Write-Host "Beschikbare routes: " ((($diag.routes | ForEach-Object { $_.methods -join ',' }) -join ' | ')) -ForegroundColor DarkGray
    }
  } catch {}
  Write-Host "Tip: mogelijk draait een oudere backend zonder /admin/restart. Gebruik 'start-backend-3002-safe.cmd' of 'start-backend-auto.cmd' om eerst poorten vrij te maken en de nieuwste backend te starten." -ForegroundColor Yellow
  if (-not $env:__NO_PAUSE) { Write-Host "\nDruk op Enter om af te sluiten..." -ForegroundColor DarkGray; Read-Host | Out-Null }
  exit 1
}
$sw = [System.Diagnostics.Stopwatch]::StartNew()
while ($sw.Elapsed.TotalSeconds -lt 20) {
  Start-Sleep -Seconds 1
  try {
    $ok = (Invoke-RestMethod -Uri "$base/health" -TimeoutSec 2 -ErrorAction Stop).ok
    if ($ok) { Write-Host "Backend online" -ForegroundColor Green; break }
  } catch {}
}
if ($sw.Elapsed.TotalSeconds -ge 20) { Write-Host "Restart timeout na 20 seconden" -ForegroundColor Red }
