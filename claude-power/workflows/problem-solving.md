# Problem-Solving Workflow

## Systematic Debugging Process

### Step 1: Understand the Problem
**Prompt**:
```
I have this problem in the EBITDA game:
[DESCRIBE_PROBLEM]

Symptoms:
- [SYMPTOM_1]
- [SYMPTOM_2]

When it happens:
- [CONDITION_1]
- [CONDITION_2]

What is the most likely root cause?
```

### Step 2: Reproduce Minimally
**Prompt**:
```
Given this issue: [ISSUE]
In this code: [CODE]

Create a minimal reproduction case that isolates the problem.
```

### Step 3: Identify Root Cause
**Prompt**:
```
Here's my minimal reproduction: [CODE]
Error: [ERROR]
Stack: [STACK]

What's the exact root cause and why does it happen?
```

### Step 4: Generate Solutions
**Prompt**:
```
Root cause: [CAUSE]

Provide 3 different solutions:
1. Quick fix (temporary)
2. Proper fix (permanent)
3. Preventive fix (never happens again)

Consider our constraints:
- Must maintain determinism
- Must keep 60 FPS
- Cannot break save compatibility
```

### Step 5: Implement Fix
**Prompt**:
```
Implement the proper fix for: [PROBLEM]
Current code: [CODE]
Root cause: [CAUSE]

Ensure:
- No side effects
- Handles edge cases
- Includes tests
```

### Step 6: Verify Fix
**Prompt**:
```
I implemented this fix: [FIX]

Generate:
1. Tests to verify it works
2. Tests to ensure no regression
3. Performance benchmark
4. Edge cases to check
```

### Step 7: Prevent Recurrence
**Prompt**:
```
This bug happened: [BUG]
Root cause: [CAUSE]
Fix: [FIX]

How can we:
1. Prevent similar bugs
2. Catch them earlier
3. Improve our architecture
4. Add linting rules
```

## Common Problem Patterns

### Performance Issues
```
Performance problem: [DESCRIPTION]
Current metrics: [METRICS]
Target: 60 FPS

Profile and optimize:
1. Find bottlenecks
2. Suggest optimizations
3. Estimate improvements
```

### Memory Leaks
```
Suspected memory leak: [WHERE]
Growth rate: [RATE]

Find and fix:
1. Identify retention
2. Break references
3. Add cleanup
```

### Race Conditions
```
Intermittent issue: [DESCRIPTION]
Occurs when: [CONDITIONS]

Fix race condition:
1. Identify shared state
2. Add proper synchronization
3. Make deterministic
```

### State Corruption
```
State becomes invalid: [DESCRIPTION]
State before: [STATE_BEFORE]
State after: [STATE_AFTER]

Fix corruption:
1. Find mutation
2. Make immutable
3. Add validation
```

## Debugging Checklist

Before asking Claude, check:
- [ ] Is it reproducible?
- [ ] Do I have error messages?
- [ ] Do I have stack traces?
- [ ] Have I isolated the problem?
- [ ] Do I understand what should happen?
- [ ] Have I checked similar code that works?

## Problem Categories

### 1. Logic Errors
- Wrong algorithm
- Off-by-one errors  
- Incorrect conditions
- Missing edge cases

### 2. Performance Problems
- O(n²) or worse algorithms
- Unnecessary re-renders
- Memory allocations in loops
- Missing memoization

### 3. State Management
- Mutations instead of immutable updates
- Stale closures
- Race conditions
- Inconsistent state

### 4. Type Errors
- Type mismatches
- Missing null checks
- Wrong type assertions
- Generic type issues

### 5. Async Issues
- Unhandled promises
- Missing await
- Callback hell
- Error propagation

## Debug Output Template
```typescript
// Add debug logging
console.group('🔍 Debugging [COMPONENT]')
console.log('Input:', input)
console.log('State before:', JSON.parse(JSON.stringify(state)))
console.log('Expected:', expected)
console.log('Actual:', actual)
console.trace('Call stack')
console.groupEnd()
```

## Prevention Strategies

1. **Type Safety**
   - Use strict TypeScript
   - No `any` types
   - Exhaustive switches

2. **Testing**
   - Unit tests for logic
   - Integration tests for flows
   - Property-based testing

3. **Code Review**
   - Pair programming
   - PR reviews
   - Architecture reviews

4. **Monitoring**
   - Performance metrics
   - Error tracking
   - State validation

5. **Documentation**
   - Document assumptions
   - Document edge cases
   - Document performance characteristics