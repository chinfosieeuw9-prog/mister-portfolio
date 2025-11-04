$ErrorActionPreference = 'Stop'
$env:__NO_PAUSE = '1'
& "$PSScriptRoot\kill-port.ps1" -Port 3002
Remove-Item Env:__NO_PAUSE -ErrorAction SilentlyContinue
