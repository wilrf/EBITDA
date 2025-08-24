# EBITDA Private Equity Game - Detailed Implementation Plan
Version 1.0 · 2025-08-24

## Executive Summary
This document outlines a systematic approach to implementing the core features of the EBITDA Private Equity game. The implementation will build upon the existing TypeScript skeleton, addressing critical missing features while enhancing existing systems.

## Implementation Phases

### Phase 1: Core Engine Enhancement (Priority: CRITICAL)
**Goal**: Establish robust game foundation with deterministic simulation

#### 1.1 Pipeline Regeneration System
**Current Issue**: Pipeline depletes without regeneration
**Implementation**:
```typescript
// Add to state.ts
function generateNewDeals(state: GameState, count: number): Deal[] {
  const sectors = ['technology', 'healthcare', 'industrials', 'consumer', 'energy'];
  const deals: Deal[] = [];
  
  for (let i = 0; i < count; i++) {
    const sector = sectors[Math.floor(state.prng() * sectors.length)];
    const baseMultiple = getSectorMultiple(sector, state.kpis.M);
    const ebitda = 10 + state.prng() * 90; // $10M-$100M EBITDA
    
    deals.push({
      id: generateDealId(state),
      name: generateCompanyName(state),
      sector,
      baseMultiple,
      ebitda,
      revenue: ebitda * (3 + state.prng() * 2), // 3-5x revenue/EBITDA
      public: state.prng() > 0.7,
      meters: {
        fragility: Math.floor(state.prng() * 30),
        execution: 50 + Math.floor(state.prng() * 30),
        momentum: 40 + Math.floor(state.prng() * 40)
      }
    });
  }
  return deals;
}

// Refresh pipeline weekly
function weeklyPipelineRefresh(state: GameState): void {
  const minPipeline = 3;
  const maxPipeline = 8;
  
  if (state.pipeline.length < minPipeline) {
    const newDeals = generateNewDeals(state, maxPipeline - state.pipeline.length);
    state.pipeline.push(...newDeals);
  }
  
  // Remove stale deals (>4 weeks old)
  state.pipeline = state.pipeline.filter(d => 
    (state.week - d.weekAdded) <= 4
  );
}
```

#### 1.2 Deal Performance Calculation
**Current Issue**: Static fund metrics (DPI, RVPI, TVPI, IRR)
**Implementation**:
```typescript
// Add to types.ts
interface DealPerformance {
  entryValue: number;      // Purchase price
  currentValue: number;    // Current enterprise value
  realizedValue: number;   // Cash returned to fund
  unrealizedValue: number; // Paper gains
  holdingPeriod: number;   // Quarters held
  multiple: number;        // MOIC
  irr: number;            // Internal rate of return
}

// Add to state.ts
function calculateDealPerformance(deal: Deal, state: GameState): DealPerformance {
  const entryValue = deal.ebitda * deal.entryMultiple;
  const currentMultiple = deal.baseMultiple * (1 + getMomentumImpact(deal.meters.momentum));
  const currentValue = deal.ebitda * getGrowthFactor(deal) * currentMultiple;
  
  return {
    entryValue,
    currentValue,
    realizedValue: deal.exited ? currentValue : 0,
    unrealizedValue: deal.exited ? 0 : currentValue,
    holdingPeriod: state.quarter - deal.entryQuarter,
    multiple: currentValue / entryValue,
    irr: calculateIRR(entryValue, currentValue, holdingPeriod)
  };
}

// Update fund metrics
function updateFundMetrics(state: GameState): void {
  let totalInvested = 0;
  let totalRealized = 0;
  let totalUnrealized = 0;
  
  state.deals.forEach(deal => {
    const perf = calculateDealPerformance(deal, state);
    totalInvested += perf.entryValue;
    totalRealized += perf.realizedValue;
    totalUnrealized += perf.unrealizedValue;
  });
  
  state.fund.DPI = totalRealized / state.fund.commitments;
  state.fund.RVPI = totalUnrealized / state.fund.commitments;
  state.fund.TVPI = state.fund.DPI + state.fund.RVPI;
  state.fund.netIRR = calculatePortfolioIRR(state.deals);
}
```

