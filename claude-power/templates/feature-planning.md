# Feature Planning Template

## Feature: [FEATURE_NAME]

### User Story
As a **[USER_TYPE]**
I want **[FUNCTIONALITY]**
So that **[BUSINESS_VALUE]**

### Acceptance Criteria
- [ ] Given [CONTEXT], When [ACTION], Then [OUTCOME]
- [ ] Given [CONTEXT], When [ACTION], Then [OUTCOME]
- [ ] Performance: [METRIC] must be under [THRESHOLD]
- [ ] Deterministic: Output must be identical given same seed

### Technical Requirements

#### Data Model Changes
```typescript
// Current model
interface [CURRENT] {
  // existing fields
}

// Proposed changes
interface [PROPOSED] {
  // new/modified fields
}
```

#### API Design
```typescript
// New endpoints/methods needed
class [SERVICE] {
  // method signatures
}
```

#### State Management
- Store location: [WHERE_IN_STATE]
- Update frequency: [HOW_OFTEN]
- Size estimate: [MEMORY_IMPACT]

### Implementation Approach

#### Phase 1: Core Logic
- [ ] Implement data structures
- [ ] Create business logic
- [ ] Add validation

#### Phase 2: Integration
- [ ] Connect to state management
- [ ] Update existing systems
- [ ] Migration strategy

#### Phase 3: UI
- [ ] Create components
- [ ] Add to relevant screens
- [ ] Responsive design

#### Phase 4: Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] Performance tests
- [ ] Determinism tests

### Performance Considerations
- Computational complexity: O([COMPLEXITY])
- Memory usage: [ESTIMATE]
- Network calls: [COUNT]
- Render impact: [IMPACT]

### Risk Assessment
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| [RISK_1] | High/Med/Low | High/Med/Low | [STRATEGY] |
| [RISK_2] | High/Med/Low | High/Med/Low | [STRATEGY] |

### Dependencies
- Depends on: [OTHER_FEATURES]
- Blocks: [FUTURE_FEATURES]
- External: [LIBRARIES/APIS]

### Estimation
- Development: [HOURS/DAYS]
- Testing: [HOURS/DAYS]
- Total: [HOURS/DAYS]

### Claude Request
Given the above requirements for the EBITDA game, please:
1. Validate the technical approach
2. Identify potential performance bottlenecks
3. Suggest implementation optimizations
4. Provide code structure for the core logic
5. Recommend testing strategies

Remember: Must be deterministic and maintain 60 FPS.