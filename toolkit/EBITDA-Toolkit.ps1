# EBITDA Development Toolkit - Main Launcher
# One script to rule them all!

# Set up paths
$Global:TOOLKIT_DIR = $PSScriptRoot
$Global:EBITDA_DIR = (Get-Item $TOOLKIT_DIR).Parent.FullName
$Global:SKELETON_DIR = "$EBITDA_DIR\ebitda-skeleton"
$Global:SCRIPTS_DIR = "$EBITDA_DIR\claude-power\scripts"
$Global:OUTPUT_DIR = "$EBITDA_DIR\claude-output"

# Ensure output directory exists
if (-not (Test-Path $OUTPUT_DIR)) {
    New-Item -ItemType Directory -Path $OUTPUT_DIR | Out-Null
}

# Import all functions from claude-power scripts
$scriptFiles = @(
    "$SCRIPTS_DIR\claude-integration.ps1",
    "$SCRIPTS_DIR\smart-context.ps1", 
    "$SCRIPTS_DIR\auto-monitor.ps1",
    "$SCRIPTS_DIR\code-helper.ps1"
)

# ASCII Art Banner
function Show-Banner {
    Write-Host @"

    ███████╗██████╗ ██╗████████╗██████╗  █████╗ 
    ██╔════╝██╔══██╗██║╚══██╔══╝██╔══██╗██╔══██╗
    █████╗  ██████╔╝██║   ██║   ██║  ██║███████║
    ██╔══╝  ██╔══██╗██║   ██║   ██║  ██║██╔══██║
    ███████╗██████╔╝██║   ██║   ██████╔╝██║  ██║
    ╚══════╝╚═════╝ ╚═╝   ╚═╝   ╚═════╝ ╚═╝  ╚═╝
                                                  
    🚀 Development Toolkit with Claude Integration
    
"@ -ForegroundColor Cyan
}

function Show-Menu {
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor DarkCyan
    Write-Host "                    MAIN MENU                          " -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor DarkCyan
    Write-Host ""
    Write-Host "  CODE REVIEW AND ANALYSIS" -ForegroundColor Green
    Write-Host "     1. Review Current File      (Quick review)"
    Write-Host "     2. Analyze Module           (Deep dive)"
    Write-Host "     3. Smart Context Builder    (Question-based)"
    Write-Host ""
    Write-Host "  ERROR MANAGEMENT" -ForegroundColor Red
    Write-Host "     4. Collect All Errors       (One-time)"
    Write-Host "     5. Monitor Errors Live      (Real-time)"
    Write-Host "     6. Quick Fix Mode           (Get fixes)"
    Write-Host ""
    Write-Host "  PERFORMANCE AND ARCHITECTURE" -ForegroundColor Magenta
    Write-Host "     7. Performance Analysis"
    Write-Host "     8. Architecture Overview"
    Write-Host "     9. Bundle Size Check"
    Write-Host ""
    Write-Host "  FEATURE DEVELOPMENT" -ForegroundColor Cyan
    Write-Host "    10. Prepare Feature Context"
    Write-Host "    11. Refactoring Helper"
    Write-Host "    12. Test Writing Assistant"
    Write-Host ""
    Write-Host "  UTILITIES" -ForegroundColor Yellow
    Write-Host "    13. Show Recent Changes"
    Write-Host "    14. Git Status & Diff"
    Write-Host "    15. Open Output Folder"
    Write-Host ""
    Write-Host "  SETTINGS" -ForegroundColor DarkGray
    Write-Host "    20. Configure Paths"
    Write-Host "    21. Test Claude Connection"
    Write-Host ""
    Write-Host "     Q. Quit" -ForegroundColor DarkRed
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor DarkCyan
}

function Review-CurrentFile {
    Write-Host "`nFILE REVIEW MODE" -ForegroundColor Green
    Write-Host "Enter the path to the file you want to review:" -ForegroundColor Cyan
    Write-Host "Example: src/engine/auctions.ts" -ForegroundColor DarkGray
    
    $file = Read-Host "File path"
    
    if (-not $file) {
        Write-Host "❌ No file specified" -ForegroundColor Red
        return
    }
    
    $fullPath = if ([System.IO.Path]::IsPathRooted($file)) {
        $file
    } else {
        Join-Path $SKELETON_DIR $file
    }
    
    if (-not (Test-Path $fullPath)) {
        Write-Host "❌ File not found: $fullPath" -ForegroundColor Red
        return
    }
    
    & "$SCRIPTS_DIR\code-helper.ps1" review $fullPath
    
    Write-Host "`nReview context copied to clipboard!" -ForegroundColor Green
    Write-Host "Paste in Claude for code review" -ForegroundColor Cyan
}

