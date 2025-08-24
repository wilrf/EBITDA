# Quick Commands - Standalone functions that can be run directly
# Source this file in PowerShell: . .\quick-commands.ps1

$Global:TOOLKIT_DIR = $PSScriptRoot
$Global:EBITDA_DIR = (Get-Item $TOOLKIT_DIR).Parent.FullName
$Global:SKELETON_DIR = "$EBITDA_DIR\ebitda-skeleton"
$Global:SCRIPTS_DIR = "$EBITDA_DIR\claude-power\scripts"

function ebitda-help {
    Write-Host @"
    
EBITDA Quick Commands:
======================

ebitda-review [file]     - Review a file with Claude
ebitda-errors           - Collect all TypeScript errors
ebitda-context [query]  - Build smart context for a question
ebitda-monitor          - Start error monitoring
ebitda-perf            - Analyze performance
ebitda-changes         - Show recent git changes
ebitda-fix             - Quick fix mode for errors
ebitda-feature [name]  - Prepare feature context

Examples:
  ebitda-review src/engine/auctions.ts
  ebitda-context "How do I optimize performance?"
  ebitda-feature multiplayer

"@ -ForegroundColor Cyan
}

function ebitda-review {
    param([string]$File)
    
    if (-not $File) {
        Write-Host "Usage: ebitda-review [file-path]" -ForegroundColor Yellow
        Write-Host "Example: ebitda-review src/engine/auctions.ts" -ForegroundColor Gray
        return
    }
    
    $fullPath = if ([System.IO.Path]::IsPathRooted($File)) {
        $File
    } else {
        Join-Path $SKELETON_DIR $File
    }
    
    if (Test-Path $fullPath) {
        & "$SCRIPTS_DIR\code-helper.ps1" review $fullPath
        Write-Host "✅ Review copied to clipboard!" -ForegroundColor Green
    } else {
        Write-Host "❌ File not found: $fullPath" -ForegroundColor Red
    }
}

function ebitda-errors {
    Write-Host "🐛 Collecting errors..." -ForegroundColor Yellow
    & "$SCRIPTS_DIR\claude-integration.ps1" errors
    Write-Host "✅ Errors copied to clipboard!" -ForegroundColor Green
}

function ebitda-context {
    param([string]$Question)
    
    if (-not $Question) {
        Write-Host "Usage: ebitda-context ""your question here""" -ForegroundColor Yellow
        Write-Host "Example: ebitda-context ""How do I add multiplayer?""" -ForegroundColor Gray
        return
    }
    
    & "$SCRIPTS_DIR\smart-context.ps1" $Question
    Write-Host "✅ Context copied to clipboard!" -ForegroundColor Green
}

function ebitda-monitor {
    Write-Host "👁️ Starting monitor (Ctrl+C to stop)..." -ForegroundColor Yellow
    & "$SCRIPTS_DIR\auto-monitor.ps1" -Watch -AutoCopy
}

function ebitda-perf {
    Write-Host "⚡ Analyzing performance..." -ForegroundColor Yellow
    & "$SCRIPTS_DIR\claude-integration.ps1" perf
    Write-Host "✅ Performance analysis copied!" -ForegroundColor Green
}

function ebitda-changes {
    Write-Host "📝 Getting recent changes..." -ForegroundColor Yellow
    & "$SCRIPTS_DIR\code-helper.ps1" changes
    Write-Host "✅ Changes copied to clipboard!" -ForegroundColor Green
}

function ebitda-fix {
    Write-Host "🔧 Starting quick fix mode..." -ForegroundColor Yellow
    & "$SCRIPTS_DIR\auto-monitor.ps1"
}

function ebitda-feature {
    param([string]$Name)
    
    if (-not $Name) {
        Write-Host "Usage: ebitda-feature [feature-name]" -ForegroundColor Yellow
        Write-Host "Example: ebitda-feature achievements" -ForegroundColor Gray
        return
    }
    
    & "$SCRIPTS_DIR\claude-integration.ps1" feature $Name
    Write-Host "✅ Feature context copied!" -ForegroundColor Green
}

# Shorthand aliases
Set-Alias -Name er -Value ebitda-review
Set-Alias -Name ee -Value ebitda-errors
Set-Alias -Name ec -Value ebitda-context
Set-Alias -Name em -Value ebitda-monitor
Set-Alias -Name ep -Value ebitda-perf
Set-Alias -Name eg -Value ebitda-changes
Set-Alias -Name ef -Value ebitda-fix
Set-Alias -Name et -Value ebitda-feature

Write-Host @"

✅ EBITDA Quick Commands Loaded!

Type 'ebitda-help' for all commands
Or use shortcuts: er, ee, ec, em, ep, eg, ef, et

Example: ec "How do I fix performance issues?"

"@ -ForegroundColor Green