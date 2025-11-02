<#
    PowerShell script: backup-index-html.ps1
    - Maakt automatische backup van index.html met oplopend versienummer
    - Schrijft tevens een gestructureerde log entry naar logs\logs.json
#>

$source = "index.html"
$backupDir = "backup_html"

function Write-JsonLog {
    param(
        [hashtable]$Entry
    )
    try {
        $root = $PSScriptRoot
    } catch { $root = "." }
    $logDir = Join-Path $root "logs"
    if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
    $logPath = Join-Path $logDir "logs.json"
    if (!(Test-Path $logPath)) { '{"entries":[]}' | Out-File -FilePath $logPath -Encoding utf8 }

    $json = Get-Content $logPath -Raw | ConvertFrom-Json
    if (-not $json.entries) { $json | Add-Member -NotePropertyName entries -NotePropertyValue @() }
    $json.entries += [PSCustomObject]$Entry
    ($json | ConvertTo-Json -Depth 8) | Set-Content $logPath -Encoding utf8
} 

# Maak backup map aan als die niet bestaat
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

# Zoek hoogste bestaand versienummer
$existing = Get-ChildItem "$backupDir/index_v*.html" -ErrorAction SilentlyContinue | ForEach-Object {
    if ($_ -match "index_v(\d+)\.html") { [int]$matches[1] } else { 0 }
}
$next = 1
if ($existing) { $next = ($existing | Measure-Object -Maximum).Maximum + 1 }

# Maak backup
$backupFile = "$backupDir/index_v$next.html"
Copy-Item $source $backupFile -Force
Write-Host "Backup gemaakt: $backupFile"

# Probeer eenvoudige git-info te verzamelen (optioneel)
$gitSha = $null; $gitMsg = $null; $gitDirty = $null
try { $gitSha = (& git rev-parse --short HEAD) 2>$null } catch {}
try { $gitMsg = (& git log -1 --pretty=%s) 2>$null } catch {}
try { $gitDirty = -not [string]::IsNullOrWhiteSpace((& git status --porcelain)) } catch {}

# Schrijf JSON log entry
$entry = @{
    type       = "indexBackup"
    timestamp  = (Get-Date).ToString("o")
    versionTag = "index_v$next"
    artifacts  = @{ indexBackup = $backupFile }
    git        = @{ sha = $gitSha; message = $gitMsg; dirty = $gitDirty }
}
Write-JsonLog -Entry $entry