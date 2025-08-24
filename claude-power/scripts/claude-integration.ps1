# Advanced Claude Integration Script
# This is the REAL solution - prepares your entire codebase for Claude analysis

param(
    [Parameter(Position=0)]
    [string]$Mode = "help",
    
    [Parameter(Position=1)]
    [string]$Target = "",
    
    [switch]$Verbose,
    [switch]$IncludeTests,
    [switch]$IncludeConfigs
)

$EBITDA_DIR = "C:\Users\wilso\Downloads\EBITDA"
$SKELETON_DIR = "$EBITDA_DIR\ebitda-skeleton"
$OUTPUT_DIR = "$EBITDA_DIR\claude-output"

# Create output directory if needed
if (-not (Test-Path $OUTPUT_DIR)) {
    New-Item -ItemType Directory -Path $OUTPUT_DIR | Out-Null
}

function Show-Help {
    Write-Host @"
🚀 Claude Integration Toolkit - Maximum productivity with Claude

MODES:
    analyze    - Deep code analysis with context
    errors     - Collect all errors and prepare for Claude
    perf       - Performance analysis preparation
    arch       - Architecture documentation for Claude
    feature    - Prepare feature implementation context
    refactor   - Prepare refactoring context
    test       - Prepare test writing context
    deploy     - Prepare deployment review
    
USAGE:
    .\claude-integration.ps1 analyze [module]    # Deep dive into a module
    .\claude-integration.ps1 errors              # Collect all current errors
    .\claude-integration.ps1 perf                # Performance analysis
    .\claude-integration.ps1 arch                # Architecture overview
    .\claude-integration.ps1 feature [name]      # New feature context
    
OPTIONS:
    -Verbose         Show detailed progress
    -IncludeTests    Include test files in analysis
    -IncludeConfigs  Include configuration files

EXAMPLES:
    .\claude-integration.ps1 analyze engine
    .\claude-integration.ps1 errors -Verbose
    .\claude-integration.ps1 feature "multiplayer" -IncludeConfigs
    
OUTPUT:
    All outputs are saved to: $OUTPUT_DIR
    And copied to clipboard for immediate use

"@ -ForegroundColor Cyan
}

