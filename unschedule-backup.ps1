param(
    [string]$TaskName = "MisterBackupNightly"
)

if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false | Out-Null
    Write-Host "Scheduled Task '$TaskName' verwijderd." -ForegroundColor Yellow
} else {
    Write-Host "Geen taak gevonden met naam '$TaskName'." -ForegroundColor Yellow
}
