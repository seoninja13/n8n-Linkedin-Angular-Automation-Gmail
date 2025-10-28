# N8N Workflow Backup Script
# This script retrieves all workflows from N8N and saves them to individual JSON files

$ErrorActionPreference = "Stop"
$backupDir = "Docs/backups/workflows/2025-10-27"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Write-Host "Starting N8N Workflow Backup at $timestamp" -ForegroundColor Green
Write-Host "Backup Directory: $backupDir" -ForegroundColor Cyan

# Create backup directory if it doesn't exist
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

# Initialize tracking variables
$totalWorkflows = 0
$successCount = 0
$failureCount = 0
$failedWorkflows = @()
$backupIndex = @()

# Workflow IDs to backup (all 83 workflows)
$workflowIds = @(
    "0ZJ84RLQXxuYKLyE", "0hP6wpsGwor3Az4w", "1XJcb1D52YHOTg5O", "2q7WYwXUWW8d0KFT",
    "3gyBXNi1h5DH7pxH", "4vh5vHoB3A6nFtKk", "5LfnNVYjb5XeIGKB", "6JebX2tkKaIikW6X",
    "6YhrEliS6BM1pA9b", "7gObXzz3XcgJur5y", "9H1dHJMS11mPviFJ", "9V19pL4u1uWNRCnM",
    "A81HneikzDr9v8JZ", "BS7QKeiL6mTZgTdL", "Ccj3e5fuNnEVT7et", "DxrAE1UkbFi0uygw",
    "ELdjeuQ5rfeQTQBt", "EsoXGaPVT9laQTM2", "G0LmOpbk32nKgEFW", "GNkboWJqUc6EjHEw",
    "HuZ10YOgOiTlYGrM", "JcjIVfklCoBn4V06", "LDqhQyGgzGTpcB9z", "Lvri1HXvMKWJsvrS",
    "MlsJPTQLhYeRu71x", "NpaqFnut2a3IjPAy", "O2WWZ0yOIy1AvhWu", "P322NssvebqybFR4",
    "P7eO1YpSHFOaoOEx", "PmfQs8Nieiu8JwAS", "QXOZ7vVN2Hxa8pwU", "RYtTKsLFW071ocjV",
    "SpxbctUIJ4T3uixz", "TMinfTZw08VO1zln", "Tb5GLu34QCnRdpzV", "UD4BXHqXgheWDBB4",
    "UVltelfo7oSeizdJ", "UaKYKKLTlzSZkm2d", "ViL8DCcmEdypFNl1", "Vp9DpKF3xT2ysHhx",
    "WFGqvgflltOYV725", "XK7D6MQGtiQIBkK8", "Xkk3TA9tXqcJfwsc", "Yi0ysYoLF0ZnkKDe",
    "ZRIuHXQTboYWr1mg", "aSfQIhNAP61PQls4", "arCgdIWds7ukV01g", "bpfuL3HjZuD27Ca3",
    "bsoA0EiMQmGvkehn", "cXDVyFeBzeV4XzPL", "dbRbOPEHZHeUat6I", "eZ2Ii042dhrElksg",
    "fGpR7xvrOO7PBa0c", "fT9tJDZX0vZgGFj0", "g5dafJdgAFeA7Lfa", "hb0SbEyBhIaefOQW",
    "jcx2bQGYtsdmfyZ8", "jjwGeSzGcDJHYwdl", "kGSBYFEnR4zlQi9B", "kyZHzKyhccAMztDL",
    "lSxXHchJLt15Ihir", "mQodHXPxnKwkfp50", "n4mD6Uk59K3zG8IJ", "nilzTTF37TrXgrZM",
    "obUjLRcMi1gYDtBV", "p29jwbAAG8uXMYMM", "qFwEFftrRdJU4iGy", "qRciPpY0DlFJyI8i",
    "qWMubgbQCCk8CrII", "qsOwrB0ngdZVEqmO", "rClUELDAK9f4mgJx", "rIgtJFucWwkYvN6y",
    "t8Ir4T6OyawSlhB8", "tWtAIXFVSqXjZauJ", "vN2iUMbQLnlSD9kl", "wGMwxZLEYwNVc6nc",
    "wZyxRjWShhnSFbSV", "wbkQo6X2R8XQOYgG", "wiCzOPufSIU2CuGk", "x33UPk434JnKfLuq",
    "xqsnSAfaUqfKpput", "ymSOfM116zDL38Is", "zTtSVmTg3UaV9tPG"
)

$totalWorkflows = $workflowIds.Count
Write-Host "Total workflows to backup: $totalWorkflows" -ForegroundColor Yellow

# Note: This script requires the N8N MCP server to be running
# The actual backup will be performed by the AI agent using the n8n_get_workflow tool
# This script serves as a template and documentation

Write-Host "`nBackup process will be handled by AI agent using N8N MCP tools" -ForegroundColor Cyan
Write-Host "Expected output: $totalWorkflows JSON files in $backupDir" -ForegroundColor Cyan

