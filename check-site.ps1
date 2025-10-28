# check-site.ps1
$response = Invoke-WebRequest -Uri "https://mister.us.kg" -UseBasicParsing -ErrorAction SilentlyContinue
if ($response.StatusCode -eq 200) {
    Write-Host "Site is online!"
} else {
    Write-Host "Site is offline of onbereikbaar!"
}
