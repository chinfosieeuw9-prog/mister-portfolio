param(
    [string]$Time = "23:00",
    [string]$TaskName = "MisterBackupNightly"
)

# Resolve path to the full backup workflow script
$scriptPath = Join-Path $PSScriptRoot "full-backup-workflow.ps1"
if (-not (Test-Path $scriptPath)) {
    Write-Error "Kan 'full-backup-workflow.ps1' niet vinden op $scriptPath"; exit 1
}

# Create scheduled task action to run PowerShell with our script
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`""

# Daily trigger at the chosen time
try {
    $at = Get-Date $Time
} catch {
    Write-Error "Ongeldige tijd opgegeven. Gebruik bijvoorbeeld 21:30"; exit 1
}
$trigger = New-ScheduledTaskTrigger -Daily -At $at

# Settings: run if missed, allow on battery, start when available
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries

# Register task (updates if it bestaat)
if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false | Out-Null
}
Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Description "Nightly backup van mister-portfolio (volledige workflow)" | Out-Null

Write-Host "Scheduled Task '$TaskName' ingesteld voor dagelijks om $Time." -ForegroundColor Green
