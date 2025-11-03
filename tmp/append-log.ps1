$base = 'http://localhost:3002'
$msgPath = 'c:\Users\Jordan\Desktop\sites\mister.us.kg\tmp\backend-status-update-note.txt'
$msg = Get-Content -LiteralPath $msgPath -Raw
$payload = @{ message = $msg; type = 'note'; versionTag = 'ui-backend-status-chips' } | ConvertTo-Json -Depth 5
try {
  $res = Invoke-WebRequest -Uri ($base + '/logs/append') -Method Post -Body $payload -ContentType 'application/json' -UseBasicParsing
  $res.Content | Write-Output
} catch {
  Write-Output "POST failed: $($_.Exception.Message)"
  try {
    $enc = [System.Uri]::EscapeDataString($msg)
    $qs = 'message=' + $enc + '&versionTag=ui-backend-status-chips&type=note'
    $res2 = Invoke-WebRequest -Uri ($base + '/logs/append?' + $qs) -Method Get -UseBasicParsing
    $res2.Content | Write-Output
  } catch {
    Write-Output "GET fallback failed: $($_.Exception.Message)"; exit 1
  }
}
