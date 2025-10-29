# PowerShell script: backup-index-html.ps1
# Maakt een automatische backup van index.html met oplopend versienummer

$source = "index.html"
$backupDir = "backup_html"

# Maak backup map aan als die niet bestaat
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

# Zoek hoogste bestaand versienummer
$existing = Get-ChildItem "$backupDir/index_v*.html" | ForEach-Object {
    if ($_ -match "index_v(\d+)\.html") { [int]$matches[1] } else { 0 }
}
$next = 1
if ($existing) { $next = ($existing | Measure-Object -Maximum).Maximum + 1 }

# Maak backup
$backupFile = "$backupDir/index_v$next.html"
Copy-Item $source $backupFile
Write-Host "Backup gemaakt: $backupFile"