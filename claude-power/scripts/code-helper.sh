#!/bin/bash
# Bash script for ACTUAL code review workflow
# This prepares your code for pasting into Claude

EBITDA_DIR="$HOME/Downloads/EBITDA"
SKELETON_DIR="$EBITDA_DIR/ebitda-skeleton"

show_help() {
    cat << EOF
🎮 EBITDA Code Helper - Prepare code for Claude review

USAGE:
    ./code-helper.sh review [file]     - Prepare file for review
    ./code-helper.sh context [pattern] - Gather context files  
    ./code-helper.sh error [file]      - Include file with error context
    ./code-helper.sh feature [files]   - Prepare multiple files for feature work
    ./code-helper.sh debug             - Gather debug context
    ./code-helper.sh changes           - Show recent changes for review

EXAMPLES:
    ./code-helper.sh review src/engine/auctions.ts
    ./code-helper.sh context "*.ts"
    ./code-helper.sh error src/main.tsx
    ./code-helper.sh changes

This script:
1. Reads your actual code files
2. Formats them with context
3. Copies to clipboard ready for Claude
EOF
}

format_code_for_review() {
    local file=$1
    
    if [ ! -f "$file" ]; then
        echo "❌ File not found: $file"
        return 1
    fi
    
    local filename=$(basename "$file")
    local lines=$(wc -l < "$file")
    local content=$(cat "$file")
    
    local prompt="Review this EBITDA game code for performance, memory leaks, and best practices:

**File:** \`$filename\`
**Path:** \`$file\`
**Lines:** $lines
**Context:** Part of PE simulation game, must maintain 60 FPS with 10k entities

\`\`\`typescript
$content
\`\`\`

Please check for:
1. Performance bottlenecks
2. Memory leaks
3. Determinism issues
4. Type safety problems
5. Best practice violations

Provide specific line numbers for any issues found."
    
    echo "$prompt" | pbcopy 2>/dev/null || xclip -selection clipboard 2>/dev/null || clip.exe 2>/dev/null
    
    echo "✅ Code review prepared and copied to clipboard!"
    echo "📋 File: $filename ($lines lines)"
    echo "🚀 Paste into Claude to get review"
}

format_error_context() {
    local file=$1
    
    if [ ! -f "$file" ]; then
        echo "❌ File not found: $file"
        return 1
    fi
    
    local filename=$(basename "$file")
    local content=$(cat "$file")
    
    # Get recent TypeScript errors
    local ts_errors=$(cd "$SKELETON_DIR" && npx tsc --noEmit 2>&1 | head -20)
    
    local prompt="Debug this EBITDA game error:

**File with error:** \`$filename\`
**Path:** \`$file\`

\`\`\`typescript
$content
\`\`\`

**TypeScript Errors:**
\`\`\`
$ts_errors
\`\`\`

Find the root cause and provide a fix."
    
    echo "$prompt" | pbcopy 2>/dev/null || xclip -selection clipboard 2>/dev/null || clip.exe 2>/dev/null
    
    echo "✅ Error context prepared and copied!"
    echo "🐛 Paste into Claude for debugging help"
}

gather_context_files() {
    local pattern=${1:-"*.ts"}
    local prompt="Review these related EBITDA game files for context:

"
    
    # Find up to 5 matching files
    local files=$(find "$SKELETON_DIR/src" -name "$pattern" -type f | head -5)
    
    for file in $files; do
        local relative_path=${file#$SKELETON_DIR/}
        local content=$(cat "$file")
        
        prompt+="**File:** \`$relative_path\`
\`\`\`typescript
$content
\`\`\`

"
    done
    
    prompt+="
Analyze the overall architecture and identify improvements."
    
    echo "$prompt" | pbcopy 2>/dev/null || xclip -selection clipboard 2>/dev/null || clip.exe 2>/dev/null
    
    echo "✅ Context files gathered and copied!"
    echo "📁 Included files matching: $pattern"
}

show_recent_changes() {
    cd "$SKELETON_DIR" || return
    
    local prompt="Review these recent changes to the EBITDA game:

**Git Status:**
\`\`\`
$(git status --short)
\`\`\`

**Recent Commits:**
\`\`\`
$(git log --oneline -5)
\`\`\`

**Changes in last commit:**
\`\`\`diff
$(git diff HEAD~1)
\`\`\`

**Unstaged changes:**
\`\`\`diff
$(git diff)
\`\`\`

Review for:
1. Best practices
2. Performance impact
3. Potential bugs
4. Suggestions for improvement"
    
    echo "$prompt" | pbcopy 2>/dev/null || xclip -selection clipboard 2>/dev/null || clip.exe 2>/dev/null
    
    echo "✅ Recent changes prepared and copied!"
    echo "📝 Paste into Claude for code review"
}

gather_debug_context() {
    cd "$SKELETON_DIR" || return
    
    local prompt="Debug EBITDA game issue:

**Current Git Status:**
\`\`\`
$(git status --short)
\`\`\`

**TypeScript Errors:**
\`\`\`
$(npx tsc --noEmit 2>&1 | head -30)
\`\`\`

**Package.json:**
\`\`\`json
$(cat package.json)
\`\`\`

**Recent Error Logs:**
\`\`\`
$(tail -50 npm-debug.log 2>/dev/null || echo "No npm debug log")
\`\`\`

What's likely causing issues and how to fix?"
    
    echo "$prompt" | pbcopy 2>/dev/null || xclip -selection clipboard 2>/dev/null || clip.exe 2>/dev/null
    
    echo "✅ Debug context gathered and copied!"
    echo "🔍 Paste into Claude for debugging help"
}

# Main command handler
case "$1" in
    review)
        if [ -n "$2" ]; then
            format_code_for_review "$2"
        else
            echo "❌ Please specify a file to review"
            echo "Example: ./code-helper.sh review src/engine/auctions.ts"
        fi
        ;;
    
    error)
        if [ -n "$2" ]; then
            format_error_context "$2"
        else
            echo "❌ Please specify the file with error"
        fi
        ;;
    
    context)
        gather_context_files "${2:-*.ts}"
        ;;
    
    changes)
        show_recent_changes
        ;;
    
    debug)
        gather_debug_context
        ;;
    
    feature)
        if [ -n "$2" ]; then
            # Handle comma-separated files
            IFS=',' read -ra FILES <<< "$2"
            prompt="Help implement a new feature across these EBITDA game files:

"
            for file in "${FILES[@]}"; do
                if [ -f "$file" ]; then
                    filename=$(basename "$file")
                    content=$(cat "$file")
                    prompt+="**File:** \`$filename\`
\`\`\`typescript
$content
\`\`\`

"
                fi
            done
            
            prompt+="Requirements:
- Maintain 60 FPS performance
- Ensure deterministic behavior
- Follow existing patterns
- Add proper TypeScript types

Provide implementation code for the feature."
            
            echo "$prompt" | pbcopy 2>/dev/null || xclip -selection clipboard 2>/dev/null || clip.exe 2>/dev/null
            echo "✅ Feature files prepared and copied!"
        else
            echo "❌ Please specify files for feature"
            echo "Example: ./code-helper.sh feature 'src/engine/state.ts,src/ui/App.tsx'"
        fi
        ;;
    
    *)
        show_help
        ;;
esac