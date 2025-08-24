# 🚀 EBITDA Development Toolkit

## Quick Start

### Method 1: Interactive Menu (Recommended)
Double-click `run-toolkit.bat` or run:
```powershell
.\EBITDA-Toolkit.ps1
```

### Method 2: Quick Commands
Load the commands in PowerShell:
```powershell
. .\quick-commands.ps1
```

Then use commands like:
```powershell
ebitda-context "How do I optimize performance?"
ebitda-errors
ebitda-review src/engine/auctions.ts
```

### Method 3: Direct Script Execution
```powershell
# Run from toolkit folder - scripts auto-detect paths
.\EBITDA-Toolkit.ps1
```

## 🎯 What This Toolkit Does

This toolkit solves the problem that Claude can't access your local files by:
1. **Reading** your actual code files
2. **Analyzing** and formatting them with context
3. **Copying** to clipboard for immediate use in Claude

## 📋 Features

### Interactive Menu System
- **Code Review & Analysis** - Review files, analyze modules, build smart context
- **Error Management** - Collect errors, monitor in real-time, get quick fixes
- **Performance & Architecture** - Analyze performance, view architecture, check bundle size
- **Feature Development** - Prepare feature context, refactoring helper, test assistant
- **Utilities** - Show changes, git status, manage outputs

### Smart Context Builder
Automatically finds relevant code based on your question:
```powershell
ebitda-context "Why is the auction system slow?"
```

### Real-time Error Monitor
Watches for TypeScript errors and auto-copies to clipboard:
```powershell
ebitda-monitor
```

### Quick Commands Reference
| Command | Shortcut | Description |
|---------|----------|-------------|
| `ebitda-review [file]` | `er` | Review a specific file |
| `ebitda-errors` | `ee` | Collect all TypeScript errors |
| `ebitda-context [query]` | `ec` | Build smart context for question |
| `ebitda-monitor` | `em` | Start error monitoring |
| `ebitda-perf` | `ep` | Analyze performance |
| `ebitda-changes` | `eg` | Show recent git changes |
| `ebitda-fix` | `ef` | Quick fix mode |
| `ebitda-feature [name]` | `et` | Prepare feature context |

## 🔧 Installation

The toolkit is already installed! Just navigate to the toolkit folder:
```powershell
cd C:\Users\wilso\Downloads\EBITDA\toolkit
```

### Add to PowerShell Profile (Optional)
To use quick commands from anywhere:
```powershell
# Add this line to your PowerShell profile
. "C:\Users\wilso\Downloads\EBITDA\toolkit\quick-commands.ps1"
```

## 📁 Folder Structure
```
toolkit/
├── run-toolkit.bat           # Double-click to start
├── EBITDA-Toolkit.ps1       # Main interactive menu
├── quick-commands.ps1       # Standalone commands
└── README.md               # This file
```

## 💡 Usage Examples

### Example 1: Fix TypeScript Errors
```powershell
# Method 1: Interactive
.\EBITDA-Toolkit.ps1
# Choose option 4

# Method 2: Quick command
ebitda-errors
```

### Example 2: Get Help with Performance
```powershell
# Method 1: Smart context
ebitda-context "How can I improve FPS in the game loop?"

# Method 2: Full performance analysis
ebitda-perf
```

### Example 3: Review Code Before Commit
```powershell
# Show all recent changes
ebitda-changes

# Review specific file
ebitda-review src/engine/state.ts
```

## 🎮 Pro Tips

1. **Keep Monitor Running**: Start `ebitda-monitor` in a separate terminal while coding
2. **Use Smart Context**: Instead of copying random files, use `ebitda-context` with your question
3. **Quick Shortcuts**: After loading quick-commands.ps1, use `ec`, `ee`, `er` for speed
4. **Batch Review**: The toolkit saves all outputs to `claude-output/` for later reference

## 🚨 Troubleshooting

### PowerShell Execution Policy
If you get execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Scripts Not Found
The toolkit auto-detects paths. If scripts aren't found, ensure folder structure:
```
EBITDA/
├── toolkit/              # This toolkit
├── claude-power/         # Power scripts
│   └── scripts/
└── ebitda-skeleton/      # Your project
```

### Clipboard Not Working
- Windows: Should work automatically
- WSL: May need `clip.exe`
- Alternative: Check `claude-output/` folder for saved files

## 🔄 Updates

The toolkit references scripts in `claude-power/scripts/`. To update functionality, modify those scripts directly.

## 📞 Support

Having issues? Try:
1. Run option 21 (Test Claude Connection) from the menu
2. Check that all paths exist with option 20 (Configure Paths)
3. Look in `claude-output/` folder for saved outputs

## 🎉 Ready to Code!

Start the toolkit:
```powershell
.\run-toolkit.bat
```

Or load quick commands:
```powershell
. .\quick-commands.ps1
ebitda-help
```

Happy coding with Claude! 🚀