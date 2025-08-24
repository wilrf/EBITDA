import type { ActiveEvent, EventDeck, GameState, Deal, Firm, Fund, EventChoice } from './types'
import { PRNG } from './prng'

// Enhanced event processing interfaces
export interface OperationalEvent {
  id: string
  dealId: string
  type: 'cyber_attack' | 'labor_dispute' | 'supply_chain' | 'regulatory_change' | 'market_disruption'
  severity: 'low' | 'medium' | 'high' | 'critical'
  impactAreas: ('revenue' | 'costs' | 'reputation' | 'execution' | 'fragility')[]
  effects: Record<string, number>
  duration: number
  resolutionCost?: number
}

export interface HostileTakeoverEvent {
  id: string
  targetDealId: string
  bidder: string
  bidMultiple: number
  defenseCost: number
  successProbability: number
  reputationRisk: number
}

export interface EventEffect {
  target: 'firm' | 'fund' | 'deal'
  property: string
  change: number
  duration?: number // permanent if undefined
}

export function spawnEventFromDeck(state: GameState, deck: EventDeck, eventId: string, dealId?: string) {
  const card = deck.events.find(e => e.id === eventId)
  if (!card) return
  state.activeEvents.push({
    id: `${eventId}_${state.day}`,
    card,
    endsOnDay: state.day + card.timer_days,
    dealId
  })
}

export function advanceEvents(state: GameState) {
  // Process expiring events with final effects
  const expiringEvents = state.activeEvents.filter(ev => ev.endsOnDay <= state.day)
  
  for (const event of expiringEvents) {
    processEventExpiration(state, event)
  }
  
  // Remove expired events
  state.activeEvents = state.activeEvents.filter(ev => ev.endsOnDay > state.day)
}

export function processEventChoice(
  prng: PRNG, 
  state: GameState, 
  eventId: string, 
  choiceId: string
): boolean {
  const event = state.activeEvents.find(e => e.id === eventId)
  if (!event) return false
  
  const choice = event.card.choices.find(c => c.id === choiceId)
  if (!choice) return false
  
  // Check requirements
  if (choice.reqs && !checkEventRequirements(state, choice.reqs, event.dealId)) {
    return false
  }
  
  // Apply effects
  if (choice.effects) {
    applyEventEffects(state, choice.effects, event.dealId)
  }
  
  // Spawn follow-up event if specified
  if (choice.spawn_event) {
    // Find appropriate deck (simplified - would need deck context)
    // spawnEventFromDeck(state, deck, choice.spawn_event, event.dealId)
  }
  
  // Remove the event after choice is made
  state.activeEvents = state.activeEvents.filter(e => e.id !== eventId)
  
  return true
}