### Phase 2: Exit Mechanics (Priority: HIGH)
**Goal**: Enable deal exits with strategic/financial/IPO paths

#### 2.1 Exit System Architecture
```typescript
// Add to types.ts
interface ExitOpportunity {
  dealId: string;
  type: 'strategic' | 'sponsor' | 'ipo';
  buyer?: string;           // For strategic/sponsor
  multiple: number;         // Exit multiple offered
  probability: number;      // Success probability
  conditions: string[];     // Requirements
  expiresWeek: number;     // Opportunity window
}

// Add exit.ts
export function generateExitOpportunities(state: GameState): ExitOpportunity[] {
  const opportunities: ExitOpportunity[] = [];
  
  state.deals.forEach(deal => {
    const holdingPeriod = (state.quarter - deal.entryQuarter);
    
    // Exit opportunities after 2+ years
    if (holdingPeriod >= 8) {
      const momentum = deal.meters.momentum;
      const marketHeat = state.kpis.M;
      
      // Strategic buyer interest
      if (momentum > 60 && state.prng() > 0.7) {
        opportunities.push({
          dealId: deal.id,
          type: 'strategic',
          buyer: generateStrategicBuyer(deal.sector),
          multiple: deal.baseMultiple * (1.1 + 0.1 * marketHeat),
          probability: 0.6 + momentum/200,
          conditions: ['Board approval', 'No MAC clause'],
          expiresWeek: state.week + 4
        });
      }
      
      // Sponsor-to-sponsor
      if (state.prng() > 0.8) {
        opportunities.push({
          dealId: deal.id,
          type: 'sponsor',
          buyer: selectRivalFirm(state),
          multiple: deal.baseMultiple * (1 + 0.05 * marketHeat),
          probability: 0.7,
          conditions: ['DD complete', 'Financing secured'],
          expiresWeek: state.week + 3
        });
      }
      
      // IPO window
      if (marketHeat > 0.5 && deal.revenue > 100 && momentum > 70) {
        opportunities.push({
          dealId: deal.id,
          type: 'ipo',
          multiple: deal.baseMultiple * (1.15 + 0.15 * marketHeat),
          probability: 0.5 + marketHeat/4,
          conditions: ['S-1 filed', 'Market stable', 'Roadshow complete'],
          expiresWeek: state.week + 8
        });
      }
    }
  });
  
  return opportunities;
}

// Process exit execution
export function executeExit(
  state: GameState, 
  opportunity: ExitOpportunity,
  decision: 'accept' | 'reject'
): ExitResult {
  if (decision === 'reject') {
    return { success: false, message: 'Exit opportunity declined' };
  }
  
  const roll = state.prng();
  if (roll > opportunity.probability) {
    return { 
      success: false, 
      message: 'Exit failed: ' + selectFailureReason(opportunity.type)
    };
  }
  
  const deal = state.deals.find(d => d.id === opportunity.dealId);
  if (!deal) return { success: false };
  
  // Calculate exit proceeds
  const exitValue = deal.ebitda * getGrowthFactor(deal) * opportunity.multiple;
  const debtPayoff = deal.leverage * deal.ebitda * getGrowthFactor(deal);
  const equityProceeds = exitValue - debtPayoff;
  const multiple = equityProceeds / (deal.ebitda * deal.entryMultiple - deal.leverage * deal.ebitda);
  
  // Update fund metrics
  state.fund.cashBalance += equityProceeds;
  deal.exited = true;
  deal.exitQuarter = state.quarter;
  deal.exitMultiple = opportunity.multiple;
  deal.realizedMOIC = multiple;
  
  // LP reaction
  if (multiple > 3) {
    state.firm.trust = Math.min(100, state.firm.trust + 5);
  } else if (multiple < 1.5) {
    state.firm.trust = Math.max(0, state.firm.trust - 5);
  }
  
  return {
    success: true,
    message: `Exited ${deal.name} at ${multiple.toFixed(1)}x MOIC`,
    proceeds: equityProceeds,
    multiple
  };
}
```

