# PowerShell script for ACTUAL code review workflow
# This prepares your code for pasting into Claude

param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    
    [Parameter(Position=1)]
    [string]$FilePath = ""
)

$EBITDA_DIR = "C:\Users\wilso\Downloads\EBITDA"

function Show-Help {
    Write-Host @"
🎮 EBITDA Code Helper - Prepare code for Claude review

USAGE:
    .\code-helper.ps1 review [file]     - Prepare file for review
    .\code-helper.ps1 context [pattern] - Gather context files
    .\code-helper.ps1 error [file]      - Include file with error context
    .\code-helper.ps1 feature [files]   - Prepare multiple files for feature work
    .\code-helper.ps1 debug             - Gather debug context

EXAMPLES:
    .\code-helper.ps1 review src/engine/auctions.ts
    .\code-helper.ps1 context "*.ts"
    .\code-helper.ps1 error src/main.tsx

This script:
1. Reads your actual code files
2. Formats them with context
3. Copies to clipboard ready for Claude
"@ -ForegroundColor Cyan
}

function Format-CodeForReview {
    param([string]$Path)
    
    if (-not (Test-Path $Path)) {
        Write-Host "❌ File not found: $Path" -ForegroundColor Red
        return
    }
    
    $content = Get-Content $Path -Raw
    $fileName = Split-Path $Path -Leaf
    $lines = (Get-Content $Path).Count
    
    $prompt = @"
Review this EBITDA game code for performance, memory leaks, and best practices:

**File:** ``$fileName``
**Path:** ``$Path``
**Lines:** $lines
**Context:** Part of PE simulation game, must maintain 60 FPS with 10k entities

``````typescript
$content
``````

Please check for:
1. Performance bottlenecks
2. Memory leaks
3. Determinism issues
4. Type safety problems
5. Best practice violations

Provide specific line numbers for any issues found.
"@
    
    $prompt | Set-Clipboard
    Write-Host "✅ Code review prepared and copied to clipboard!" -ForegroundColor Green
    Write-Host "📋 File: $fileName ($lines lines)" -ForegroundColor Yellow
    Write-Host "🚀 Paste into Claude to get review" -ForegroundColor Cyan
}

function Format-ErrorContext {
    param([string]$Path)
    
    if (-not (Test-Path $Path)) {
        Write-Host "❌ File not found: $Path" -ForegroundColor Red
        return
    }
    
    $content = Get-Content $Path -Raw
    $fileName = Split-Path $Path -Leaf
    
    # Try to get recent error from npm/node
    $errorLog = ""
    $logPath = "$EBITDA_DIR\ebitda-skeleton\npm-debug.log"
    if (Test-Path $logPath) {
        $errorLog = Get-Content $logPath -Tail 50 -Raw
    }
    
    $prompt = @"
Debug this EBITDA game error:

**File with error:** ``$fileName``
**Path:** ``$Path``

``````typescript
$content
``````

**Error Output:**
``````
$errorLog
``````

Find the root cause and provide a fix.
"@
    
    $prompt | Set-Clipboard
    Write-Host "✅ Error context prepared and copied!" -ForegroundColor Green
    Write-Host "🐛 Paste into Claude for debugging help" -ForegroundColor Yellow
}

function Gather-ContextFiles {
    param([string]$Pattern = "*.ts")
    
    $files = Get-ChildItem -Path "$EBITDA_DIR\ebitda-skeleton\src" -Filter $Pattern -Recurse | Select-Object -First 5
    
    $prompt = "Review these related EBITDA game files for context:`n`n"
    
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw
        $relativePath = $file.FullName.Replace("$EBITDA_DIR\ebitda-skeleton\", "")
        
        $prompt += @"
**File:** ``$relativePath``
``````typescript
$content
``````

"@
    }
    
    $prompt += "`nAnalyze the overall architecture and identify improvements."
    
    $prompt | Set-Clipboard
    Write-Host "✅ Context files gathered and copied!" -ForegroundColor Green
    Write-Host "📁 Included $($files.Count) files matching: $Pattern" -ForegroundColor Yellow
}

function Prepare-FeatureFiles {
    param([string[]]$Files)
    
    $prompt = "Help implement a new feature across these EBITDA game files:`n`n"
    
    foreach ($filePath in $Files) {
        if (Test-Path $filePath) {
            $content = Get-Content $filePath -Raw
            $fileName = Split-Path $filePath -Leaf
            
            $prompt += @"
**File:** ``$fileName``
``````typescript
$content
``````

"@
        }
    }
    
    $prompt += @"

Requirements:
- Maintain 60 FPS performance
- Ensure deterministic behavior
- Follow existing patterns
- Add proper TypeScript types

Provide implementation code for the feature.
"@
    
    $prompt | Set-Clipboard
    Write-Host "✅ Feature files prepared and copied!" -ForegroundColor Green
    Write-Host "✨ Ready for feature implementation" -ForegroundColor Yellow
}

# Main command handler
switch ($Command.ToLower()) {
    "review" {
        if ($FilePath) {
            Format-CodeForReview -Path $FilePath
        } else {
            Write-Host "❌ Please specify a file to review" -ForegroundColor Red
            Write-Host "Example: .\code-helper.ps1 review src/engine/auctions.ts" -ForegroundColor Yellow
        }
    }
    
    "error" {
        if ($FilePath) {
            Format-ErrorContext -Path $FilePath
        } else {
            Write-Host "❌ Please specify the file with error" -ForegroundColor Red
        }
    }
    
    "context" {
        $pattern = if ($FilePath) { $FilePath } else { "*.ts" }
        Gather-ContextFiles -Pattern $pattern
    }
    
    "feature" {
        if ($FilePath) {
            $files = $FilePath -split ','
            Prepare-FeatureFiles -Files $files
        } else {
            Write-Host "❌ Please specify files for feature" -ForegroundColor Red
            Write-Host "Example: .\code-helper.ps1 feature 'src/engine/state.ts,src/ui/App.tsx'" -ForegroundColor Yellow
        }
    }
    
    "debug" {
        # Gather common debug info
        $prompt = @"
Debug EBITDA game issue:

**Current Git Status:**
$(git status --short 2>$null)

**Recent Git Changes:**
$(git diff --stat HEAD~1 2>$null)

**TypeScript Errors:**
$(npx tsc --noEmit 2>&1 | Select-Object -First 20)

**Package.json:**
$(Get-Content "$EBITDA_DIR\ebitda-skeleton\package.json" -Raw)

What's likely causing issues and how to fix?
"@
        
        $prompt | Set-Clipboard
        Write-Host "✅ Debug context gathered and copied!" -ForegroundColor Green
    }
    
    default {
        Show-Help
    }
}