export function generateOperationalEvent(
  prng: PRNG, 
  deal: Deal, 
  currentDay: number,
  macroRisk: number
): OperationalEvent | null {
  const eventTypes = ['cyber_attack', 'labor_dispute', 'supply_chain', 'regulatory_change', 'market_disruption'] as const
  const severityLevels = ['low', 'medium', 'high', 'critical'] as const
  
  // Higher macro risk increases event probability and severity
  const baseProbability = 0.05 + (macroRisk * 0.02)
  if (prng.next() > baseProbability) return null
  
  const type = eventTypes[Math.floor(prng.next() * eventTypes.length)]
  const severityRoll = prng.next() + (macroRisk * 0.1)
  let severity: typeof severityLevels[number]
  
  if (severityRoll < 0.4) severity = 'low'
  else if (severityRoll < 0.7) severity = 'medium'
  else if (severityRoll < 0.9) severity = 'high'
  else severity = 'critical'
  
  const effects: Record<string, number> = {}
  const impactAreas: ('revenue' | 'costs' | 'reputation' | 'execution' | 'fragility')[] = []
  
  // Define type-specific impacts
  switch (type) {
    case 'cyber_attack':
      impactAreas.push('costs', 'reputation', 'execution')
      effects.costs = -(severity === 'low' ? 0.02 : severity === 'medium' ? 0.05 : severity === 'high' ? 0.1 : 0.2)
      effects.reputation = -(severity === 'low' ? 2 : severity === 'medium' ? 5 : severity === 'high' ? 10 : 20)
      effects.execution = -(severity === 'low' ? 5 : severity === 'medium' ? 10 : severity === 'high' ? 20 : 30)
      break
      
    case 'labor_dispute':
      impactAreas.push('costs', 'execution', 'fragility')
      effects.costs = -(severity === 'low' ? 0.01 : severity === 'medium' ? 0.03 : severity === 'high' ? 0.08 : 0.15)
      effects.execution = -(severity === 'low' ? 3 : severity === 'medium' ? 8 : severity === 'high' ? 15 : 25)
      effects.fragility = (severity === 'low' ? 2 : severity === 'medium' ? 5 : severity === 'high' ? 10 : 20)
      break
      
    case 'supply_chain':
      impactAreas.push('revenue', 'costs', 'fragility')
      effects.revenue = -(severity === 'low' ? 0.01 : severity === 'medium' ? 0.03 : severity === 'high' ? 0.07 : 0.12)
      effects.costs = -(severity === 'low' ? 0.005 : severity === 'medium' ? 0.02 : severity === 'high' ? 0.05 : 0.1)
      effects.fragility = (severity === 'low' ? 3 : severity === 'medium' ? 7 : severity === 'high' ? 12 : 20)
      break
      
    case 'regulatory_change':
      impactAreas.push('costs', 'execution')
      effects.costs = -(severity === 'low' ? 0.005 : severity === 'medium' ? 0.02 : severity === 'high' ? 0.06 : 0.12)
      effects.execution = -(severity === 'low' ? 2 : severity === 'medium' ? 6 : severity === 'high' ? 12 : 20)
      break
      
    case 'market_disruption':
      impactAreas.push('revenue', 'fragility')
      effects.revenue = -(severity === 'low' ? 0.02 : severity === 'medium' ? 0.05 : severity === 'high' ? 0.1 : 0.2)
      effects.fragility = (severity === 'low' ? 5 : severity === 'medium' ? 10 : severity === 'high' ? 18 : 30)
      break
  }
  
  return {
    id: `op_${type}_${currentDay}`,
    dealId: deal.id,
    type,
    severity,
    impactAreas,
    effects,
    duration: severity === 'low' ? 30 : severity === 'medium' ? 60 : severity === 'high' ? 120 : 180,
    resolutionCost: deal.metrics.ebitda * Math.abs(effects.costs || 0) * 0.5
  }
}

export function generateHostileTakeoverEvent(
  prng: PRNG,
  deal: Deal,
  currentDay: number,
  macroHeat: number
): HostileTakeoverEvent | null {
  // Only target public companies or companies in hot sectors
  if (!deal.public && macroHeat < 0.7) return null
  
  // Base probability increases with macro heat and deal momentum
  const baseProbability = 0.02 + (macroHeat * 0.03) + (deal.meters.momentum / 100 * 0.02)
  if (prng.next() > baseProbability) return null
  
  const bidders = ['KKR', 'Blackstone', 'Apollo', 'Carlyle', 'TPG', 'Bain Capital', 'Strategic Buyer']
  const bidder = bidders[Math.floor(prng.next() * bidders.length)]
  
  // Hostile bid typically at 20-40% premium
  const premiumRange = 0.2 + (prng.next() * 0.2)
  const bidMultiple = deal.entryMultiple * (1 + premiumRange)
  
  const successProbability = 0.3 + (macroHeat * 0.2) + (deal.meters.fragility / 100 * 0.3)
  const defenseCost = deal.metrics.ebitda * 0.1 // 10% of EBITDA for defense
  const reputationRisk = 5 + (prng.next() * 10) // 5-15 reputation points at risk
  
  return {
    id: `hostile_${deal.id}_${currentDay}`,
    targetDealId: deal.id,
    bidder,
    bidMultiple,
    defenseCost,
    successProbability: Math.min(successProbability, 0.8), // Cap at 80%
    reputationRisk
  }
}

