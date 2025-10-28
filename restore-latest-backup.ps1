# restore-latest-backup.ps1
$backupDir = "C:\Users\Jordan\Desktop\mister-backups"
$projectDir = "C:\Users\Jordan\Desktop\sites\mister.us.kg"
$latest = Get-ChildItem $backupDir\mister-backup-*.zip | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($latest) {
    Expand-Archive -Path $latest.FullName -DestinationPath $projectDir -Force
    Write-Host "Herstel voltooid: $($latest.Name)"
} else {
    Write-Host "Geen backup gevonden!"
}
