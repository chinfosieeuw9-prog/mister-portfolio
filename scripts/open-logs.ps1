$ErrorActionPreference = 'Stop'
$scriptDir = $PSScriptRoot
$ts = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$logsUrl = "http://localhost:8000/logs.html?v=$ts"

# Check of poort 8000 luistert; zo niet: start live server asynchroon (niet blokkeren)
$port8000Listening = $false
try {
  $conns = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction Stop
  if ($conns) { $port8000Listening = $true }
} catch {}
if (-not $port8000Listening) {
  Write-Host "Live Server niet gevonden, starten op achtergrond..." -ForegroundColor Cyan
  $psArgs = @('-NoProfile','-ExecutionPolicy','Bypass','-File',"$scriptDir\start-live-server-safe.ps1")
  Start-Process -WindowStyle Minimized -FilePath "powershell.exe" -ArgumentList $psArgs | Out-Null
  # Wacht kort tot 8000 luistert (max ~6s)
  $tries = 0
  do {
    Start-Sleep -Milliseconds 250
    $tries++
    try {
      $conns = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction Stop
      if ($conns) { $port8000Listening = $true }
    } catch {}
  } while (-not $port8000Listening -and $tries -lt 24)
}

# Open logs in standaardbrowser
Write-Host ("Openen: {0}" -f $logsUrl) -ForegroundColor Cyan
Start-Process $logsUrl | Out-Null

if (-not $env:__NO_PAUSE) {
  Write-Host "\nKlaar. Sluit dit venster indien het open is." -ForegroundColor DarkGray
}