$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$logPath = Join-Path $root '..\logs\logs.json'
$backupPath = Join-Path $root '..\artifacts\logs-backup.json'
$keep = 10

Write-Host "Prune logs: keeping last $keep entries" -ForegroundColor Cyan
if (-not (Test-Path $logPath)) { throw "Niet gevonden: $logPath" }

# Backup huidige logs
try {
  Copy-Item -Path $logPath -Destination $backupPath -Force
  Write-Host "Backup gemaakt: $backupPath" -ForegroundColor DarkGray
} catch { Write-Host "Kon backup niet maken: $($_.Exception.Message)" -ForegroundColor Yellow }

# Lees JSON
$jsonText = Get-Content -Path $logPath -Raw -Encoding UTF8
$data = $null
try { $data = $jsonText | ConvertFrom-Json -ErrorAction Stop } catch { throw "Ongeldige JSON in $logPath: $($_.Exception.Message)" }

if (-not $data -or -not $data.entries) { throw "Onverwacht formaat: verwacht .entries" }

# Sorteer op timestamp aflopend en pak de laatste $keep
$entries = @($data.entries)
$sorted = $entries | Sort-Object { [datetime]$_.timestamp } -Descending
$kept = $sorted | Select-Object -First $keep
$removed = [Math]::Max(0, $entries.Count - $kept.Count)

# Schrijf terug
$new = [PSCustomObject]@{ entries = $kept }
$newText = $new | ConvertTo-Json -Depth 20
$newText | Set-Content -Path $logPath -Encoding UTF8

Write-Host ("Klaar: {0} behouden, {1} verwijderd" -f $kept.Count, $removed) -ForegroundColor Green
