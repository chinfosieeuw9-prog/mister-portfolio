$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\common.ps1"
$base = Get-BackendBase
$r = Invoke-RestMethod -Uri "$base/workflow/run" -Method Post
$r | ConvertTo-Json -Depth 5