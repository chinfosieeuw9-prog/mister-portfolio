# auto-commit-push.ps1
cd "C:\Users\Jordan\Desktop\sites\mister.us.kg"
$datum = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git add .
git commit -m "Auto-backup $datum"
git push
