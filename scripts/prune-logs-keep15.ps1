$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$logPath = Join-Path $root '..\logs\logs.json'
$backupPath = Join-Path $root '..\artifacts\logs-backup.json'
$keep = 15

Write-Host "Prune logs: keeping last $keep entries" -ForegroundColor Cyan
if (-not (Test-Path $logPath)) { throw "Niet gevonden: $logPath" }

try { Copy-Item -Path $logPath -Destination $backupPath -Force } catch {}

$jsonText = Get-Content -Path $logPath -Raw -Encoding UTF8
$data = $null
try { $data = $jsonText | ConvertFrom-Json -ErrorAction Stop } catch { throw "Ongeldige JSON in $logPath: $($_.Exception.Message)" }

if (-not $data -or -not $data.entries) { throw "Onverwacht formaat: verwacht .entries" }

$entries = @($data.entries)
$sorted = $entries | Sort-Object { [datetime]$_.timestamp } -Descending
$kept = $sorted | Select-Object -First $keep
$removed = [Math]::Max(0, $entries.Count - $kept.Count)

$new = [PSCustomObject]@{ entries = $kept }
$newText = $new | ConvertTo-Json -Depth 20
$newText | Set-Content -Path $logPath -Encoding UTF8

Write-Host ("Klaar: {0} behouden, {1} verwijderd" -f $kept.Count, $removed) -ForegroundColor Green
