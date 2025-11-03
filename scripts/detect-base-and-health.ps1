$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$base = Get-BackendBase
Write-Host ("Base: {0}" -f $base) -ForegroundColor Green
$r = Invoke-RestMethod -Uri "$base/health"
$r | ConvertTo-Json -Depth 5
if (-not $env:__NO_PAUSE) {
	Write-Host "\nDruk op Enter om af te sluiten..." -ForegroundColor DarkGray
	Read-Host | Out-Null
}