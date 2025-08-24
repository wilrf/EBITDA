# Auto-Monitor Script for EBITDA Development
# Watches for changes and automatically prepares Claude context

param(
    [switch]$Watch,
    [switch]$AutoCopy,
    [int]$CheckInterval = 5
)

$EBITDA_DIR = "C:\Users\wilso\Downloads\EBITDA"
$SKELETON_DIR = "$EBITDA_DIR\ebitda-skeleton"
$MONITOR_FILE = "$EBITDA_DIR\claude-output\.monitor-state.json"

# Initialize monitoring state
if (-not (Test-Path $MONITOR_FILE)) {
    @{
        LastCheck = (Get-Date).ToString()
        LastError = $null
        ErrorCount = 0
        FileHashes = @{}
    } | ConvertTo-Json | Out-File $MONITOR_FILE
}

function Get-ProjectStatus {
    $status = @{
        Timestamp = Get-Date
        TypeScriptErrors = @()
        BuildStatus = $null
        ChangedFiles = @()
        TestStatus = $null
        Performance = @{}
    }
    
    # Check TypeScript errors
    Push-Location $SKELETON_DIR
    
    $tsErrors = npx tsc --noEmit 2>&1
    if ($LASTEXITCODE -ne 0) {
        $status.TypeScriptErrors = $tsErrors | Where-Object { $_ -match "error TS" }
    }
    
    # Check for changed files
    $gitStatus = git status --short
    if ($gitStatus) {
        $status.ChangedFiles = $gitStatus
    }
    
    # Quick performance check
    $distSize = 0
    if (Test-Path "$SKELETON_DIR\dist") {
        $distFiles = Get-ChildItem "$SKELETON_DIR\dist" -Recurse -File
        $distSize = ($distFiles | Measure-Object -Property Length -Sum).Sum / 1MB
    }
    $status.Performance["BundleSizeMB"] = [Math]::Round($distSize, 2)
    
    Pop-Location
    
    return $status
}

function Format-StatusReport {
    param($Status)
    
    $report = @"
# EBITDA Development Status - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## 🚨 Active Issues

"@
    
    if ($Status.TypeScriptErrors.Count -gt 0) {
        $report += "### TypeScript Errors ($($Status.TypeScriptErrors.Count))`n"
        $report += "``````typescript`n"
        $Status.TypeScriptErrors | Select-Object -First 10 | ForEach-Object {
            $report += "$_`n"
        }
        $report += "``````n`n"
    } else {
        $report += "✅ No TypeScript errors`n`n"
    }
    
    if ($Status.ChangedFiles.Count -gt 0) {
        $report += "### Uncommitted Changes`n"
        $report += "``````diff`n"
        $Status.ChangedFiles | ForEach-Object {
            $report += "$_`n"
        }
        $report += "``````n`n"
    }
    
    $report += @"
## 📊 Metrics

- Bundle Size: $($Status.Performance.BundleSizeMB) MB
- Changed Files: $($Status.ChangedFiles.Count)
- TypeScript Errors: $($Status.TypeScriptErrors.Count)

## 🔍 Quick Actions

"@
    
    if ($Status.TypeScriptErrors.Count -gt 0) {
        $report += @"
### Fix TypeScript Errors
The following errors need immediate attention:

"@
        # Analyze error patterns
        $errorTypes = @{}
        foreach ($error in $Status.TypeScriptErrors) {
            if ($error -match "error TS(\d+)") {
                $errorCode = $Matches[1]
                if (-not $errorTypes.ContainsKey($errorCode)) {
                    $errorTypes[$errorCode] = 0
                }
                $errorTypes[$errorCode]++
            }
        }
        
        foreach ($errorType in $errorTypes.GetEnumerator() | Sort-Object Value -Descending) {
            $report += "- TS$($errorType.Key): $($errorType.Value) occurrences`n"
        }
    }
    
    return $report
}