function Analyze-Module {
    Write-Host "`nMODULE ANALYSIS MODE" -ForegroundColor Green
    Write-Host "Available modules:" -ForegroundColor Cyan
    
    $modules = Get-ChildItem -Path "$SKELETON_DIR\src" -Directory
    $index = 1
    foreach ($module in $modules) {
        Write-Host "  $index. $($module.Name)" -ForegroundColor Yellow
        $index++
    }
    
    Write-Host "`nEnter module name or number:" -ForegroundColor Cyan
    $choice = Read-Host "Module"
    
    $moduleName = $null
    if ($choice -match '^\d+$') {
        $moduleIndex = [int]$choice - 1
        if ($moduleIndex -ge 0 -and $moduleIndex -lt $modules.Count) {
            $moduleName = $modules[$moduleIndex].Name
        }
    } else {
        $moduleName = $choice
    }
    
    if ($moduleName) {
        & "$SCRIPTS_DIR\claude-integration.ps1" analyze $moduleName
    } else {
        Write-Host "❌ Invalid module selection" -ForegroundColor Red
    }
}

function Build-SmartContext {
    Write-Host "`nSMART CONTEXT BUILDER" -ForegroundColor Green
    Write-Host "Ask a question about your code, and I'll gather relevant context:" -ForegroundColor Cyan
    Write-Host "Example: 'How do I optimize the auction system?'" -ForegroundColor DarkGray
    
    $question = Read-Host "Your question"
    
    if ($question) {
        & "$SCRIPTS_DIR\smart-context.ps1" $question
    } else {
        Write-Host "❌ No question provided" -ForegroundColor Red
    }
}

function Collect-Errors {
    Write-Host "`nCOLLECTING ALL ERRORS..." -ForegroundColor Red
    & "$SCRIPTS_DIR\claude-integration.ps1" errors
}

function Monitor-Errors {
    Write-Host "`nSTARTING ERROR MONITOR..." -ForegroundColor Red
    Write-Host "This will watch for errors in real-time" -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop" -ForegroundColor DarkGray
    
    & "$SCRIPTS_DIR\auto-monitor.ps1" -Watch -AutoCopy
}

function Start-QuickFix {
    Write-Host "`nQUICK FIX MODE" -ForegroundColor Green
    & "$SCRIPTS_DIR\auto-monitor.ps1"
}

function Analyze-Performance {
    Write-Host "`nPERFORMANCE ANALYSIS..." -ForegroundColor Magenta
    & "$SCRIPTS_DIR\claude-integration.ps1" perf
}

function Show-Architecture {
    Write-Host "`nGENERATING ARCHITECTURE OVERVIEW..." -ForegroundColor Magenta
    & "$SCRIPTS_DIR\claude-integration.ps1" arch
}

function Check-BundleSize {
    Write-Host "`nCHECKING BUNDLE SIZE..." -ForegroundColor Magenta
    
    Push-Location $SKELETON_DIR
    
    # Build if dist doesn't exist
    if (-not (Test-Path "dist")) {
        Write-Host "Building project first..." -ForegroundColor Yellow
        npm run build 2>&1 | Out-Null
    }
    
    $files = Get-ChildItem -Path "dist" -Recurse -File | Sort-Object Length -Descending
    
    Write-Host "`nBundle Analysis:" -ForegroundColor Cyan
    Write-Host "════════════════════════════════════" -ForegroundColor DarkCyan
    
    $totalSize = 0
    foreach ($file in $files | Select-Object -First 10) {
        $sizeKB = [Math]::Round($file.Length / 1KB, 2)
        $totalSize += $file.Length
        
        $color = "Green"
        if ($sizeKB -gt 500) { $color = "Red" }
        elseif ($sizeKB -gt 200) { $color = "Yellow" }
        
        Write-Host ("  {0,-30} {1,10} KB" -f $file.Name, $sizeKB) -ForegroundColor $color
    }
    
    Write-Host "════════════════════════════════════" -ForegroundColor DarkCyan
    $totalMB = [Math]::Round($totalSize / 1MB, 2)
    Write-Host "Total Bundle Size: $totalMB MB" -ForegroundColor $(if ($totalMB -gt 5) { "Red" } else { "Green" })
    
    Pop-Location
}

function Prepare-Feature {
    Write-Host "`nFEATURE PREPARATION" -ForegroundColor Cyan
    Write-Host "Enter feature name (e.g., multiplayer, achievements):" -ForegroundColor Yellow
    
    $feature = Read-Host "Feature name"
    
    if ($feature) {
        & "$SCRIPTS_DIR\claude-integration.ps1" feature $feature
    } else {
        Write-Host "❌ No feature name provided" -ForegroundColor Red
    }
}

function Show-RecentChanges {
    Write-Host "`nRECENT CHANGES" -ForegroundColor Green
    
    Push-Location $SKELETON_DIR
    
    $changes = @"
# Recent Changes Report

## Git Status
``````
$(git status --short)
``````

## Last 5 Commits
``````
$(git log --oneline -5)
``````

## Changes in Last Commit
``````diff
$(git diff HEAD~1)
``````

## Unstaged Changes
``````diff
$(git diff)
``````

Please review these changes for:
1. Code quality
2. Potential bugs
3. Performance impact
4. Best practices
"@
    
    $changes | Set-Clipboard
    
    Write-Host "Changes copied to clipboard!" -ForegroundColor Green
    Write-Host "Paste in Claude for review" -ForegroundColor Cyan
    
    Pop-Location
}

