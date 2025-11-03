$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$base = Get-BackendBase
$r = Invoke-RestMethod -Uri "$base/news"
$r | ConvertTo-Json -Depth 5