### Phase 3: LP Fundraising Mechanics (Priority: HIGH)
**Goal**: Implement fund lifecycle with capital calls and distributions

#### 3.1 Fund Lifecycle System
```typescript
// Add to types.ts
interface FundLifecycle {
  fundNumber: number;
  vintage: number;          // Year established
  size: number;            // Total commitments
  called: number;          // Capital called to date
  distributed: number;     // Capital returned to LPs
  status: 'investing' | 'harvesting' | 'winding down';
  investmentPeriod: number; // Quarters remaining to invest
  termRemaining: number;    // Quarters until fund term ends
}

interface LPCommitment {
  lpId: string;
  amount: number;
  called: number;
  distributed: number;
  satisfaction: number;    // LP happiness with performance
}

// Add fundraising.ts
export function initiateFundraising(state: GameState): FundraisingResult {
  // Check if eligible (current fund >60% invested)
  const deploymentRate = state.fund.invested / state.fund.commitments;
  if (deploymentRate < 0.6) {
    return { success: false, message: 'Current fund not sufficiently deployed' };
  }
  
  // Calculate fundraising capacity based on track record
  const trackRecord = state.fund.TVPI;
  const reputation = state.firm.reputation;
  const trustScore = state.firm.trust;
  
  let targetSize = state.fund.commitments;
  if (trackRecord > 2.0) targetSize *= 1.5;
  else if (trackRecord > 1.5) targetSize *= 1.2;
  else if (trackRecord < 1.0) targetSize *= 0.8;
  
  // LP interest based on performance
  const lpDemand = calculateLPDemand(trackRecord, reputation, trustScore);
  const actualSize = targetSize * lpDemand;
  
  // Generate LP roster
  const lps = generateLPCommitments(actualSize, state);
  
  return {
    success: true,
    fundSize: actualSize,
    lps,
    message: `Raised Fund ${state.fund.fundNumber + 1}: $${actualSize}M`
  };
}

// Capital call mechanics
export function callCapital(state: GameState, amount: number): CallResult {
  const available = state.fund.commitments - state.fund.called;
  if (amount > available) {
    return { success: false, message: 'Insufficient uncalled capital' };
  }
  
  state.fund.called += amount;
  state.fund.cashBalance += amount;
  
  // LP reactions to capital calls
  state.lps.forEach(lp => {
    lp.called += amount * (lp.amount / state.fund.commitments);
    // Frequent calls reduce satisfaction
    if (state.week - state.lastCallWeek < 4) {
      lp.satisfaction = Math.max(0, lp.satisfaction - 2);
    }
  });
  
  state.lastCallWeek = state.week;
  return { success: true, amount };
}

// Distribution waterfall
export function distributeProceeds(state: GameState, proceeds: number): void {
  const fundReturn = state.fund.distributed / state.fund.called;
  
  // European waterfall (whole fund)
  let lpShare = proceeds;
  let gpShare = 0;
  
  if (fundReturn > 1.0) {  // After return of capital
    const profit = proceeds * (fundReturn - 1.0);
    gpShare = profit * 0.20;  // 20% carry
    lpShare = proceeds - gpShare;
  }
  
  // Distribute to LPs
  state.lps.forEach(lp => {
    const lpProceeds = lpShare * (lp.amount / state.fund.commitments);
    lp.distributed += lpProceeds;
    
    // Update satisfaction based on returns
    const lpMultiple = lp.distributed / lp.called;
    if (lpMultiple > 2.5) lp.satisfaction = Math.min(100, lp.satisfaction + 10);
    else if (lpMultiple < 1.0) lp.satisfaction = Math.max(0, lp.satisfaction - 5);
  });
  
  state.fund.distributed += proceeds;
  state.firm.carriedInterest += gpShare;
}
```

