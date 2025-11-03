param(
  [Parameter(Mandatory=$true)] [string]$Message,
  [string]$VersionTag = 'pwsh'
)
$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$base = Get-BackendBase
try {
  $payload = @{ message = $Message; versionTag = $VersionTag } | ConvertTo-Json -Depth 5
  $r = Invoke-RestMethod -Uri "$base/logs/append" -Method Post -ContentType 'application/json' -Body $payload
} catch {
  Write-Host "POST faalde, probeer GET fallback..." -ForegroundColor Yellow
  $msg = [uri]::EscapeDataString($Message)
  $r = Invoke-RestMethod -Uri "$base/logs/append?message=$msg&versionTag=$VersionTag"
}
$r | ConvertTo-Json -Depth 5