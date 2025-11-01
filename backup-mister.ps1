# backup-mister.ps1
# Opties:
# - Alleen .html, .css, .js bestanden backuppen
# - Automatisch oude backups (>30 dagen) verwijderen
# - Logbestand bijhouden
# - Vaste naam voor backup (optioneel als argument)

param(
    [string]$BackupName = ""
)

$source = "C:\Users\Jordan\Desktop\sites\mister.us.kg"
$backupDir = "C:\Users\Jordan\Desktop\mister-backups"
$logFile = "$backupDir\backup-log.txt"


# Automatisch versienummer bepalen
function Get-NextVersion {
    param($backupDir)
    $backups = Get-ChildItem -Path $backupDir -Filter "mister-backup-v*.zip" | Select-Object -ExpandProperty Name
    if (-not $backups) { return "v2.0" }
    $versies = $backups | ForEach-Object {
        if ($_ -match "v(\d+)\.(\d+)") {
            [PSCustomObject]@{ major = [int]$matches[1]; minor = [int]$matches[2] }
        }
    }
    $laatste = $versies | Sort-Object major, minor -Descending | Select-Object -First 1
    $major = $laatste.major
    $minor = $laatste.minor + 1
    if ($minor -gt 10) {
        $major++
        $minor = 0
    }
    return "v$major.$minor"
}

if ($BackupName -eq "") {
    $BackupName = Get-NextVersion $backupDir
}
$destination = "$backupDir\mister-backup-$BackupName.zip"

if (!(Test-Path -Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

# Alleen .html, .css, .js files selecteren
$files = Get-ChildItem -Path $source -Recurse -Include *.html,*.css,*.js
if ($files.Count -eq 0) {
    Write-Host "Geen bestanden gevonden om te backuppen."
    exit 1
}

# Tijdelijke map voor zip
$tempDir = "$backupDir\temp-backup"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Kopieer geselecteerde files naar temp
foreach ($file in $files) {
    $target = Join-Path $tempDir ($file.FullName.Substring($source.Length+1))
    $targetDir = Split-Path $target
    if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir | Out-Null }
    Copy-Item $file.FullName -Destination $target
}

Compress-Archive -Path "$tempDir\*" -DestinationPath $destination -Force
Remove-Item $tempDir -Recurse -Force


# Maximaal 4 versies per hoofdversie bewaren (v2, v3, ...)
$allBackups = Get-ChildItem -Path $backupDir -Filter "mister-backup-v*.zip"
$allBackups | Group-Object { ($_ -match "v(\d+)\.") | Out-Null; $matches[1] } | ForEach-Object {
    $group = $_.Group | Sort-Object LastWriteTime -Descending
    $teVerwijderen = $group | Select-Object -Skip 4
    foreach ($old in $teVerwijderen) {
        Remove-Item $old.FullName -Force
    }
}

# Logbestand bijwerken
$logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') | Backup: $destination | Files: $($files.Count)"
Add-Content -Path $logFile -Value $logEntry


Write-Host "Backup gemaakt: $destination"
Write-Host "Log bijgewerkt: $logFile"


# Gegarandeerde pop-up na backup (MessageBox)
Add-Type -AssemblyName PresentationFramework
[System.Windows.MessageBox]::Show("Backup voltooid!\nBestand: $BackupName.zip\nLocatie: C:\Users\Jordan\Desktop\mister-backups","Backup-mister.ps1")
