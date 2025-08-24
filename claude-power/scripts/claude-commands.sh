#!/bin/bash
# Claude Command Shortcuts for EBITDA Project
# Add to ~/.bashrc or ~/.zshrc: source ~/Downloads/EBITDA/claude-power/scripts/claude-commands.sh

CLAUDE_DIR="$HOME/Downloads/EBITDA/claude-power"

# Main claude command
claude() {
    case "$1" in
        morning|standup)
            echo "📅 Copying morning standup template..."
            cat "$CLAUDE_DIR/templates/daily-standup.md" | clip.exe 2>/dev/null || pbcopy 2>/dev/null || xclip -selection clipboard
            echo "✅ Template copied! Fill in the bracketed sections."
            ;;
            
        review)
            echo "🔍 Copying code review template..."
            cat "$CLAUDE_DIR/templates/code-review.md" | clip.exe 2>/dev/null || pbcopy 2>/dev/null || xclip -selection clipboard
            echo "✅ Template copied! Paste your code in the designated section."
            ;;
            
        bug)
            echo "🐛 Copying bug investigation template..."
            cat "$CLAUDE_DIR/templates/bug-investigation.md" | clip.exe 2>/dev/null || pbcopy 2>/dev/null || xclip -selection clipboard
            echo "✅ Template copied! Fill in the bug details."
            ;;
            
        feature)
            echo "✨ Copying feature planning template..."
            cat "$CLAUDE_DIR/templates/feature-planning.md" | clip.exe 2>/dev/null || pbcopy 2>/dev/null || xclip -selection clipboard
            echo "✅ Template copied! Define your feature requirements."
            ;;
            
        architect)
            echo "🏗️ Copying architect system prompt..."
            cat "$CLAUDE_DIR/prompts/system-prompt-architect.md" | clip.exe 2>/dev/null || pbcopy 2>/dev/null || xclip -selection clipboard
            echo "✅ Architect mode prompt copied! Paste at conversation start."
            ;;
            
        init)
            echo "🚀 Copying main EBITDA system prompt..."
            cat "$CLAUDE_DIR/prompts/system-prompt-main.md" | clip.exe 2>/dev/null || pbcopy 2>/dev/null || xclip -selection clipboard
            echo "✅ EBITDA-Claude prompt copied! Paste at conversation start."
            ;;
            
        incremental)
            echo "📈 Copying incremental development workflow..."
            cat "$CLAUDE_DIR/workflows/incremental-development.md" | clip.exe 2>/dev/null || pbcopy 2>/dev/null || xclip -selection clipboard
            echo "✅ Incremental workflow copied! Follow the phases."
            ;;
            
        optimize)
            echo "⚡ Preparing optimization request..."
            echo "Optimize this EBITDA game code for performance while maintaining determinism and 60 FPS:" | clip.exe 2>/dev/null || pbcopy 2>/dev/null || xclip -selection clipboard
            echo "✅ Optimization prompt copied! Paste your code after it."
            ;;
            
        test)
            echo "🧪 Preparing test generation request..."
            echo "Generate comprehensive tests for this EBITDA game code, including unit tests, edge cases, and determinism verification:" | clip.exe 2>/dev/null || pbcopy 2>/dev/null || xclip -selection clipboard
            echo "✅ Test prompt copied! Paste your code after it."
            ;;
            
        session)
            # Create a new session file
            DATE=$(date +%Y-%m-%d)
            SESSION_FILE="$CLAUDE_DIR/sessions/session-$DATE.md"
            if [ ! -f "$SESSION_FILE" ]; then
                echo "# Session $DATE" > "$SESSION_FILE"
                echo "## Context" >> "$SESSION_FILE"
                echo "- Project: EBITDA PE Game" >> "$SESSION_FILE"
                echo "- Focus: [TODAY'S FOCUS]" >> "$SESSION_FILE"
                echo "" >> "$SESSION_FILE"
                echo "## Decisions Made" >> "$SESSION_FILE"
                echo "- " >> "$SESSION_FILE"
                echo "" >> "$SESSION_FILE"
                echo "## Questions" >> "$SESSION_FILE"
                echo "1. " >> "$SESSION_FILE"
            fi
            echo "📝 Created/opened session file: $SESSION_FILE"
            ;;
            
        help)
            echo "🎮 EBITDA Claude Commands:"
            echo "  claude init       - Copy main system prompt"
            echo "  claude morning    - Copy daily standup template"
            echo "  claude review     - Copy code review template"
            echo "  claude bug        - Copy bug investigation template"
            echo "  claude feature    - Copy feature planning template"
            echo "  claude architect  - Copy architect mode prompt"
            echo "  claude incremental- Copy incremental workflow"
            echo "  claude optimize   - Quick optimization prompt"
            echo "  claude test       - Quick test generation prompt"
            echo "  claude session    - Create/open today's session"
            echo "  claude help       - Show this help"
            ;;
            
        *)
            echo "❓ Unknown command. Use 'claude help' for available commands."
            ;;
    esac
}

# Quick aliases
alias claude-init='claude init'
alias claude-morning='claude morning'
alias claude-review='claude review'
alias claude-bug='claude bug'

echo "🎮 EBITDA Claude commands loaded! Type 'claude help' for available commands."