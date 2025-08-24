# Bug Investigation Template

## Bug Summary
- **Title**: [BUG_TITLE]
- **Severity**: Critical/High/Medium/Low
- **Component**: [AFFECTED_COMPONENT]
- **Reproducible**: Always/Sometimes/Rarely
- **Environment**: Development/Production

## Description
[DETAILED_DESCRIPTION_OF_THE_ISSUE]

## Steps to Reproduce
1. [STEP_1]
2. [STEP_2]
3. [STEP_3]
4. Expected: [WHAT_SHOULD_HAPPEN]
5. Actual: [WHAT_ACTUALLY_HAPPENS]

## Error Details

### Error Message
```
[PASTE_ERROR_MESSAGE]
```

### Stack Trace
```
[PASTE_STACK_TRACE]
```

### Console Output
```
[PASTE_RELEVANT_CONSOLE_OUTPUT]
```

## Code Context

### Suspected Problem Area
```typescript
// File: [FILENAME]
// Line: [LINE_NUMBERS]
[PASTE_RELEVANT_CODE]
```

### Related Code
```typescript
// Other relevant code that might be connected
[PASTE_RELATED_CODE]
```

## Investigation So Far

### What I've Tried
1. **Attempt 1**: [WHAT_YOU_DID]
   - Result: [WHAT_HAPPENED]
   
2. **Attempt 2**: [WHAT_YOU_DID]
   - Result: [WHAT_HAPPENED]

3. **Attempt 3**: [WHAT_YOU_DID]
   - Result: [WHAT_HAPPENED]

### Hypotheses
1. **Theory 1**: [YOUR_THEORY]
   - Evidence for: [SUPPORTING_EVIDENCE]
   - Evidence against: [CONTRADICTING_EVIDENCE]

2. **Theory 2**: [YOUR_THEORY]
   - Evidence for: [SUPPORTING_EVIDENCE]
   - Evidence against: [CONTRADICTING_EVIDENCE]

## System State
- **Browser**: [BROWSER_VERSION]
- **Memory usage**: [CURRENT_USAGE]
- **Performance metrics**: [RELEVANT_METRICS]
- **Game state**: [RELEVANT_STATE]

## Data Context

### Input Data
```json
{
  // Data that triggers the bug
}
```

### State Before Error
```json
{
  // Relevant state before error
}
```

### State After Error
```json
{
  // State after error (if accessible)
}
```

## Questions for Claude

1. **Root Cause**: What's the most likely root cause based on the symptoms?
2. **Debug Strategy**: What's the best approach to debug this?
3. **Quick Fix**: Is there a quick fix to unblock development?
4. **Proper Fix**: What's the proper long-term solution?
5. **Prevention**: How can we prevent similar issues?

## Constraints
- Must maintain deterministic behavior
- Cannot break existing save files
- Must maintain 60 FPS performance
- [OTHER_CONSTRAINTS]

---
**Claude Instructions**: Analyze this bug in the context of our EBITDA game. Consider the deterministic requirements and performance constraints. Provide a systematic debugging approach and potential fixes.