# ==============================================================================
# MUALLIM UL-QUR'AN — AUTOMATED DEPLOY SCRIPT (deploy.ps1)
# Loads secrets and configurations from .env and performs deployment
# ==============================================================================

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }
Set-Location $root

# 1. Load .env variables into Process Environment
$envFile = Join-Path $root ".env"
if (Test-Path $envFile) {
    Write-Host "[Deploy] Loading environment from .env..." -ForegroundColor Cyan
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            $key = $parts[0].Trim()
            $val = $parts[1].Trim().Trim('"').Trim("'")
            [System.Environment]::SetEnvironmentVariable($key, $val, "Process")
        }
    }
} else {
    Write-Warning "[Deploy] .env file not found at $envFile"
}

$ghToken = [System.Environment]::GetEnvironmentVariable("GITHUB_TOKEN", "Process")
$fbToken = [System.Environment]::GetEnvironmentVariable("FIREBASE_TOKEN", "Process")
$fbProject = [System.Environment]::GetEnvironmentVariable("FIREBASE_DEPLOY_PROJECT", "Process")
if (-not $fbProject) { $fbProject = "muallim-123" }

# ------------------------------------------------------------------------------
# 2. GITHUB PAGES DEPLOYMENT (Git Push)
# ------------------------------------------------------------------------------
Write-Host "`n=== [1/2] Deploying to GitHub Pages (origin/main) ===" -ForegroundColor Yellow
if ($ghToken) {
    Write-Host "[Deploy] Using GITHUB_TOKEN from .env..." -ForegroundColor Green
    $authPrefix = if ($ghToken.StartsWith("ghp_")) { "$ghToken" } else { "x-access-token:$ghToken" }
    $repoUrl = "https://$($authPrefix)@github.com/nomaanc/muallim.git"
    git push $repoUrl main 2>&1
} else {
    Write-Host "[Deploy] GITHUB_TOKEN not set in .env. Attempting push with default git credentials..." -ForegroundColor Yellow
    $env:GIT_TERMINAL_PROMPT = 0
    git push origin main 2>&1
}

# ------------------------------------------------------------------------------
# 3. FIREBASE HOSTING DEPLOYMENT
# ------------------------------------------------------------------------------
Write-Host "`n=== [2/2] Deploying to Firebase Hosting ($fbProject) ===" -ForegroundColor Yellow
if ($fbToken) {
    Write-Host "[Deploy] Using FIREBASE_TOKEN from .env..." -ForegroundColor Green
    firebase deploy --only hosting --token $fbToken --project $fbProject 2>&1
} else {
    Write-Host "[Deploy] Attempting Firebase Hosting deploy using active CLI login..." -ForegroundColor Yellow
    firebase deploy --only hosting --project $fbProject 2>&1
}

Write-Host "`n[Deploy] Deployment routine completed." -ForegroundColor Cyan
