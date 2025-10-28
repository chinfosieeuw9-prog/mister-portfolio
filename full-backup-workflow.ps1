# full-backup-workflow.ps1

# 1. Maak een ZIP-backup van de projectmap
Write-Host "==> Backup maken..."
& "$PSScriptRoot\\backup-mister.ps1"

# 2. Commit en push alle wijzigingen naar GitHub
Write-Host "==> Wijzigingen committen en pushen naar GitHub..."
& "$PSScriptRoot\\auto-commit-push.ps1"

# 3. Check of de site online is
Write-Host "==> Controleren of de site online is..."
& "$PSScriptRoot\\check-site.ps1"

# 4. Sync backupmap naar OneDrive
Write-Host "==> Syncen naar OneDrive..."
& "$PSScriptRoot\\sync-backup-to-cloud.ps1"

# 5. Restore-optie (optioneel, alleen uitvoeren als je wilt herstellen)
# Uncomment de volgende regel als je automatisch wilt restoren:
# & "$PSScriptRoot\\restore-latest-backup.ps1"

Write-Host "==> Workflow voltooid!"