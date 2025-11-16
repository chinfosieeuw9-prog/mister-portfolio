
# PowerShell-script: versie ophogen en volledige backup maken (max 8 backups) met logging


$versionFile = "./version.json"
$backupDir = "./BACKUP-INDEX.HTML"
$logFile = "./logs.json"
$indexFile = "./frontend/public/index.html"
$backupItems = @("./frontend/public/index.html", "./backend/api", "./frontend/css", "./frontend/js", "./backend/upload-backend")


# Lees huidige versie
$versionJson = Get-Content $versionFile | ConvertFrom-Json
$version = $versionJson.version


# Verhoog patchnummer (v1.10 → v1.11)
if ($version -match "^(\d+)\.(\d+)$") {
    $major = [int]$matches[1]
    $minor = [int]$matches[2] + 1
    $newVersion = "$major.$minor"
    $versionJson.version = $newVersion
    $versionJson | ConvertTo-Json | Set-Content $versionFile -Encoding UTF8
    Write-Host "Versie verhoogd naar v$newVersion"
}
else {
    Write-Host "Versieformaat niet herkend."
    exit 1
}

# Logging voorbereiden
$logEntry = @{
    timestamp = (Get-Date).ToString("s") + "Z"
    version   = $versionJson.version
    status    = "success"
    items     = @()
    message   = "Backup voltooid"
}


# Maak versiemap aan
$backupVersionDir = Join-Path $backupDir "backup_v$($versionJson.version)"
if (!(Test-Path $backupVersionDir)) {
    New-Item -ItemType Directory -Path $backupVersionDir | Out-Null
}


# Backup alle items
foreach ($item in $backupItems) {
    if (Test-Path $item) {
        $dest = Join-Path $backupVersionDir (Split-Path $item -Leaf)
        if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
        Copy-Item $item $dest -Recurse -Force
        Write-Host "Backup: $item → $dest"
        $logEntry.items += (Split-Path $item -Leaf)
    }
    else {
        Write-Host "Niet gevonden: $item"
    }
}


# Houd maximaal 8 backups, verwijder de oudste
$backups = Get-ChildItem $backupDir -Directory | Where-Object { $_.Name -like 'backup_v*' } | Sort-Object LastWriteTime
if ($backups.Count -gt 8) {
    $toDelete = $backups | Select-Object -First ($backups.Count - 8)
    foreach ($dir in $toDelete) {
        Remove-Item $dir.FullName -Recurse -Force
        Write-Host "Verwijderd: $($dir.Name)"
    }
}

# Log wegschrijven
if (!(Test-Path $logFile)) {
    Set-Content $logFile "[]" -Encoding UTF8
}
try {
    $logsRaw = Get-Content $logFile -Raw
    if ($logsRaw.Trim().StartsWith("{")) {
        $logs = @((ConvertFrom-Json $logsRaw))
    }
    elseif ($logsRaw.Trim().StartsWith("[")) {
        $logs = ConvertFrom-Json $logsRaw
    }
    else {
        $logs = @()
    }
}
catch { $logs = @() }
$logs = , $logEntry + $logs
if ($logs.Count -gt 100) { $logs = $logs[-100..-1] } # max 100 logs bewaren
$logs | ConvertTo-Json -Depth 5 | Set-Content $logFile -Encoding UTF8

# Sync logs.json naar frontend/public/logs.json
$frontendLog = "../frontend/public/logs.json"
Copy-Item $logFile $frontendLog -Force
Write-Host "Logs gesynchroniseerd naar $frontendLog"
