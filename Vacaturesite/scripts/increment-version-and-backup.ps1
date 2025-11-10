# PowerShell-script: versie ophogen en volledige backup maken (max 8 backups)

$versionFile = "../version.json"
$backupDir = "../BACKUP-INDEX.HTML"
$indexFile = "../frontend/public/index.html"
$backupItems = @("../frontend/public/index.html", "../backend/api", "../frontend/css", "../frontend/js", "../backend/upload-backend")

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
} else {
    Write-Host "Versieformaat niet herkend."
    exit 1
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
    } else {
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
