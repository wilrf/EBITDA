# Claude Power Tools - Quick Start Guide

## 🚀 What This Solves

You discovered that Claude web interface can't access your local files. These tools solve that by:
1. **Reading your actual code files**
2. **Formatting them with context**
3. **Copying to clipboard for Claude**

## 📋 Available Tools

### 1. **claude-integration.ps1** - Complete Integration Toolkit
```powershell
# Analyze a module with context
.\claude-integration.ps1 analyze engine

# Collect all errors for fixing
.\claude-integration.ps1 errors

# Performance analysis
.\claude-integration.ps1 perf

# Architecture documentation
.\claude-integration.ps1 arch

# Prepare feature implementation
.\claude-integration.ps1 feature "multiplayer"
```

### 2. **smart-context.ps1** - Intelligent Context Builder
```powershell
# Ask a question and get relevant code context
.\smart-context.ps1 "How do I optimize the auction system for performance?"

# Include tests and docs
.\smart-context.ps1 "Why are my tests failing?" -IncludeTests -IncludeDocs
```

### 3. **auto-monitor.ps1** - Real-time Error Monitor
```powershell
# Watch for errors in real-time
.\auto-monitor.ps1 -Watch -AutoCopy

# Single status check
.\auto-monitor.ps1
```

### 4. **code-helper.ps1** - Quick Code Review
```powershell
# Review a specific file
.\code-helper.ps1 review src/engine/auctions.ts

# Debug an error
.\code-helper.ps1 error src/main.tsx

# Show recent changes
.\code-helper.ps1 changes
```

## ⚡ VSCode Integration

### Keyboard Shortcuts (Already Set Up)
- **Ctrl+Alt+R** - Review current file in Claude
- **Ctrl+Alt+D** - Debug current file
- **Ctrl+Alt+C** - Show recent changes
- **Ctrl+Alt+E** - Copy TypeScript errors

### How It Works
1. Open any TypeScript file in VSCode
2. Press **Ctrl+Alt+R**
3. Code is automatically formatted and copied
4. Paste in Claude for instant review

## 🎯 Common Workflows

### Fix TypeScript Errors
```powershell
# Collect all errors
.\claude-integration.ps1 errors

# Or use auto-monitor for real-time
.\auto-monitor.ps1 -Watch -AutoCopy
```

### Implement New Feature
```powershell
# Prepare feature context
.\claude-integration.ps1 feature "achievement-system"

# Or use smart context
.\smart-context.ps1 "How do I add an achievement system?"
```

### Performance Optimization
```powershell
# Get performance analysis
.\claude-integration.ps1 perf

# Review specific module
.\claude-integration.ps1 analyze engine
```

### Code Review
```powershell
# In VSCode: Press Ctrl+Alt+R on any file
# Or from PowerShell:
.\code-helper.ps1 review src/engine/state.ts
```

## 💡 Pro Tips

### 1. Use Smart Context for Questions
Instead of copying random files, let the tool find relevant code:
```powershell
.\smart-context.ps1 "Why is the game running slowly?"
```

### 2. Monitor While Developing
Keep this running in a terminal:
```powershell
.\auto-monitor.ps1 -Watch -AutoCopy
```
It will auto-copy errors to clipboard when they appear.

### 3. Batch Operations
Review multiple related files:
```powershell
.\code-helper.ps1 feature "src/engine/state.ts,src/store/gameStore.ts"
```

### 4. Quick Error Fixes
When you get TypeScript errors:
1. Press **Ctrl+Alt+E** in VSCode
2. Paste in Claude
3. Get immediate fixes

## 🔧 Setup Verification

Test if everything works:
```powershell
# Test smart context
.\smart-context.ps1 "test question"

# Should create output in C:\Users\wilso\Downloads\EBITDA\claude-output\
# And copy to clipboard
```

## 📝 Example Claude Prompts After Using Tools

After running `.\claude-integration.ps1 errors`:
> "Please fix these TypeScript errors and explain what caused them"

After running `.\smart-context.ps1 "performance"`:
> "Based on the code context, how can I improve performance?"

After pressing Ctrl+Alt+R in VSCode:
> "Review this code for best practices and potential issues"

## 🚨 Troubleshooting

### PowerShell Execution Policy
If scripts won't run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### VSCode Tasks Not Working
1. Make sure you're in the `ebitda-skeleton` folder
2. Check `.vscode/tasks.json` exists
3. Restart VSCode

### Clipboard Not Working
- Windows: Should work automatically
- WSL: Install `clip.exe` or `xclip`
- Mac: Uses `pbcopy` (built-in)

## 🎉 You're Ready!

You now have a complete Claude integration system that:
- Reads your actual code files
- Provides intelligent context
- Monitors for errors
- Integrates with VSCode
- Makes Claude reviews instant

Start with:
```powershell
cd C:\Users\wilso\Downloads\EBITDA\claude-power\scripts
.\smart-context.ps1 "What should I work on next in the EBITDA game?"
```