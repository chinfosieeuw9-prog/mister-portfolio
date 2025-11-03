# Common helpers for scripts
function Get-BackendBase {
  param([int[]]$Ports = @(3001,3002), [int]$TimeoutSec = 2)
  foreach ($p in $Ports) {
    try {
      $u = "http://localhost:$p/health"
      $r = Invoke-RestMethod -Uri $u -TimeoutSec $TimeoutSec -ErrorAction Stop
      if ($r.ok) { return "http://localhost:$p" }
    } catch {}
  }
  throw "Backend offline (3001/3002)."
}
