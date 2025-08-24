# Incremental Development Workflow

## Purpose
Build complex features step-by-step with validation at each stage.

## Workflow Steps

### Phase 1: Design Interfaces
**Prompt**: 
```
Design only the TypeScript interfaces for [FEATURE_NAME] in the EBITDA game.
Consider:
- Existing types in types.ts
- Deterministic requirements
- Performance (data structure choices)
- Future extensibility

Provide just the interfaces, no implementation.
```

### Phase 2: Core Implementation
**Prompt**:
```
Now implement the core logic for these interfaces:
[PASTE_INTERFACES]

Requirements:
- Basic functionality only (happy path)
- No error handling yet
- No optimization yet
- Must be deterministic

Keep it under 150 lines.
```

### Phase 3: Error Handling
**Prompt**:
```
Add comprehensive error handling to this code:
[PASTE_CORE_IMPLEMENTATION]

Consider:
- Invalid inputs
- State inconsistencies  
- Edge cases
- Recovery strategies

Maintain deterministic behavior.
```

### Phase 4: Optimization
**Prompt**:
```
Optimize this code for performance:
[PASTE_CODE_WITH_ERROR_HANDLING]

Focus on:
- Hot paths (called every frame)
- Memory allocations
- Caching opportunities
- Algorithm complexity

Must maintain 60 FPS with 10,000 entities.
```

### Phase 5: Testing
**Prompt**:
```
Generate comprehensive tests for:
[PASTE_OPTIMIZED_CODE]

Include:
- Unit tests for each function
- Edge case tests
- Performance benchmarks
- Determinism verification tests
- Property-based tests where applicable

Use Jest and follow our testing patterns.
```

### Phase 6: Integration
**Prompt**:
```
Show how to integrate this feature into the existing EBITDA codebase:
[PASTE_TESTED_CODE]

Provide:
- State management integration (Zustand)
- UI component connections
- Event system hooks
- Migration strategy if needed
```

### Phase 7: Documentation
**Prompt**:
```
Document this implementation:
[PASTE_INTEGRATED_CODE]

Include:
- API documentation (JSDoc)
- Usage examples
- Performance characteristics
- Architecture decision records (ADRs)
```

## Validation Gates

Between each phase, validate:
- [ ] Does it compile without errors?
- [ ] Does it maintain determinism?
- [ ] Does it meet performance targets?
- [ ] Is it maintainable?
- [ ] Does it follow our patterns?

## Example Usage

```markdown
Claude, let's build the hostile takeover feature incrementally.
Start with Phase 1: Design the interfaces.
```

Then after each response:
```markdown
Good. Now Phase 2: Implement core logic for these interfaces.
```

## Benefits
1. **Manageable chunks** - Each phase is focused
2. **Early validation** - Catch design issues early
3. **Learning opportunity** - Understand each layer
4. **Quality assurance** - Nothing gets missed
5. **Documentation trail** - Natural documentation