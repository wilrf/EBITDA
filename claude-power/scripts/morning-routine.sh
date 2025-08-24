#!/bin/bash
# EBITDA Morning Development Routine
# Run this at the start of each coding session

EBITDA_DIR="$HOME/Downloads/EBITDA"
CLAUDE_DIR="$EBITDA_DIR/claude-power"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)

echo "🌅 EBITDA Morning Routine - $DATE $TIME"
echo "======================================="

# 1. Check git status
echo -e "\n📊 Git Status:"
cd "$EBITDA_DIR/ebitda-skeleton" 2>/dev/null && git status --short || echo "Not in git repo"

# 2. Check for TypeScript errors
echo -e "\n🔍 TypeScript Check:"
cd "$EBITDA_DIR/ebitda-skeleton" 2>/dev/null && npx tsc --noEmit 2>&1 | head -5 || echo "Run from project directory"

# 3. Create session file
SESSION_FILE="$CLAUDE_DIR/sessions/session-$DATE.md"
if [ ! -f "$SESSION_FILE" ]; then
    cat > "$SESSION_FILE" << EOF
# Development Session - $DATE

## Morning Status
- Time: $TIME
- Branch: $(cd "$EBITDA_DIR/ebitda-skeleton" && git branch --show-current 2>/dev/null || echo "main")
- Last commit: $(cd "$EBITDA_DIR/ebitda-skeleton" && git log -1 --oneline 2>/dev/null || echo "No commits")

## Today's Goals
1. [ ] 
2. [ ] 
3. [ ] 

## Context for Claude
- Working on: [COMPONENT]
- Previous decisions: [DECISIONS]
- Blockers: [BLOCKERS]

## Questions
1. 

## Notes

EOF
    echo "✅ Created session file: $SESSION_FILE"
else
    echo "📝 Session file exists: $SESSION_FILE"
fi

# 4. Copy system prompt to clipboard
echo -e "\n📋 Copying EBITDA system prompt to clipboard..."
cat "$CLAUDE_DIR/prompts/system-prompt-main.md" | clip.exe 2>/dev/null || pbcopy 2>/dev/null || xclip -selection clipboard

# 5. Show helpful commands
echo -e "\n🎮 Quick Commands:"
echo "  claude morning  - Daily standup template"
echo "  claude review   - Code review template"
echo "  claude bug      - Bug investigation"
echo "  claude feature  - Feature planning"
echo "  npm run dev     - Start dev server"

# 6. Check if dev server is running
echo -e "\n🖥️ Dev Server Status:"
if lsof -i:5173 > /dev/null 2>&1; then
    echo "✅ Dev server is running on http://localhost:5173"
else
    echo "❌ Dev server not running. Start with: npm run dev"
fi

# 7. Show recent TODOs if any
echo -e "\n📝 Recent TODOs:"
grep -r "TODO\|FIXME" "$EBITDA_DIR/ebitda-skeleton/src" 2>/dev/null | head -3 || echo "No TODOs found"

echo -e "\n✨ Ready to code! System prompt copied to clipboard."
echo "🚀 Start Claude and paste the prompt to initialize EBITDA-Claude."