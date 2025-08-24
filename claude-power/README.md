# Claude Power User Setup for EBITDA Game

This directory contains tools, templates, and workflows to maximize productivity with Claude for the EBITDA game development.

## 🚀 Quick Start

### Windows (PowerShell)
```powershell
# Load commands
. "C:\Users\wilso\Downloads\EBITDA\claude-power\scripts\claude-commands.ps1"

# Initialize Claude for EBITDA
claude init
```

### Mac/Linux (Bash)
```bash
# Load commands
source ~/Downloads/EBITDA/claude-power/scripts/claude-commands.sh

# Initialize Claude for EBITDA
claude init
```

## 📁 Directory Structure

```
claude-power/
├── prompts/          # System prompts for different modes
├── templates/        # Reusable templates for common tasks
├── workflows/        # Multi-step processes
├── scripts/          # Automation scripts
├── sessions/         # Daily session notes
└── snippets/         # Quick prompt snippets
```

## 🎮 Available Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `claude init` | Initialize EBITDA-Claude with system prompt | Start of new conversation |
| `claude morning` | Daily standup template | Start of coding session |
| `claude review` | Code review template | When you need code reviewed |
| `claude bug` | Bug investigation template | When debugging issues |
| `claude feature` | Feature planning template | Planning new features |
| `claude architect` | Architect mode prompt | System design discussions |
| `claude optimize` | Performance optimization | Make code faster |
| `claude test` | Test generation | Create comprehensive tests |
| `claude session` | Create/open session notes | Track daily progress |

## 🔧 VSCode Integration

### Install Snippets
1. Open VSCode
2. Go to `.vscode/claude.code-snippets` 
3. Snippets are auto-loaded

### Available Snippets
- `claude-arch` → Architecture request
- `claude-review` → Code review request
- `claude-optimize` → Optimization request
- `claude-test` → Test generation
- `claude-bug` → Bug fix request
- `claude-impl` → Implementation request
- `ebitda-component` → React component template
- `ebitda-engine` → Engine module template

## 📋 Templates

### Daily Standup
Use for morning check-ins with context about what you're working on.

### Feature Planning
Comprehensive template for planning new features with all considerations.

### Code Review
Structured review request with specific areas to check.

### Bug Investigation
Systematic debugging with all relevant information.

## 🔄 Workflows

### Incremental Development
Build features step-by-step:
1. Design interfaces
2. Implement core logic
3. Add error handling
4. Optimize performance
5. Generate tests
6. Integrate with system
7. Document

### Problem Solving
Systematic debugging:
1. Understand problem
2. Reproduce minimally
3. Identify root cause
4. Generate solutions
5. Implement fix
6. Verify fix
7. Prevent recurrence

## 💡 Best Practices

### 1. Start Each Session
```bash
# Run morning routine
./claude-power/scripts/morning-routine.sh

# Or manually:
claude init  # Copy system prompt
claude morning  # Get standup template
```

### 2. Context Management
- Always provide system prompt at conversation start
- Reference previous decisions
- Include relevant code context
- Specify performance requirements

### 3. Incremental Development
```
Phase 1: "Design interfaces for [feature]"
Phase 2: "Implement core logic"
Phase 3: "Add error handling"
Phase 4: "Optimize for performance"
Phase 5: "Generate tests"
```

### 4. Code Review Process
```bash
claude review  # Get template
# Paste code
# Specify concerns
# Get comprehensive review
```

## 🎯 EBITDA-Specific Prompts

### Performance Critical
```
"Optimize for 60 FPS with 10,000 entities"
```

### Determinism Required
```
"Ensure deterministic behavior from seed"
```

### Memory Conscious
```
"Minimize allocations, use object pools"
```

### Type Safety
```
"Full TypeScript types, no 'any'"
```

## 📊 Tracking Progress

### Session Files
Daily session files track:
- Decisions made
- Problems solved
- Code written
- Performance metrics

### Git Integration
```bash
# After each session
git add .
git commit -m "Session $(date +%Y-%m-%d): [what you did]"
```

## 🚨 Troubleshooting

### Clipboard Not Working
- Windows: Uses `clip.exe`
- Mac: Uses `pbcopy`
- Linux: Install `xclip`

### Commands Not Found
```bash
# Reload the script
source ~/Downloads/EBITDA/claude-power/scripts/claude-commands.sh
```

### PowerShell Execution Policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🔥 Power User Tips

1. **Chain Commands**: 
   ```bash
   claude init && claude feature
   ```

2. **Custom Aliases**:
   ```bash
   alias ebitda-claude='claude init'
   alias ebitda-review='claude review'
   ```

3. **Quick Context**:
   ```
   "Continuing from yesterday where we [WHAT YOU DID]"
   ```

4. **Batch Operations**:
   ```
   "Review all these files for performance issues: [LIST]"
   ```

5. **Learning Mode**:
   ```
   "Explain your reasoning as you implement"
   ```

## 📈 Measure Improvement

Track your productivity:
- Lines of code reviewed
- Bugs fixed faster
- Features implemented
- Performance improvements

## 🎮 Ready to Code!

1. Run `claude init` to initialize
2. Use templates for structured requests
3. Follow workflows for complex tasks
4. Track progress in session files
5. Build an amazing PE simulation game!

---
*Remember: The goal is to build a high-performance, deterministic PE simulation that runs at 60 FPS in the browser. Every prompt should consider these constraints.*