### Phase 4: Enhanced Event System (Priority: MEDIUM)
**Goal**: Implement meaningful operational and market events

#### 4.1 Operational Events Implementation
```typescript
// Enhance events.ts
export function processOperationalEvent(
  state: GameState,
  event: EventCard,
  choice: number
): EventResult {
  const selected = event.choices[choice];
  const deal = state.deals.find(d => d.id === event.dealId);
  if (!deal) return { success: false };
  
  // Apply choice effects
  selected.effects.forEach(effect => {
    switch(effect.type) {
      case 'ebitda_growth':
        deal.ebitda *= (1 + effect.value);
        deal.metrics.ltmEbitda = deal.ebitda;
        break;
        
      case 'multiple_expansion':
        deal.baseMultiple += effect.value;
        break;
        
      case 'leverage_adjustment':
        deal.leverage = Math.max(0, deal.leverage + effect.value);
        checkCovenantBreach(deal, state);
        break;
        
      case 'meter_change':
        if (effect.meter === 'fragility') {
          deal.meters.fragility = clamp(deal.meters.fragility + effect.value, 0, 100);
        } else if (effect.meter === 'execution') {
          deal.meters.execution = clamp(deal.meters.execution + effect.value, 0, 100);
        } else if (effect.meter === 'momentum') {
          deal.meters.momentum = clamp(deal.meters.momentum + effect.value, 0, 100);
        }
        break;
        
      case 'reputation':
        state.firm.reputation = clamp(state.firm.reputation + effect.value, 0, 100);
        break;
        
      case 'trust':
        state.firm.trust = clamp(state.firm.trust + effect.value, 0, 100);
        break;
    }
  });
  
  // Spawn follow-up events
  if (selected.chainEvent) {
    const nextEvent = state.eventDecks[selected.chainEvent.deck]
      .find(e => e.id === selected.chainEvent.card);
    if (nextEvent) {
      state.activeEvents.push({
        card: nextEvent,
        dealId: deal.id,
        weekExpires: state.week + nextEvent.duration
      });
    }
  }
  
  return {
    success: true,
    message: selected.outcome,
    effects: selected.effects
  };
}

// Hostile takeover events
export function processHostileBid(
  state: GameState,
  event: HostileBidEvent,
  response: 'accept' | 'defend' | 'counter'
): TakeoverResult {
  const deal = state.deals.find(d => d.id === event.dealId);
  if (!deal) return { success: false };
  
  switch(response) {
    case 'accept':
      // Sell to hostile bidder
      const premium = event.premium || 1.2;
      const exitValue = deal.ebitda * deal.baseMultiple * premium;
      executeForcedExit(state, deal, exitValue);
      return {
        success: true,
        message: `Accepted hostile bid for ${deal.name} at ${premium}x premium`,
        proceeds: exitValue
      };
      
    case 'defend':
      // Implement takeover defenses
      const defenseRoll = state.prng();
      const defenseCost = deal.ebitda * 0.1; // Defense costs 10% of EBITDA
      
      state.fund.cashBalance -= defenseCost;
      deal.meters.fragility += 10; // Distraction increases fragility
      
      if (defenseRoll > 0.6) {
        // Defense successful
        return {
          success: true,
          message: `Successfully defended ${deal.name} from hostile takeover`,
          cost: defenseCost
        };
      } else {
        // Defense failed, forced to sell
        const exitValue = deal.ebitda * deal.baseMultiple * 1.1;
        executeForcedExit(state, deal, exitValue);
        return {
          success: false,
          message: `Failed to defend ${deal.name}, forced sale`,
          proceeds: exitValue
        };
      }
      
    case 'counter':
      // Launch counter-bid for aggressor's portfolio company
      const aggressorDeal = selectAggressorTarget(state, event.aggressor);
      if (aggressorDeal) {
        // Initiate auction for aggressor's asset
        state.pipeline.push({
          ...aggressorDeal,
          id: generateDealId(state),
          name: aggressorDeal.name + ' (Hostile)',
          baseMultiple: aggressorDeal.baseMultiple * 1.3
        });
        
        return {
          success: true,
          message: `Launched counter-bid for ${aggressorDeal.name}`,
          newOpportunity: aggressorDeal.id
        };
      }
      return {
        success: false,
        message: 'No suitable counter-target available'
      };
  }
}
```