function Show-GitStatus {
    Write-Host "`nGIT STATUS" -ForegroundColor Green
    
    Push-Location $SKELETON_DIR
    
    Write-Host "`nRepository Status:" -ForegroundColor Cyan
    git status
    
    Write-Host "`nRecent Commits:" -ForegroundColor Cyan
    git log --oneline -5
    
    Write-Host "`nBranch Info:" -ForegroundColor Cyan
    git branch -v
    
    Pop-Location
    
    Write-Host "`nPress any key to continue..." -ForegroundColor DarkGray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Open-OutputFolder {
    Write-Host "`nOpening output folder..." -ForegroundColor Green
    Start-Process explorer.exe $OUTPUT_DIR
}

function Configure-Paths {
    Write-Host "`nPATH CONFIGURATION" -ForegroundColor Yellow
    Write-Host "Current paths:" -ForegroundColor Cyan
    Write-Host "  EBITDA Directory: $EBITDA_DIR" -ForegroundColor Gray
    Write-Host "  Skeleton Directory: $SKELETON_DIR" -ForegroundColor Gray
    Write-Host "  Output Directory: $OUTPUT_DIR" -ForegroundColor Gray
    
    Write-Host "`nThese paths are auto-detected. No changes needed!" -ForegroundColor Green
}

function Test-ClaudeConnection {
    Write-Host "`nTESTING CLAUDE CONNECTION" -ForegroundColor Yellow
    
    $testMessage = @"
# Claude Connection Test

This is a test message from the EBITDA Toolkit.

If you can read this in Claude, the connection is working!

## Test Data
- Timestamp: $(Get-Date)
- User: $env:USERNAME
- Directory: $EBITDA_DIR

## Next Steps
1. Try using the Smart Context Builder
2. Review some code
3. Analyze performance

Ready to help with your EBITDA development!
"@
    
    $testMessage | Set-Clipboard
    
    Write-Host "Test message copied to clipboard!" -ForegroundColor Green
    Write-Host "Paste in Claude to verify connection" -ForegroundColor Cyan
    Write-Host "`nIf Claude responds, everything is working!" -ForegroundColor Yellow
}

function Show-Help {
    Write-Host "`nTOOLKIT HELP" -ForegroundColor Cyan
    Write-Host @"

This toolkit helps you work with Claude more efficiently by:

1. READING your actual code files
2. FORMATTING them with context
3. COPYING to clipboard for Claude

QUICK START:
- Use option 3 (Smart Context) for questions
- Use option 4 (Collect Errors) when you have TypeScript errors
- Use option 7 (Performance) to optimize

PRO TIPS:
- Keep option 5 (Monitor) running while coding
- Use Smart Context instead of copying random files
- Review changes before committing (option 13)

All output is saved to: $OUTPUT_DIR

Press any key to return to menu...
"@ -ForegroundColor Gray
    
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Main Program Loop
Clear-Host
Show-Banner

while ($true) {
    Show-Menu
    
    $choice = Read-Host "`nSelect option"
    
    switch ($choice) {
        "1" { Review-CurrentFile }
        "2" { Analyze-Module }
        "3" { Build-SmartContext }
        "4" { Collect-Errors }
        "5" { Monitor-Errors }
        "6" { Start-QuickFix }
        "7" { Analyze-Performance }
        "8" { Show-Architecture }
        "9" { Check-BundleSize }
        "10" { Prepare-Feature }
        "11" { 
            Write-Host "`nREFACTORING HELPER" -ForegroundColor Green
            Write-Host "Enter module to refactor:" -ForegroundColor Cyan
            $module = Read-Host "Module"
            if ($module) {
                & "$SCRIPTS_DIR\claude-integration.ps1" analyze $module
            }
        }
        "12" {
            Write-Host "`nTEST WRITING ASSISTANT" -ForegroundColor Green
            & "$SCRIPTS_DIR\claude-integration.ps1" test
        }
        "13" { Show-RecentChanges }
        "14" { Show-GitStatus }
        "15" { Open-OutputFolder }
        "20" { Configure-Paths }
        "21" { Test-ClaudeConnection }
        "?" { Show-Help }
        "h" { Show-Help }
        "help" { Show-Help }
        "q" { 
            Write-Host "`nThanks for using EBITDA Toolkit!" -ForegroundColor Green
            Write-Host "Happy coding!" -ForegroundColor Cyan
            exit 
        }
        "Q" { 
            Write-Host "`nThanks for using EBITDA Toolkit!" -ForegroundColor Green
            Write-Host "Happy coding!" -ForegroundColor Cyan
            exit 
        }
        default {
            Write-Host "Invalid option. Please try again." -ForegroundColor Red
        }
    }
    
    Write-Host "`nPress Enter to continue..." -ForegroundColor DarkGray
    Read-Host
    Clear-Host
    Show-Banner
}