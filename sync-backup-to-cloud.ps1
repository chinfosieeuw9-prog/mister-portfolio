# sync-backup-to-cloud.ps1
$source = "C:\Users\Jordan\Desktop\mister-backups"
$dest = "C:\Users\Jordan\OneDrive\mister-backups"
Copy-Item -Path $source\* -Destination $dest -Recurse -Force
