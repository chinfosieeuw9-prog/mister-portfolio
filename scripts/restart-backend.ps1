$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$base = Get-BackendBase
Write-Host "POST $base/admin/restart" -ForegroundColor Yellow
Invoke-RestMethod -Uri "$base/admin/restart" -Method Post | Out-Null
$sw = [System.Diagnostics.Stopwatch]::StartNew()
while ($sw.Elapsed.TotalSeconds -lt 20) {
  Start-Sleep -Seconds 1
  try {
    $ok = (Invoke-RestMethod -Uri "$base/health" -TimeoutSec 2 -ErrorAction Stop).ok
    if ($ok) { Write-Host "Backend online" -ForegroundColor Green; break }
  } catch {}
}
if ($sw.Elapsed.TotalSeconds -ge 20) { Write-Host "Restart timeout na 20 seconden" -ForegroundColor Red }