### Phase 5: Portfolio Optimization (Priority: MEDIUM)
**Goal**: Add portfolio management depth

#### 5.1 Bolt-on Acquisitions
```typescript
// Add to portfolio.ts
export function generateBoltOnOpportunities(
  state: GameState,
  deal: Deal
): BoltOnOpportunity[] {
  const opportunities: BoltOnOpportunity[] = [];
  
  // Generate 1-3 bolt-on opportunities per platform
  const count = 1 + Math.floor(state.prng() * 3);
  
  for (let i = 0; i < count; i++) {
    const synergies = 0.1 + state.prng() * 0.3; // 10-40% EBITDA synergies
    const multiple = deal.baseMultiple * (0.6 + state.prng() * 0.3); // Buy at discount
    
    opportunities.push({
      id: generateId(),
      platformDealId: deal.id,
      name: generateBoltOnName(deal.sector),
      ebitda: deal.ebitda * (0.1 + state.prng() * 0.4), // 10-50% of platform size
      multiple,
      synergies,
      integrationRisk: Math.floor(state.prng() * 50),
      availableUntil: state.week + Math.floor(2 + state.prng() * 4)
    });
  }
  
  return opportunities;
}

export function executeBoltOn(
  state: GameState,
  opportunity: BoltOnOpportunity
): BoltOnResult {
  const platform = state.deals.find(d => d.id === opportunity.platformDealId);
  if (!platform) return { success: false };
  
  const cost = opportunity.ebitda * opportunity.multiple;
  
  // Check financing
  if (state.fund.cashBalance < cost * 0.3) { // Need 30% equity
    return { success: false, message: 'Insufficient cash for equity portion' };
  }
  
  // Execute acquisition
  state.fund.cashBalance -= cost * 0.3;
  platform.leverage += cost * 0.7 / platform.ebitda; // Add debt to platform
  
  // Apply synergies with integration risk
  const integrationRoll = state.prng() * 100;
  if (integrationRoll > opportunity.integrationRisk) {
    // Successful integration
    platform.ebitda *= (1 + opportunity.synergies);
    platform.meters.momentum = Math.min(100, platform.meters.momentum + 10);
    
    return {
      success: true,
      message: `Successfully acquired ${opportunity.name} with ${(opportunity.synergies*100).toFixed(0)}% synergies`,
      newEbitda: platform.ebitda
    };
  } else {
    // Integration challenges
    platform.ebitda *= (1 + opportunity.synergies * 0.3); // Only 30% of synergies
    platform.meters.fragility += 15;
    platform.meters.execution -= 10;
    
    return {
      success: true,
      message: `Integration challenges with ${opportunity.name}, limited synergies realized`,
      newEbitda: platform.ebitda
    };
  }
}
```

### Phase 6: Advanced Features (Priority: LOW)
**Goal**: Polish and depth