function Analyze-Module {
    param([string]$Module)
    
    Write-Host "🔍 Analyzing module: $Module" -ForegroundColor Green
    
    $modulePath = if ($Module) {
        "$SKELETON_DIR\src\$Module"
    } else {
        "$SKELETON_DIR\src"
    }
    
    if (-not (Test-Path $modulePath)) {
        Write-Host "❌ Module not found: $modulePath" -ForegroundColor Red
        return
    }
    
    # Gather all TypeScript files
    $files = Get-ChildItem -Path $modulePath -Filter "*.ts" -Recurse | Where-Object {
        $include = $true
        if (-not $IncludeTests -and $_.Name -match "\.test\.|\.spec\.") {
            $include = $false
        }
        $include
    }
    
    $analysis = @"
# EBITDA Game - Module Analysis: $Module

## Module Overview
- **Path**: $modulePath
- **Files**: $($files.Count) TypeScript files
- **Total Lines**: $(($files | ForEach-Object { (Get-Content $_.FullName).Count } | Measure-Object -Sum).Sum)

## File Structure
$($files | ForEach-Object {
    $relative = $_.FullName.Replace($SKELETON_DIR, "").Replace("\", "/")
    $lines = (Get-Content $_.FullName).Count
    "- $relative ($lines lines)"
} | Out-String)

## Dependencies Graph
"@

    # Analyze imports
    $imports = @{}
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw
        $relative = $file.FullName.Replace($SKELETON_DIR, "").Replace("\", "/")
        
        # Find all imports
        $pattern = "import .* from ['""]([^'""]+)['""]"
        $matches = [regex]::Matches($content, $pattern)
        
        $fileImports = @()
        foreach ($match in $matches) {
            $importPath = $match.Groups[1].Value
            if (-not $importPath.StartsWith(".")) {
                $fileImports += "external:$importPath"
            } else {
                $fileImports += $importPath
            }
        }
        
        if ($fileImports.Count -gt 0) {
            $imports[$relative] = $fileImports
        }
    }
    
    $analysis += @"

### Import Dependencies
$($imports.GetEnumerator() | ForEach-Object {
    "`n**$($_.Key)**"
    $_.Value | ForEach-Object { "  - $_" }
} | Out-String)

## Key Files Content

"@
    
    # Include key files content
    $keyFiles = $files | Select-Object -First 5
    foreach ($file in $keyFiles) {
        $content = Get-Content $file.FullName -Raw
        $relative = $file.FullName.Replace($SKELETON_DIR, "").Replace("\", "/")
        
        $analysis += @"
### File: $relative
``````typescript
$content
``````

"@
    }
    
    # Performance considerations
    $analysis += @"
## Performance Considerations

### Potential Bottlenecks
$(foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $relative = $file.FullName.Replace($SKELETON_DIR, "").Replace("\", "/")
    
    # Check for performance issues
    $issues = @()
    if ($content -match "\.forEach\(") {
        $issues += "Uses forEach loops (consider for...of)"
    }
    if ($content -match "JSON\.parse|JSON\.stringify") {
        $issues += "JSON serialization found"
    }
    if ($content -match "new Array\(|Array\.from") {
        $issues += "Array allocation patterns"
    }
    if ($content -match "setTimeout|setInterval") {
        $issues += "Timer usage detected"
    }
    
    if ($issues.Count -gt 0) {
        "`n**$relative**"
        $issues | ForEach-Object { "  - $_" }
    }
} | Out-String)

## Refactoring Opportunities

Based on the analysis, consider:
1. Consolidating similar functionality
2. Extracting shared utilities
3. Optimizing data structures
4. Implementing caching where appropriate

## Questions for Implementation

1. What is the main purpose of this module?
2. What are the performance requirements?
3. Are there any known issues to address?
4. What features need to be added?

"@
    
    # Save to file
    $outputFile = "$OUTPUT_DIR\analysis-$(Get-Date -Format 'yyyyMMdd-HHmmss').md"
    $analysis | Out-File -FilePath $outputFile -Encoding UTF8
    
    # Copy to clipboard
    $analysis | Set-Clipboard
    
    Write-Host "✅ Analysis complete!" -ForegroundColor Green
    Write-Host "📁 Saved to: $outputFile" -ForegroundColor Yellow
    Write-Host "📋 Copied to clipboard - paste in Claude" -ForegroundColor Cyan
}

function Collect-Errors {
    Write-Host "🐛 Collecting all errors..." -ForegroundColor Green
    
    Push-Location $SKELETON_DIR
    
    $errorReport = @"
# EBITDA Game - Error Report

Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## TypeScript Compilation Errors

``````
$(npx tsc --noEmit 2>&1 | Out-String)
``````

## ESLint Issues

``````
$(npx eslint src --ext .ts,.tsx 2>&1 | Select-Object -First 100 | Out-String)
``````

## Build Errors

``````
$(npm run build 2>&1 | Select-Object -Last 50 | Out-String)
``````

## Runtime Console Errors
Check browser console for:
- Performance warnings
- React errors
- Network failures

## Git Status

``````
$(git status --short | Out-String)
``````

## Recent Changes That May Have Caused Issues

``````diff
$(git diff HEAD~1 --stat | Out-String)
``````

## Diagnostic Information

### Package Versions
``````json
$(Get-Content package.json | ConvertFrom-Json | Select-Object -ExpandProperty dependencies | ConvertTo-Json)
``````

### TypeScript Config
``````json
$(Get-Content tsconfig.json -Raw)
``````

## Priority Issues to Fix

1. Type errors preventing compilation
2. Import resolution failures  
3. Undefined variable references
4. React hook violations
5. Performance bottlenecks

## How to Fix

Please analyze these errors and provide:
1. Root cause analysis
2. Step-by-step fixes
3. Prevention strategies
4. Test cases to verify fixes

"@
    
    Pop-Location
    
    # Save and copy
    $outputFile = "$OUTPUT_DIR\errors-$(Get-Date -Format 'yyyyMMdd-HHmmss').md"
    $errorReport | Out-File -FilePath $outputFile -Encoding UTF8
    $errorReport | Set-Clipboard
    
    Write-Host "✅ Error collection complete!" -ForegroundColor Green
    Write-Host "📁 Saved to: $outputFile" -ForegroundColor Yellow
    Write-Host "📋 Copied to clipboard" -ForegroundColor Cyan
}

function Analyze-Performance {
    Write-Host "⚡ Analyzing performance..." -ForegroundColor Green
    
    $perfReport = @"
# EBITDA Game - Performance Analysis

## Current Performance Metrics

### Build Size
``````
$(Push-Location $SKELETON_DIR; npm run build 2>&1 | Select-String "dist|bundle|chunk" | Out-String; Pop-Location)
``````

### Bundle Analysis
"@

    # Analyze bundle sizes
    $distPath = "$SKELETON_DIR\dist"
    if (Test-Path $distPath) {
        $files = Get-ChildItem -Path $distPath -Recurse -File
        $perfReport += "`n`n### File Sizes`n"
        foreach ($file in $files | Sort-Object Length -Descending | Select-Object -First 10) {
            $sizeKB = [math]::Round($file.Length / 1KB, 2)
            $perfReport += "- $($file.Name): $sizeKB KB`n"
        }
    }
    
    # Find potential performance issues in code
    $perfReport += @"

## Code Analysis

### Heavy Operations Found
"@
    
    $sourceFiles = Get-ChildItem -Path "$SKELETON_DIR\src" -Filter "*.ts" -Recurse
    
    foreach ($file in $sourceFiles) {
        $content = Get-Content $file.FullName -Raw
        $relative = $file.FullName.Replace($SKELETON_DIR, "").Replace("\", "/")
        
        $issues = @()
        
        # Check for performance anti-patterns
        if ($content -match "\.map\([^)]+\)\.filter\(") {
            $issues += "Chain of map().filter() - consider single pass"
        }
        if ($content -match "\.reduce\([^)]+\)\.map\(") {
            $issues += "Chain of reduce().map() - consider optimization"
        }
        if ($content -match "for.*for.*for") {
            $issues += "Triple nested loops detected"
        }
        if ($content -match "Object\.keys\([^)]+\)\.forEach") {
            $issues += "Object.keys().forEach - consider for...in"
        }
        if ($content -match "Array\($([0-9]{4,})\)") {
            $issues += "Large array pre-allocation"
        }
        if ($content -match "JSON\.parse.*JSON\.stringify") {
            $issues += "Deep cloning via JSON - inefficient"
        }
        
        if ($issues.Count -gt 0) {
            $perfReport += "`n**$relative**`n"
            foreach ($issue in $issues) {
                $perfReport += "- ⚠️ $issue`n"
            }
        }
    }
    
    $perfReport += @"

## Memory Analysis

### Potential Memory Leaks
"@
    
    foreach ($file in $sourceFiles) {
        $content = Get-Content $file.FullName -Raw
        $relative = $file.FullName.Replace($SKELETON_DIR, "").Replace("\", "/")
        
        $leaks = @()
        
        if ($content -match "addEventListener" -and $content -notmatch "removeEventListener") {
            $leaks += "Event listeners without cleanup"
        }
        if ($content -match "setInterval" -and $content -notmatch "clearInterval") {
            $leaks += "Intervals without cleanup"
        }
        if ($content -match "new Worker" -and $content -notmatch "terminate") {
            $leaks += "Worker without termination"
        }
        
        if ($leaks.Count -gt 0) {
            $perfReport += "`n**$relative**`n"
            foreach ($leak in $leaks) {
                $perfReport += "- 🚨 $leak`n"
            }
        }
    }
    
    $perfReport += @"

## Optimization Recommendations

1. **Bundle Splitting**
   - Implement code splitting for routes
   - Lazy load heavy components
   - Extract vendor bundles

2. **Runtime Performance**
   - Use React.memo for expensive components
   - Implement virtual scrolling for long lists
   - Debounce/throttle event handlers

3. **Memory Management**
   - Implement cleanup in useEffect
   - Use WeakMap for object associations
   - Clear large arrays when done

4. **Rendering Optimization**
   - Use CSS transforms for animations
   - Implement shouldComponentUpdate
   - Batch state updates

## Performance Testing Script

``````javascript
// Add to your codebase for performance monitoring
const perfMonitor = {
    mark: (name) => performance.mark(name),
    measure: (name, start, end) => {
        performance.measure(name, start, end);
        const measure = performance.getEntriesByName(name)[0];
        console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
    },
    profile: async (name, fn) => {
        const start = performance.now();
        const result = await fn();
        const duration = performance.now() - start;
        console.log(`${name}: ${duration.toFixed(2)}ms`);
        return result;
    }
};
``````

Please analyze and provide:
1. Specific optimization strategies
2. Code refactoring suggestions
3. Performance budgets
4. Monitoring implementation

"@
    
    # Save and copy
    $outputFile = "$OUTPUT_DIR\performance-$(Get-Date -Format 'yyyyMMdd-HHmmss').md"
    $perfReport | Out-File -FilePath $outputFile -Encoding UTF8
    $perfReport | Set-Clipboard
    
    Write-Host "✅ Performance analysis complete!" -ForegroundColor Green
    Write-Host "📁 Saved to: $outputFile" -ForegroundColor Yellow
    Write-Host "📋 Copied to clipboard" -ForegroundColor Cyan
}

function Generate-Architecture {
    Write-Host "🏗️ Generating architecture documentation..." -ForegroundColor Green
    
    # Analyze the codebase structure
    $structure = @"
# EBITDA Game - Architecture Documentation

## Project Structure
``````
$(tree $SKELETON_DIR /F /A 2>$null | Select-Object -First 100 | Out-String)
``````

## Module Architecture

"@
    
    # Analyze each module
    $modules = Get-ChildItem -Path "$SKELETON_DIR\src" -Directory
    
    foreach ($module in $modules) {
        $files = Get-ChildItem -Path $module.FullName -Filter "*.ts" -Recurse
        
        $structure += "### $($module.Name) Module`n`n"
        $structure += "**Purpose**: [Describe purpose]`n"
        $structure += "**Files**: $($files.Count)`n"
        $structure += "**Key Components**:`n"
        
        foreach ($file in $files | Select-Object -First 5) {
            $structure += "- $($file.Name)`n"
        }
        
        $structure += "`n"
    }
    
    # Data flow analysis
    $structure += @"
## Data Flow

### State Management (Zustand)
``````typescript
// Main store structure
$(Get-Content "$SKELETON_DIR\src\store\gameStore.ts" -ErrorAction SilentlyContinue | Select-Object -First 50 | Out-String)
``````

### Event System
- Event sourcing for deterministic replay
- Command pattern for actions
- Observer pattern for UI updates

## Key Design Patterns

1. **Singleton**: Game state store
2. **Factory**: Entity creation
3. **Strategy**: AI decision making
4. **Observer**: Event system
5. **Command**: User actions

## Performance Architecture

### Optimization Strategies
- Virtual DOM diffing (React)
- Memoization of expensive calculations
- Web Workers for heavy computation
- RequestAnimationFrame for smooth rendering

### Scalability Considerations
- Lazy loading of game modules
- Progressive feature enhancement
- Efficient data structures (Map, Set)
- Indexed lookups for O(1) access

## Security Architecture

### Client-Side Security
- Input validation
- XSS prevention
- CSRF tokens
- Secure random generation

### Game Integrity
- Deterministic simulation
- Checksum validation
- Anti-cheat measures
- Replay verification

## Testing Architecture

### Test Pyramid
1. **Unit Tests**: Core logic
2. **Integration Tests**: Module interactions  
3. **E2E Tests**: User workflows
4. **Performance Tests**: FPS, memory

## Deployment Architecture

### Build Pipeline
1. TypeScript compilation
2. Bundle optimization
3. Asset compression
4. Source map generation

### Environments
- Development: Hot reload, source maps
- Staging: Production build, debug enabled
- Production: Optimized, monitoring enabled

## Future Architecture Considerations

### Planned Enhancements
1. Multiplayer support (WebSocket/WebRTC)
2. Cloud save sync
3. Mod support system
4. Achievement system
5. Leaderboards

### Technical Debt
- [ ] Refactor legacy code
- [ ] Improve type coverage
- [ ] Optimize bundle size
- [ ] Add monitoring
- [ ] Document APIs

## Architecture Decisions

### Why TypeScript?
- Type safety
- Better IDE support
- Refactoring confidence
- Self-documenting code

### Why React?
- Component reusability
- Virtual DOM performance
- Large ecosystem
- Developer experience

### Why Zustand?
- Minimal boilerplate
- TypeScript support
- DevTools integration
- Performance

## Questions for Review

1. Is the current architecture scalable?
2. Are there performance bottlenecks?
3. What patterns should we adopt/avoid?
4. How can we improve modularity?
5. What monitoring do we need?

"@
    
    # Save and copy
    $outputFile = "$OUTPUT_DIR\architecture-$(Get-Date -Format 'yyyyMMdd-HHmmss').md"
    $structure | Out-File -FilePath $outputFile -Encoding UTF8
    $structure | Set-Clipboard
    
    Write-Host "✅ Architecture documentation generated!" -ForegroundColor Green
    Write-Host "📁 Saved to: $outputFile" -ForegroundColor Yellow
    Write-Host "📋 Copied to clipboard" -ForegroundColor Cyan
}

function Prepare-Feature {
    param([string]$FeatureName)
    
    if (-not $FeatureName) {
        $FeatureName = "new-feature"
    }
    
    Write-Host "✨ Preparing feature context: $FeatureName" -ForegroundColor Green
    
    $featureDoc = @"
# Feature Implementation: $FeatureName

## Current Codebase Context

### Relevant Existing Code
"@
    
    # Find potentially relevant files
    $searchTerms = $FeatureName -split "-"
    $relevantFiles = @()
    
    foreach ($term in $searchTerms) {
        $files = Get-ChildItem -Path "$SKELETON_DIR\src" -Filter "*.ts" -Recurse | 
                 Where-Object { $_.Name -match $term -or (Get-Content $_.FullName -Raw) -match $term }
        $relevantFiles += $files
    }
    
    $relevantFiles = $relevantFiles | Select-Object -Unique -First 10
    
    foreach ($file in $relevantFiles) {
        $content = Get-Content $file.FullName -Raw
        $relative = $file.FullName.Replace($SKELETON_DIR, "").Replace("\", "/")
        
        $featureDoc += @"

#### File: $relative
``````typescript
$(Select-String -InputObject $content -Pattern ".+" | Select-Object -First 50 | Out-String)
``````
"@
    }
    
    $featureDoc += @"

## Feature Requirements

### User Story
As a [user type]
I want [feature]
So that [benefit]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Technical Requirements
- Maintain 60 FPS performance
- Ensure deterministic behavior
- Follow existing code patterns
- Add comprehensive TypeScript types
- Include unit tests

## Implementation Plan

### Phase 1: Core Logic
- [ ] Define data structures
- [ ] Implement business logic
- [ ] Add state management

### Phase 2: UI Integration
- [ ] Create React components
- [ ] Connect to state store
- [ ] Add event handlers

### Phase 3: Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] Performance tests

### Phase 4: Polish
- [ ] Optimize performance
- [ ] Add animations
- [ ] Handle edge cases

## Code Templates

### Component Template
``````typescript
import React, { useMemo, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'

interface ${FeatureName}Props {
    // Define props
}

export const ${FeatureName}: React.FC<${FeatureName}Props> = (props) => {
    const { state, actions } = useGameStore()
    
    const handleAction = useCallback(() => {
        // Implementation
    }, [])
    
    return (
        <div className="${FeatureName.ToLower()}">
            {/* UI implementation */}
        </div>
    )
}
``````

### State Slice Template
``````typescript
interface ${FeatureName}State {
    // Define state shape
}

interface ${FeatureName}Actions {
    // Define actions
}

export const create${FeatureName}Slice = (set, get) => ({
    // State
    ${FeatureName.ToLower()}: {
        // Initial state
    },
    
    // Actions
    ${FeatureName.ToLower()}Actions: {
        // Action implementations
    }
})
``````

### Test Template
``````typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('${FeatureName}', () => {
    beforeEach(() => {
        // Setup
    })
    
    it('should handle basic functionality', () => {
        // Test implementation
    })
})
``````

## Integration Points

### Files to Modify
1. `src/store/gameStore.ts` - Add feature state
2. `src/ui/App.tsx` - Add feature component
3. `src/engine/types.ts` - Add type definitions
4. `src/engine/state.ts` - Update game state

### API Endpoints Needed
- GET /api/${FeatureName.ToLower()}
- POST /api/${FeatureName.ToLower()}
- PUT /api/${FeatureName.ToLower()}/:id
- DELETE /api/${FeatureName.ToLower()}/:id

## Questions for Implementation

1. What is the exact user workflow?
2. What data needs to be persisted?
3. How does this interact with existing features?
4. What are the performance constraints?
5. What error cases need handling?

Please provide:
1. Complete implementation code
2. Integration instructions
3. Test cases
4. Performance optimizations

"@
    
    # Save and copy
    $outputFile = "$OUTPUT_DIR\feature-$FeatureName-$(Get-Date -Format 'yyyyMMdd-HHmmss').md"
    $featureDoc | Out-File -FilePath $outputFile -Encoding UTF8
    $featureDoc | Set-Clipboard
    
    Write-Host "✅ Feature context prepared!" -ForegroundColor Green
    Write-Host "📁 Saved to: $outputFile" -ForegroundColor Yellow
    Write-Host "📋 Copied to clipboard" -ForegroundColor Cyan
}

# Main execution
switch ($Mode.ToLower()) {
    "analyze" {
        Analyze-Module -Module $Target
    }
    "errors" {
        Collect-Errors
    }
    "perf" {
        Analyze-Performance
    }
    "arch" {
        Generate-Architecture
    }
    "feature" {
        Prepare-Feature -FeatureName $Target
    }
    "refactor" {
        # Similar to analyze but focused on refactoring
        Write-Host "🔧 Preparing refactoring context..." -ForegroundColor Green
        Analyze-Module -Module $Target
    }
    "test" {
        Write-Host "🧪 Preparing test context..." -ForegroundColor Green
        # Gather test-related context
        $testContext = @"
# Test Implementation Context

## Current Test Coverage
``````
$(Push-Location $SKELETON_DIR; npm test -- --coverage 2>&1 | Out-String; Pop-Location)
``````

## Test Files Needed
$(Get-ChildItem -Path "$SKELETON_DIR\src" -Filter "*.ts" -Recurse | 
  Where-Object { $_.Name -notmatch "\.test\.|\.spec\." } |
  ForEach-Object { "- $($_.Name).test.ts" } | Out-String)

Please implement comprehensive tests.
"@
        $testContext | Set-Clipboard
        Write-Host "✅ Test context copied!" -ForegroundColor Green
    }
    "deploy" {
        Write-Host "🚀 Preparing deployment review..." -ForegroundColor Green
        $deployContext = @"
# Deployment Checklist

## Build Status
``````
$(Push-Location $SKELETON_DIR; npm run build 2>&1 | Out-String; Pop-Location)
``````

## Git Status
``````
$(git status | Out-String)
``````

## Environment Variables
- [ ] All configs set
- [ ] Secrets secured
- [ ] API endpoints configured

Please review for production readiness.
"@
        $deployContext | Set-Clipboard
        Write-Host "✅ Deployment context copied!" -ForegroundColor Green
    }
    default {
        Show-Help
    }
}