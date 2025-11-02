# full-backup-workflow.ps1

function Write-JsonLog {
	param([hashtable]$Entry)
	$root = $PSScriptRoot
	$logDir = Join-Path $root "logs"
	if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
	$logPath = Join-Path $logDir "logs.json"
	if (!(Test-Path $logPath)) { '{"entries":[]}' | Out-File -FilePath $logPath -Encoding utf8 }
	$json = Get-Content $logPath -Raw | ConvertFrom-Json
	if (-not $json.entries) { $json | Add-Member -NotePropertyName entries -NotePropertyValue @() }
	$json.entries += [PSCustomObject]$Entry
	($json | ConvertTo-Json -Depth 10) | Set-Content $logPath -Encoding utf8
}

$startTs = Get-Date

# 1. Maak een ZIP-backup van de projectmap (zonder directe log, workflow logt alles in één record)
Write-Host "==> Backup maken..."
& "$PSScriptRoot\backup-mister.ps1" -NoLog -NoPopup

# Lees laatst aangemaakte backup-informatie
$lastBackupPath = Join-Path $PSScriptRoot "artifacts/last-backup.json"
$versionTag = "unknown"; $zipPath = $null; $filesCount = $null
if (Test-Path $lastBackupPath) {
	try {
		$lb = Get-Content $lastBackupPath -Raw | ConvertFrom-Json
		$versionTag = $lb.versionTag
		$zipPath = $lb.zipPath
		$filesCount = $lb.filesCount
	} catch {}
}

# 2. Commit en push alle wijzigingen naar GitHub
Write-Host "==> Wijzigingen committen en pushen naar GitHub..."
& "$PSScriptRoot\auto-commit-push.ps1"

# 3. Checks: site online + API endpoints
Write-Host "==> Controleren of de site online is en API-status ophalen..."
$siteUrl = "https://mister.us.kg"
$siteStatus = $null; $siteOnline = $false
try {
	$resp = Invoke-WebRequest -Uri $siteUrl -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 20 -ErrorAction Stop
	$siteStatus = $resp.StatusCode
	$siteOnline = ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 400)
} catch {
	if ($_.Exception.Response) { $siteStatus = $_.Exception.Response.StatusCode.value__ } else { $siteStatus = "ERR" }
	$siteOnline = $false
}

# Parse Formspree endpoint uit index.html
$indexPath = Join-Path $PSScriptRoot "index.html"
$formspreeUrl = $null; $formspreeStatus = $null
try {
	$html = Get-Content $indexPath -Raw
	if ($html -match "FORMSPREE_ENDPOINT\s*=\s*'([^']+)'") { $formspreeUrl = $matches[1] }
} catch {}
if ($formspreeUrl) {
	try {
		$fr = Invoke-WebRequest -Uri $formspreeUrl -UseBasicParsing -Method Get -TimeoutSec 15 -ErrorAction Stop
		$formspreeStatus = $fr.StatusCode
	} catch {
		if ($_.Exception.Response) { $formspreeStatus = $_.Exception.Response.StatusCode.value__ } else { $formspreeStatus = "ERR" }
	}
}

# Ably Auth URL (default lokale upload-backend)
$ablyAuthUrl = "http://localhost:3001/ably/token"; $ablyStatus = $null
try {
	$ar = Invoke-WebRequest -Uri $ablyAuthUrl -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
	$ablyStatus = $ar.StatusCode
} catch {
	if ($_.Exception.Response) { $ablyStatus = $_.Exception.Response.StatusCode.value__ } else { $ablyStatus = "ERR" }
}

# 4. Sync backupmap naar OneDrive
Write-Host "==> Syncen naar OneDrive..."
& "$PSScriptRoot\sync-backup-to-cloud.ps1"

# Verifieer of laatste backup op OneDrive staat
$oneDriveDir = "C:\Users\Jordan\OneDrive\mister-backups"
$cloudSynced = $false
if ($zipPath) {
	$fileName = Split-Path $zipPath -Leaf
	$destPath = Join-Path $oneDriveDir $fileName
	$cloudSynced = Test-Path $destPath
}

# 5. Restore-optie (optioneel)
# & "$PSScriptRoot\restore-latest-backup.ps1"

# Schrijf workflow log entry
$gitSha = $null; $gitMsg = $null; $gitDirty = $null
try { $gitSha = (& git rev-parse --short HEAD) 2>$null } catch {}
try { $gitMsg = (& git log -1 --pretty=%s) 2>$null } catch {}
try { $gitDirty = -not [string]::IsNullOrWhiteSpace((& git status --porcelain)) } catch {}

$entry = @{
	type       = "workflow"
	timestamp  = (Get-Date).ToString("o")
	durationMs = [int]((Get-Date) - $startTs).TotalMilliseconds
	versionTag = $versionTag
	artifacts  = @{ zip = $zipPath; filesCount = $filesCount }
	site       = @{ url = $siteUrl; online = $siteOnline; status = $siteStatus }
	apis       = @{ 
		formspree = @{ url = $formspreeUrl; status = $formspreeStatus }
		ablyAuth  = @{ url = $ablyAuthUrl; status = $ablyStatus }
	}
	cloudSync  = @{ target = $oneDriveDir; ok = $cloudSynced }
	git        = @{ sha = $gitSha; message = $gitMsg; dirty = $gitDirty }
}
Write-Host "==> Workflow voltooid!"
Write-JsonLog -Entry $entry