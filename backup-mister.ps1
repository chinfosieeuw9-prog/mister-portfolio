# backup-mister.ps1
$datum = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$source = "C:\Users\Jordan\Desktop\sites\mister.us.kg"
$destination = "C:\Users\Jordan\Desktop\mister-backups\mister-backup-$datum.zip"

if (!(Test-Path -Path (Split-Path $destination))) {
    New-Item -ItemType Directory -Path (Split-Path $destination)
}

Compress-Archive -Path "$source\*" -DestinationPath $destination -Force

Write-Host "Backup gemaakt: $destination"
