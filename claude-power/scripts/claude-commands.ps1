# PowerShell Claude Commands for EBITDA Project
# Add to PowerShell profile: . "C:\Users\wilso\Downloads\EBITDA\claude-power\scripts\claude-commands.ps1"

$CLAUDE_DIR = "C:\Users\wilso\Downloads\EBITDA\claude-power"

function claude {
    param(
        [string]$Command,
        [string]$Context
    )
    
    switch ($Command) {
        "morning" {
            Write-Host "📅 Copying morning standup template..." -ForegroundColor Cyan
            Get-Content "$CLAUDE_DIR\templates\daily-standup.md" | Set-Clipboard
            Write-Host "✅ Template copied! Fill in the bracketed sections." -ForegroundColor Green
        }
        
        "standup" {
            claude morning
        }
        
        "review" {
            Write-Host "🔍 Copying code review template..." -ForegroundColor Cyan
            Get-Content "$CLAUDE_DIR\templates\code-review.md" | Set-Clipboard
            Write-Host "✅ Template copied! Paste your code in the designated section." -ForegroundColor Green
        }
        
        "bug" {
            Write-Host "🐛 Copying bug investigation template..." -ForegroundColor Cyan
            Get-Content "$CLAUDE_DIR\templates\bug-investigation.md" | Set-Clipboard
            Write-Host "✅ Template copied! Fill in the bug details." -ForegroundColor Green
        }
        
        "feature" {
            Write-Host "✨ Copying feature planning template..." -ForegroundColor Cyan
            Get-Content "$CLAUDE_DIR\templates\feature-planning.md" | Set-Clipboard
            Write-Host "✅ Template copied! Define your feature requirements." -ForegroundColor Green
        }
        
        "architect" {
            Write-Host "🏗️ Copying architect system prompt..." -ForegroundColor Cyan
            Get-Content "$CLAUDE_DIR\prompts\system-prompt-architect.md" | Set-Clipboard
            Write-Host "✅ Architect mode prompt copied! Paste at conversation start." -ForegroundColor Green
        }
        
        "init" {
            Write-Host "🚀 Copying main EBITDA system prompt..." -ForegroundColor Cyan
            Get-Content "$CLAUDE_DIR\prompts\system-prompt-main.md" | Set-Clipboard
            Write-Host "✅ EBITDA-Claude prompt copied! Paste at conversation start." -ForegroundColor Green
        }
        
        "incremental" {
            Write-Host "📈 Copying incremental development workflow..." -ForegroundColor Cyan
            Get-Content "$CLAUDE_DIR\workflows\incremental-development.md" | Set-Clipboard
            Write-Host "✅ Incremental workflow copied! Follow the phases." -ForegroundColor Green
        }
        
        "optimize" {
            Write-Host "⚡ Preparing optimization request..." -ForegroundColor Cyan
            "Optimize this EBITDA game code for performance while maintaining determinism and 60 FPS:" | Set-Clipboard
            Write-Host "✅ Optimization prompt copied! Paste your code after it." -ForegroundColor Green
        }
        
        "test" {
            Write-Host "🧪 Preparing test generation request..." -ForegroundColor Cyan
            "Generate comprehensive tests for this EBITDA game code, including unit tests, edge cases, and determinism verification:" | Set-Clipboard
            Write-Host "✅ Test prompt copied! Paste your code after it." -ForegroundColor Green
        }
        
        "session" {
            $Date = Get-Date -Format "yyyy-MM-dd"
            $SessionFile = "$CLAUDE_DIR\sessions\session-$Date.md"
            
            if (-not (Test-Path $SessionFile)) {
                @"
# Session $Date

## Context
- Project: EBITDA PE Game
- Focus: [TODAY'S FOCUS]

## Decisions Made
- 

## Questions
1. 
"@ | Out-File -FilePath $SessionFile -Encoding UTF8
            }
            
            Write-Host "📝 Created/opened session file: $SessionFile" -ForegroundColor Green
            notepad $SessionFile
        }
        
        "help" {
            Write-Host @"
🎮 EBITDA Claude Commands:
  claude init       - Copy main system prompt
  claude morning    - Copy daily standup template
  claude review     - Copy code review template
  claude bug        - Copy bug investigation template
  claude feature    - Copy feature planning template
  claude architect  - Copy architect mode prompt
  claude incremental- Copy incremental workflow
  claude optimize   - Quick optimization prompt
  claude test       - Quick test generation prompt
  claude session    - Create/open today's session
  claude help       - Show this help
"@ -ForegroundColor Cyan
        }
        
        default {
            Write-Host "❓ Unknown command. Use 'claude help' for available commands." -ForegroundColor Yellow
        }
    }
}

# Quick aliases
function claude-init { claude init }
function claude-morning { claude morning }
function claude-review { claude review }
function claude-bug { claude bug }

Write-Host "🎮 EBITDA Claude commands loaded! Type 'claude help' for available commands." -ForegroundColor Green