function Watch-Project {
    Write-Host "👁️ Starting project monitor..." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Yellow
    
    $lastState = Get-Content $MONITOR_FILE | ConvertFrom-Json
    $errorHistory = @()
    
    while ($true) {
        Clear-Host
        Write-Host "🔄 Checking project status..." -ForegroundColor Green
        
        $status = Get-ProjectStatus
        
        # Display summary
        Write-Host "`n📊 Current Status:" -ForegroundColor Cyan
        Write-Host "  TypeScript Errors: $($status.TypeScriptErrors.Count)" -ForegroundColor $(if ($status.TypeScriptErrors.Count -eq 0) { "Green" } else { "Red" })
        Write-Host "  Changed Files: $($status.ChangedFiles.Count)" -ForegroundColor Yellow
        Write-Host "  Bundle Size: $($status.Performance.BundleSizeMB) MB" -ForegroundColor Magenta
        
        # Check for new errors
        if ($status.TypeScriptErrors.Count -gt $lastState.ErrorCount) {
            Write-Host "`n⚠️ NEW ERRORS DETECTED!" -ForegroundColor Red
            
            if ($AutoCopy) {
                $report = Format-StatusReport -Status $status
                $report | Set-Clipboard
                Write-Host "📋 Error report copied to clipboard" -ForegroundColor Green
            }
            
            # Show first few errors
            Write-Host "`nFirst 3 errors:" -ForegroundColor Red
            $status.TypeScriptErrors | Select-Object -First 3 | ForEach-Object {
                Write-Host "  $_" -ForegroundColor DarkRed
            }
        }
        elseif ($status.TypeScriptErrors.Count -lt $lastState.ErrorCount) {
            Write-Host "`n✅ Errors reduced from $($lastState.ErrorCount) to $($status.TypeScriptErrors.Count)" -ForegroundColor Green
        }
        
        # Update state
        $lastState.ErrorCount = $status.TypeScriptErrors.Count
        $lastState.LastCheck = (Get-Date).ToString()
        $lastState | ConvertTo-Json | Out-File $MONITOR_FILE
        
        # Show recent file changes
        if ($status.ChangedFiles.Count -gt 0) {
            Write-Host "`n📝 Recent Changes:" -ForegroundColor Cyan
            $status.ChangedFiles | Select-Object -First 5 | ForEach-Object {
                Write-Host "  $_" -ForegroundColor Gray
            }
        }
        
        Write-Host "`n⏱️ Next check in $CheckInterval seconds..." -ForegroundColor DarkGray
        Start-Sleep -Seconds $CheckInterval
    }
}

function Start-QuickFix {
    Write-Host "🔧 Starting Quick Fix mode..." -ForegroundColor Cyan
    
    $status = Get-ProjectStatus
    
    if ($status.TypeScriptErrors.Count -eq 0) {
        Write-Host "✅ No errors to fix!" -ForegroundColor Green
        return
    }
    
    Write-Host "Found $($status.TypeScriptErrors.Count) errors" -ForegroundColor Red
    
    # Group errors by file
    $errorsByFile = @{}
    foreach ($error in $status.TypeScriptErrors) {
        if ($error -match "([^(]+)\((\d+),(\d+)\): error") {
            $file = $Matches[1]
            if (-not $errorsByFile.ContainsKey($file)) {
                $errorsByFile[$file] = @()
            }
            $errorsByFile[$file] += $error
        }
    }
    
    # Prepare fix context for Claude
    $fixContext = @"
# Quick Fix Request

## Errors to Fix

"@
    
    foreach ($file in $errorsByFile.Keys | Select-Object -First 3) {
        $fixContext += "### File: $file`n"
        $fixContext += "``````typescript`n"
        
        if (Test-Path $file) {
            $content = Get-Content $file -Raw
            $fixContext += $content
        }
        
        $fixContext += "``````n`n"
        $fixContext += "**Errors:**`n"
        foreach ($error in $errorsByFile[$file]) {
            $fixContext += "- $error`n"
        }
        $fixContext += "`n"
    }
    
    $fixContext += @"

## Fix Instructions

Please provide fixes for these TypeScript errors:
1. Show the exact code changes needed
2. Explain why each error occurs
3. Ensure fixes maintain functionality
4. Follow existing code patterns

Provide the fixes in a format ready to paste.
"@
    
    $fixContext | Set-Clipboard
    
    Write-Host "✅ Fix context copied to clipboard!" -ForegroundColor Green
    Write-Host "📋 Paste in Claude to get fixes" -ForegroundColor Cyan
}

# Main execution
if ($Watch) {
    Watch-Project
} else {
    # Single status check
    $status = Get-ProjectStatus
    $report = Format-StatusReport -Status $status
    
    if ($AutoCopy) {
        $report | Set-Clipboard
        Write-Host "📋 Status report copied to clipboard" -ForegroundColor Green
    } else {
        Write-Host $report
    }
    
    # Offer quick actions
    if ($status.TypeScriptErrors.Count -gt 0) {
        Write-Host "`n❓ Would you like to prepare a fix request for Claude? (Y/N)" -ForegroundColor Yellow
        $response = Read-Host
        if ($response -eq 'Y' -or $response -eq 'y') {
            Start-QuickFix
        }
    }
}