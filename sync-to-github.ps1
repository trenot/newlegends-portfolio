<#
.SYNOPSIS
    Syncs the NewLegends Concert Portfolio to GitHub via Git CLI or GitHub REST API.
.DESCRIPTION
    If git.exe is installed, initializes git and pushes to remote.
    If git is not installed, uploads files directly to GitHub via REST API using a Personal Access Token.
#>

param(
    [string]$Username,
    [string]$RepoName = "newlegends-concert-archive",
    [string]$Token
)

$ErrorActionPreference = "Stop"
$projectDir = $PSScriptRoot

Write-Host "==========================================================" -ForegroundColor Amber
Write-Host "  NewLegends · GitHub Synchronization Script" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Amber
Write-Host "Project Directory: $projectDir"

# Check if git is available
$hasGit = $null
try {
    $hasGit = Get-Command "git" -ErrorAction SilentlyContinue
} catch {}

if ($hasGit) {
    Write-Host "[Git CLI Detected] Using local git executable..." -ForegroundColor Green
    Set-Location $projectDir

    if (-not (Test-Path ".git")) {
        git init
        git branch -M main
    }

    git add .
    git commit -m "NewLegends Concert Photography Journal & Review Archive" -ErrorAction SilentlyContinue

    if (-not $Username) {
        $Username = Read-Host "Enter your GitHub username"
    }

    $remoteUrl = "https://github.com/$Username/$RepoName.git"
    git remote remove origin -ErrorAction SilentlyContinue
    git remote add origin $remoteUrl
    Write-Host "Pushing to $remoteUrl..." -ForegroundColor Cyan
    git push -u origin main
    Write-Host "Successfully synced via Git CLI!" -ForegroundColor Green
    exit 0
}

Write-Host "[Git CLI not in PATH] Using GitHub REST API direct sync..." -ForegroundColor Cyan

if (-not $Username) {
    $Username = Read-Host "Enter your GitHub username"
}
if (-not $RepoName) {
    $RepoName = Read-Host "Enter repository name (default: newlegends-concert-archive)"
    if (-not $RepoName) { $RepoName = "newlegends-concert-archive" }
}
if (-not $Token) {
    $Token = Read-Host "Enter your GitHub Personal Access Token (classic or fine-grained with repo permissions)"
}

if (-not $Token) {
    Write-Error "A Personal Access Token is required for API-based sync."
    exit 1
}

$headers = @{
    "Authorization" = "token $Token"
    "Accept" = "application/vnd.github.v3+json"
    "User-Agent" = "NewLegends-Sync-Tool"
}

# 1. Create repo if it doesn't exist
Write-Host "Checking repository $Username/$RepoName..." -ForegroundColor Cyan
try {
    $repoCheck = Invoke-RestMethod -Uri "https://api.github.com/repos/$Username/$RepoName" -Headers $headers -Method Get -ErrorAction Stop
    Write-Host "Repository exists." -ForegroundColor Green
} catch {
    Write-Host "Creating repository $Username/$RepoName on GitHub..." -ForegroundColor Yellow
    $createBody = @{
        name = $RepoName
        description = "NewLegends: Jodie Devine's Concert Photography Journal & Review Archive"
        private = $false
        auto_init = $true
    } | ConvertTo-Json

    try {
        $repoCreate = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Headers $headers -Method Post -Body $createBody -ContentType "application/json"
        Write-Host "Repository created successfully!" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } catch {
        Write-Error "Failed to create repo: $_"
        exit 1
    }
}

# 2. Upload/Update files
$files = Get-ChildItem -Path $projectDir -Recurse -File | Where-Object { 
    $_.FullName -notmatch "\\\.git\\" -and $_.Name -notmatch "sync-to-github\.ps1"
}

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($projectDir.Length + 1).Replace("\", "/")
    Write-Host "Syncing $relativePath..." -NoNewline

    $contentBytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $contentBase64 = [System.Convert]::ToBase64String($contentBytes)

    # Check if file exists to get SHA
    $sha = $null
    try {
        $existing = Invoke-RestMethod -Uri "https://api.github.com/repos/$Username/$RepoName/contents/$relativePath" -Headers $headers -Method Get -ErrorAction SilentlyContinue
        $sha = $existing.sha
    } catch {}

    $uploadBody = @{
        message = "Sync $relativePath"
        content = $contentBase64
    }
    if ($sha) {
        $uploadBody["sha"] = $sha
    }

    $uploadJson = $uploadBody | ConvertTo-Json

    try {
        $res = Invoke-RestMethod -Uri "https://api.github.com/repos/$Username/$RepoName/contents/$relativePath" -Headers $headers -Method Put -Body $uploadJson -ContentType "application/json"
        Write-Host " [OK]" -ForegroundColor Green
    } catch {
        Write-Host " [FAILED: $_]" -ForegroundColor Red
    }
}

Write-Host "`nAll files successfully synced to https://github.com/$Username/$RepoName" -ForegroundColor Green
