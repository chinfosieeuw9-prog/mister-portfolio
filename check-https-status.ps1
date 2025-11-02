param(
    [string]$Domain = "mister.us.kg"
)

function Get-CertificateInfo {
    param(
        [string]$Server,
        [int]$Port = 443
    )
    $tcp = $null
    $ssl = $null
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
    $tcp.Connect($Server, $Port)
    $ssl = New-Object System.Net.Security.SslStream($tcp.GetStream(), $false, { param($sender,$cert,$chain,$errors) $true })
    $ssl.AuthenticateAsClient($Server)
        $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 $ssl.RemoteCertificate

        $sanList = @()
        foreach ($ext in $cert.Extensions) {
            if ($ext.Oid.FriendlyName -eq 'Subject Alternative Name' -or $ext.Oid.Value -eq '2.5.29.17') {
                $formatted = $ext.Format($true)
                $parts = $formatted -split "[\r\n,]" | ForEach-Object { $_.Trim() } | Where-Object { $_ }
                foreach ($p in $parts) {
                    if ($p -match 'DNS Name\s*=\s*(.+)$') { $sanList += $Matches[1].Trim() }
                }
            }
        }

        [pscustomobject]@{
            Subject    = $cert.Subject
            Issuer     = $cert.Issuer
            NotBefore  = $cert.NotBefore
            NotAfter   = $cert.NotAfter
            Thumbprint = $cert.Thumbprint
            SAN        = $sanList
        }
    } catch {
    Write-Verbose "TLS handshake/cert read failed: $($_.Exception.Message)"
        $null
    } finally {
        if ($ssl) { $ssl.Dispose() }
        if ($tcp) { $tcp.Close() }
    }
}

Write-Host "==> Checking HTTPS status for $Domain`n"

# 1) Certificate details
$certInfo = Get-CertificateInfo -Server $Domain
if ($certInfo) {
    $now = Get-Date
    $validNow = ($now -ge $certInfo.NotBefore) -and ($now -lt $certInfo.NotAfter)
    Write-Host "Certificate Subject : $($certInfo.Subject)"
    Write-Host "Issuer              : $($certInfo.Issuer)"
    Write-Host "Valid From          : $($certInfo.NotBefore)"
    Write-Host "Valid To            : $($certInfo.NotAfter)"
    Write-Host "Valid Now?          : $validNow"
    if ($certInfo.SAN -and $certInfo.SAN.Count -gt 0) {
        Write-Host "SAN (DNS)          : $([string]::Join(', ', $certInfo.SAN))"
    }
} else {
    Write-Host "Certificate         : (not available yet or handshake failed)"
}

Write-Host ""

# 2) HTTPS request
try {
    $httpsResp = Invoke-WebRequest -Uri "https://$Domain" -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 20 -ErrorAction Stop
    Write-Host "HTTPS GET           : $($httpsResp.StatusCode) $($httpsResp.StatusDescription)"
} catch {
    $code = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { 'ERR' }
    Write-Host "HTTPS GET           : $code (error)"
}

# 3) HTTP (no redirect) to see if enforce is active later
try {
    $httpResp = Invoke-WebRequest -Uri "http://$Domain" -UseBasicParsing -MaximumRedirection 0 -TimeoutSec 20 -ErrorAction Stop
    Write-Host "HTTP GET (no redir) : $($httpResp.StatusCode) $($httpResp.StatusDescription)"
} catch {
    $httpCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { 'ERR' }
    $location = $null
    if ($_.Exception.Response -and $_.Exception.Response.Headers) {
        $location = $_.Exception.Response.Headers['Location']
    }
    if ($location) {
        Write-Host "HTTP GET (no redir) : $httpCode -> Location: $location"
    } else {
        Write-Host "HTTP GET (no redir) : $httpCode (error)"
    }
}

Write-Host ""
Write-Host "Note: 'Enforce HTTPS' in GitHub Pages will allow automatic HTTP->HTTPS redirects. If HTTP shows 301/302 with Location=https://..., enforcement is effective."