#### 6.1 Working Capital Optimization
```typescript
interface WorkingCapitalAction {
  type: 'aggressive' | 'neutral' | 'conservative';
  impact: {
    cashGeneration: number;  // One-time cash
    ebitdaImpact: number;    // Ongoing EBITDA impact
    fragilityImpact: number; // Risk increase
  };
}

export function optimizeWorkingCapital(
  deal: Deal,
  action: WorkingCapitalAction
): void {
  switch(action.type) {
    case 'aggressive':
      // Stretch payables, accelerate receivables
      deal.cashPosition += deal.revenue * 0.05; // 5% of revenue as cash
      deal.meters.fragility += 20; // Supplier relationships stressed
      break;
      
    case 'conservative':
      // Improve supplier terms
      deal.cashPosition -= deal.revenue * 0.02;
      deal.meters.fragility -= 10;
      deal.meters.execution += 5;
      break;
  }
}
```

#### 6.2 Management Incentive Plans
```typescript
interface ManagementIncentive {
  vestingSchedule: number[];  // Quarters
  performanceTargets: {
    ebitdaGrowth: number;
    exitMultiple: number;
  };
  alignment: number;  // 0-100 management alignment
}

export function implementMIP(
  deal: Deal,
  plan: ManagementIncentive
): void {
  deal.managementPlan = plan;
  
  // Better alignment improves execution
  deal.meters.execution += plan.alignment / 4;
  
  // But dilutes returns
  deal.equityOwnership *= (1 - plan.equityPool);
}
```

## Implementation Schedule

### Week 1: Foundation
- [ ] Implement pipeline regeneration
- [ ] Fix deal performance calculations
- [ ] Update fund metrics properly
- [ ] Test deterministic PRNG

### Week 2: Exit Mechanics
- [ ] Build exit opportunity generation
- [ ] Implement exit execution
- [ ] Add exit UI components
- [ ] Test exit scenarios

### Week 3: LP Mechanics
- [ ] Create fund lifecycle system
- [ ] Implement capital calls
- [ ] Build distribution waterfall
- [ ] Add fundraising cycles

### Week 4: Events & Portfolio
- [ ] Enhance operational events
- [ ] Implement hostile takeovers
- [ ] Add bolt-on acquisitions
- [ ] Create working capital optimization

### Week 5: Polish & Testing
- [ ] Achievement system
- [ ] Tutorial implementation
- [ ] Balance testing
- [ ] Performance optimization

## Testing Strategy

### Unit Tests
```typescript
describe('Game Mechanics', () => {
  test('Pipeline regeneration maintains minimum deals', () => {
    const state = initGameState();
    state.pipeline = [];
    weeklyPipelineRefresh(state);
    expect(state.pipeline.length).toBeGreaterThanOrEqual(3);
  });
  
  test('Exit multiples reflect market conditions', () => {
    const state = initGameState();
    state.kpis.M = 1.5; // Hot market
    const opportunities = generateExitOpportunities(state);
    expect(opportunities[0].multiple).toBeGreaterThan(state.deals[0].baseMultiple);
  });
  
  test('Fund metrics update correctly', () => {
    const state = initGameState();
    const deal = state.deals[0];
    deal.exited = true;
    deal.exitMultiple = 2.0;
    updateFundMetrics(state);
    expect(state.fund.DPI).toBeGreaterThan(0);
  });
});
```

### Integration Tests
- Full game loop simulation
- Multi-quarter scenarios
- Edge case handling

### Balance Tests
- Difficulty curve validation
- Economic model calibration
- Risk/reward ratios

## Success Metrics

1. **Gameplay Flow**: Smooth progression from deal sourcing → execution → exit
2. **Strategic Depth**: Multiple viable strategies for success
3. **Risk/Reward**: Meaningful consequences for decisions
4. **Replayability**: Different outcomes from same seed based on player choices
5. **Performance**: <100ms response time for all actions

## Risk Mitigation

1. **Save System**: Implement auto-save every week
2. **Validation**: Input validation for all player actions
3. **Rollback**: State history for undo functionality
4. **Telemetry**: Anonymous gameplay analytics for balancing

## Conclusion

This implementation plan provides a roadmap for transforming the EBITDA skeleton into a fully-functional private equity simulation. The phased approach ensures that critical features are implemented first, while maintaining code quality and game balance throughout development.