export function processOperationalEvent(
  state: GameState,
  event: OperationalEvent
): void {
  const deal = state.deals.find(d => d.id === event.dealId)
  if (!deal) return
  
  // Apply effects to deal
  for (const [effect, value] of Object.entries(event.effects)) {
    switch (effect) {
      case 'revenue':
        deal.metrics.revenue *= (1 + value)
        break
      case 'costs':
        // Costs reduce EBITDA
        deal.metrics.ebitda *= (1 + value)
        break
      case 'execution':
        deal.meters.execution = Math.max(0, Math.min(100, deal.meters.execution + value))
        break
      case 'fragility':
        deal.meters.fragility = Math.max(0, Math.min(100, deal.meters.fragility + value))
        break
      case 'reputation':
        state.firm.reputation = Math.max(0, Math.min(100, state.firm.reputation + value))
        break
    }
  }
}

export function resolveOperationalEvent(
  state: GameState,
  eventId: string,
  spendMoney: boolean = false
): boolean {
  const operationalEvents = state.activeEvents.filter(e => 
    e.id.startsWith('op_') && e.id === eventId
  )
  
  if (operationalEvents.length === 0) return false
  
  // If spending money to resolve, remove negative effects but at a cost
  if (spendMoney) {
    const event = operationalEvents[0]
    if (event.dealId) {
      // Parse the stored operational event data (would need proper storage)
      // For now, assume we can reverse some negative effects
      const deal = state.deals.find(d => d.id === event.dealId)
      if (deal) {
        // Partial reversal at significant cost
        deal.meters.execution = Math.min(100, deal.meters.execution + 10)
        deal.meters.fragility = Math.max(0, deal.meters.fragility - 5)
        state.fund.cash -= 5_000_000 // $5M resolution cost
      }
    }
  }
  
  // Remove the event
  state.activeEvents = state.activeEvents.filter(e => e.id !== eventId)
  return true
}

function processEventExpiration(state: GameState, event: ActiveEvent): void {
  // Apply any final effects when events expire
  if (event.card.touches?.includes('reputation')) {
    // Example: unresolved events might have reputation consequences
    state.firm.reputation = Math.max(0, state.firm.reputation - 1)
  }
}

function checkEventRequirements(
  state: GameState, 
  requirements: Record<string, any>, 
  dealId?: string
): boolean {
  // Check various requirements like firm stats, deal conditions, etc.
  for (const [req, value] of Object.entries(requirements)) {
    switch (req) {
      case 'min_reputation':
        if (state.firm.reputation < value) return false
        break
      case 'min_cash':
        if (state.fund.cash < value) return false
        break
      case 'min_ops_capacity':
        if (state.firm.opsCapacity < value) return false
        break
      // Add more requirement checks as needed
    }
  }
  return true
}

function applyEventEffects(
  state: GameState, 
  effects: Record<string, any>, 
  dealId?: string
): void {
  for (const [effect, value] of Object.entries(effects)) {
    switch (effect) {
      case 'reputation_change':
        state.firm.reputation = Math.max(0, Math.min(100, state.firm.reputation + value))
        break
      case 'lender_trust_change':
        state.firm.lenderTrust = Math.max(0, Math.min(100, state.firm.lenderTrust + value))
        break
      case 'lp_trust_change':
        state.firm.lpTrust = Math.max(0, Math.min(100, state.firm.lpTrust + value))
        break
      case 'cash_change':
        state.fund.cash += value
        break
      // Deal-specific effects
      case 'deal_execution_change':
        if (dealId) {
          const deal = state.deals.find(d => d.id === dealId)
          if (deal) {
            deal.meters.execution = Math.max(0, Math.min(100, deal.meters.execution + value))
          }
        }
        break
      // Add more effect types as needed
    }
  }
}