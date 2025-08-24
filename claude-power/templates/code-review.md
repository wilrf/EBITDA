# Code Review Request Template

## Context
- **Component**: [COMPONENT_NAME]
- **Purpose**: [WHAT_IT_DOES]
- **PR/Branch**: [REFERENCE]
- **Lines of code**: [COUNT]
- **Performance critical**: Yes/No

## Code to Review

```typescript
// Paste your code here
[CODE_TO_REVIEW]
```

## Specific Concerns
1. **Performance**: [SPECIFIC_CONCERN]
2. **Correctness**: [SPECIFIC_CONCERN]
3. **Maintainability**: [SPECIFIC_CONCERN]
4. **Security**: [SPECIFIC_CONCERN]

## Checklist for Review

### Performance
- [ ] Big O complexity acceptable?
- [ ] Memory allocations minimized?
- [ ] Hot paths optimized?
- [ ] Caching opportunities identified?
- [ ] Will maintain 60 FPS?

### Correctness
- [ ] Edge cases handled?
- [ ] Deterministic behavior guaranteed?
- [ ] Type safety enforced?
- [ ] Business logic accurate?

### Code Quality
- [ ] SOLID principles followed?
- [ ] DRY (no unnecessary repetition)?
- [ ] Clear naming conventions?
- [ ] Appropriate abstraction level?

### Security
- [ ] Input validation present?
- [ ] XSS prevention in place?
- [ ] No sensitive data exposed?
- [ ] Secure defaults used?

### Testing
- [ ] Unit testable?
- [ ] Integration points clear?
- [ ] Performance measurable?
- [ ] Edge cases testable?

## Current Metrics
- **Execution time**: [CURRENT_TIME]
- **Memory usage**: [CURRENT_MEMORY]
- **Bundle impact**: [SIZE_INCREASE]

## Review Type Requested
- [ ] **Quick sanity check** - Just look for obvious issues
- [ ] **Thorough review** - Detailed analysis of everything
- [ ] **Performance focus** - Optimize for speed
- [ ] **Architecture review** - Is this the right approach?
- [ ] **Security audit** - Find vulnerabilities

## Claude Instructions
Please review this code for the EBITDA game with focus on:
1. Performance (must maintain 60 FPS)
2. Deterministic behavior
3. Memory efficiency
4. Best practices for our tech stack (TypeScript/React/Rust)

Provide:
- Specific issues found (with line numbers)
- Suggested improvements (with code examples)
- Performance optimization opportunities
- Alternative approaches if applicable