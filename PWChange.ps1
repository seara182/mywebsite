$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$sites = @(
    @{ Label = "Masteranalyse";    Path = "private/master/index.html";         Dir = "private/master" }
    @{ Label = "Fragen";           Path = "private/fragen/index.html";         Dir = "private/fragen" }
    @{ Label = "Haribo Monster";   Path = "private/haribo-monster/index.html"; Dir = "private/haribo-monster" }
)

function Read-SecurePasswordPlain([string]$prompt) {
    $secure = Read-Host -Prompt $prompt -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try {
        return [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    } finally {
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
}

Write-Host ""
Write-Host "=== StatiCrypt Password Rotator ===" -ForegroundColor Cyan
Write-Host ""
for ($i = 0; $i -lt $sites.Count; $i++) {
    Write-Host "  $($i + 1)) $($sites[$i].Label)  ($($sites[$i].Path))"
}
Write-Host "  $($sites.Count + 1)) All of the above"
Write-Host "  0) Cancel"
Write-Host ""

$choice = Read-Host "Enter choice"
if ($choice -eq "0" -or [string]::IsNullOrWhiteSpace($choice)) {
    Write-Host "Cancelled."
    exit 0
}

$selected = @()
if ([int]$choice -eq ($sites.Count + 1)) {
    $selected = $sites
} elseif ([int]$choice -ge 1 -and [int]$choice -le $sites.Count) {
    $selected = @($sites[[int]$choice - 1])
} else {
    Write-Host "Invalid choice." -ForegroundColor Red
    exit 1
}

$changedPaths = @()

foreach ($site in $selected) {
    Write-Host ""
    Write-Host "--- $($site.Label) ---" -ForegroundColor Yellow

    $pw1 = Read-SecurePasswordPlain "New password"
    $pw2 = Read-SecurePasswordPlain "Confirm password"

    if ($pw1 -ne $pw2) {
        Write-Host "Passwords didn't match, skipping $($site.Label)." -ForegroundColor Red
        continue
    }
    if ([string]::IsNullOrEmpty($pw1)) {
        Write-Host "Empty password, skipping $($site.Label)." -ForegroundColor Red
        continue
    }

    $env:STATICRYPT_PASSWORD = $pw1
    try {
        & npx --yes staticrypt $site.Path -d $site.Dir --short
        if ($LASTEXITCODE -ne 0) {
            throw "staticrypt exited with code $LASTEXITCODE"
        }
    } catch {
        Write-Host "Failed to encrypt $($site.Label): $_" -ForegroundColor Red
        continue
    } finally {
        Remove-Item Env:\STATICRYPT_PASSWORD -ErrorAction SilentlyContinue
        $pw1 = $null
        $pw2 = $null
    }

    Write-Host "$($site.Label) password updated." -ForegroundColor Green
    $changedPaths += $site.Path
}

if ($changedPaths.Count -eq 0) {
    Write-Host ""
    Write-Host "Nothing changed, skipping commit/push."
    exit 0
}

Write-Host ""
Write-Host "Committing and pushing: $($changedPaths -join ', ')" -ForegroundColor Cyan

& git add $changedPaths
$commitMsg = "Rotate StatiCrypt password for: " + (($changedPaths | ForEach-Object { $_ }) -join ", ")
& git commit -m $commitMsg
if ($LASTEXITCODE -ne 0) {
    Write-Host "git commit failed." -ForegroundColor Red
    exit 1
}

& git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "git push failed -- commit was made locally but NOT pushed. Push manually once resolved." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Done. New password(s) are live." -ForegroundColor Green
