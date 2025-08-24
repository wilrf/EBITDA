# Smart Context Builder for Claude
# Intelligently selects and prepares the most relevant code for your question

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Question,
    
    [int]$MaxFiles = 10,
    [int]$MaxLinesPerFile = 200,
    [switch]$IncludeTests,
    [switch]$IncludeDocs
)

$EBITDA_DIR = "C:\Users\wilso\Downloads\EBITDA"
$SKELETON_DIR = "$EBITDA_DIR\ebitda-skeleton"

Write-Host "🧠 Building smart context for: $Question" -ForegroundColor Cyan

# Extract keywords from question
$keywords = @()
$commonWords = @("the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "as", "is", "was", "are", "were", "been", "be", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "must", "shall", "can", "need", "how", "what", "when", "where", "why", "which", "who")

$words = $Question.ToLower() -split '\s+' | Where-Object { 
    $_ -notin $commonWords -and $_.Length -gt 2 
}

# Add technical terms that might be related
$technicalMap = @{
    "performance" = @("fps", "optimize", "speed", "fast", "slow", "memory", "cpu")
    "error" = @("bug", "fix", "issue", "problem", "exception", "undefined", "null")
    "state" = @("store", "zustand", "redux", "context", "useState")
    "component" = @("react", "jsx", "tsx", "render", "props", "hook")
    "game" = @("engine", "loop", "tick", "update", "draw", "entity")
    "network" = @("api", "fetch", "axios", "http", "websocket", "rest")
    "test" = @("jest", "vitest", "expect", "describe", "it", "mock")
    "style" = @("css", "styled", "className", "sass", "tailwind")
}

foreach ($word in $words) {
    $keywords += $word
    
    # Add related technical terms
    foreach ($term in $technicalMap.Keys) {
        if ($word -match $term) {
            $keywords += $technicalMap[$term]
        }
    }
}

$keywords = $keywords | Select-Object -Unique

Write-Host "🔍 Keywords identified: $($keywords -join ', ')" -ForegroundColor Yellow

# Score files based on relevance
$fileScores = @{}
$allFiles = Get-ChildItem -Path "$SKELETON_DIR\src" -Filter "*.ts" -Recurse

if (-not $IncludeTests) {
    $allFiles = $allFiles | Where-Object { $_.Name -notmatch "\.test\.|\.spec\." }
}

foreach ($file in $allFiles) {
    $score = 0
    $content = Get-Content $file.FullName -Raw
    $fileName = $file.Name.ToLower()
    $path = $file.FullName.ToLower()
    
    # Score based on keywords in filename
    foreach ($keyword in $keywords) {
        if ($fileName -match $keyword) {
            $score += 10
        }
        if ($path -match $keyword) {
            $score += 5
        }
    }
    
    # Score based on keywords in content
    foreach ($keyword in $keywords) {
        $matches = ([regex]::Matches($content, $keyword, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)).Count
        $score += [Math]::Min($matches, 10) # Cap at 10 points per keyword
    }
    
    # Boost score for certain file types based on question context
    if ($Question -match "component|ui|render" -and $fileName -match "\.tsx$") {
        $score += 5
    }
    if ($Question -match "engine|logic|algorithm" -and $path -match "\\engine\\") {
        $score += 5
    }
    if ($Question -match "store|state" -and $path -match "\\store\\") {
        $score += 10
    }
    
    if ($score -gt 0) {
        $fileScores[$file] = $score
    }
}

# Sort by relevance and select top files
$selectedFiles = $fileScores.GetEnumerator() | 
    Sort-Object Value -Descending | 
    Select-Object -First $MaxFiles

Write-Host "📂 Selected $($selectedFiles.Count) most relevant files" -ForegroundColor Green

# Build context document
$context = @"
# Context for Claude

## Question
$Question

## Relevant Code Files

"@

foreach ($entry in $selectedFiles) {
    $file = $entry.Key
    $score = $entry.Value
    $relative = $file.FullName.Replace($SKELETON_DIR, "").Replace("\", "/")
    
    Write-Host "  - $($file.Name) (relevance: $score)" -ForegroundColor Gray
    
    $content = Get-Content $file.FullName
    
    # Smart line selection - include most relevant parts
    $lines = @()
    $lineNum = 1
    
    # Always include imports and class/interface definitions
    foreach ($line in $content) {
        $include = $false
        
        # Always include structural elements
        if ($line -match "^import|^export|^interface|^type|^class|^function|^const.*=") {
            $include = $true
        }
        
        # Include lines with keywords
        foreach ($keyword in $keywords) {
            if ($line -match $keyword) {
                $include = $true
                break
            }
        }
        
        if ($include) {
            $lines += "$lineNum`t$line"
        }
        
        $lineNum++
        
        if ($lines.Count -ge $MaxLinesPerFile) {
            break
        }
    }
    
    # If we didn't get enough context, add more lines around keywords
    if ($lines.Count -lt 50) {
        $fullContent = $content -join "`n"
        foreach ($keyword in $keywords) {
            if ($fullContent -match "(.{0,200}$keyword.{0,200})") {
                $lines += "`n... relevant section ...`n"
                $lines += $Matches[0]
            }
        }
    }
    
    $context += @"
### $relative (Relevance Score: $score)

``````typescript
$($lines -join "`n")
``````

"@
}

# Add project structure context
$context += @"

## Project Structure

``````
src/
├── engine/        # Game logic and simulation
├── ui/           # React components
├── store/        # State management (Zustand)
├── data/         # Data loading and configs
└── main.tsx      # Entry point
``````

## Key Technologies
- TypeScript + React
- Zustand for state management
- Vite for bundling
- Deterministic game engine (60 FPS target)

## Additional Context

"@

# Add relevant documentation if requested
if ($IncludeDocs) {
    $docs = Get-ChildItem -Path $EBITDA_DIR -Filter "*.md" -Recurse | 
            Where-Object { $_.Name -notmatch "node_modules" } |
            Select-Object -First 3
    
    foreach ($doc in $docs) {
        $docContent = Get-Content $doc.FullName -Raw
        
        # Find relevant sections
        foreach ($keyword in $keywords) {
            if ($docContent -match "(?s)(#{1,3}[^#]*$keyword[^#]*?(?=#{1,3}|\z))") {
                $context += @"

### From Documentation: $($doc.Name)
$($Matches[0])

"@
                break
            }
        }
    }
}

# Add specific hints based on question patterns
if ($Question -match "error|bug|fix|issue") {
    $context += @"
### Debugging Hints
- Check TypeScript compilation: `npx tsc --noEmit`
- Review recent changes: `git diff HEAD~1`
- Look for console errors in browser DevTools
- Verify all imports are correct

"@
}

if ($Question -match "performance|slow|optimize|fps") {
    $context += @"
### Performance Considerations
- Target: 60 FPS with 10,000+ entities
- Use React.memo for expensive components
- Profile with Chrome DevTools Performance tab
- Consider Web Workers for heavy calculations
- Use requestAnimationFrame for animations

"@
}

if ($Question -match "test|testing|jest|vitest") {
    $context += @"
### Testing Setup
- Test runner: Vitest
- Test files: *.test.ts or *.spec.ts
- Run tests: `npm test`
- Coverage: `npm test -- --coverage`

"@
}

$context += @"

## Your Task

Please analyze the provided code context and answer the question. Consider:
1. The specific files and code sections provided
2. The overall architecture and patterns used
3. Performance and determinism requirements
4. TypeScript type safety

Provide a detailed answer with:
- Clear explanation
- Code examples if needed
- Best practices for this codebase
- Any potential issues to watch for

"@

# Save and copy
$outputFile = "$EBITDA_DIR\claude-output\context-$(Get-Date -Format 'yyyyMMdd-HHmmss').md"
if (-not (Test-Path "$EBITDA_DIR\claude-output")) {
    New-Item -ItemType Directory -Path "$EBITDA_DIR\claude-output" | Out-Null
}

$context | Out-File -FilePath $outputFile -Encoding UTF8
$context | Set-Clipboard

Write-Host "`n✅ Smart context built!" -ForegroundColor Green
Write-Host "📁 Saved to: $outputFile" -ForegroundColor Yellow
Write-Host "📋 Copied to clipboard - paste in Claude" -ForegroundColor Cyan
Write-Host "`n💡 Tip: Claude will have focused context about '$Question'" -ForegroundColor Magenta