import type { Deal, GameState } from './types'
import type { PRNG } from './prng'

export interface BoltOnOpportunity {
  id: string
  target: string
  cost: number
  synergies: number
  executionRisk: number
  dealId: string
  expiresOnDay: number
}

export interface WorkingCapitalOptimization {
  id: string
  type: 'inventory' | 'receivables' | 'payables' | 'cash_mgmt'
  potential: number
  implementationCost: number
  timeframe: number
  dealId: string
}

export interface PortfolioInitiative {
  id: string
  name: string
  type: 'cost_reduction' | 'revenue_growth' | 'margin_expansion' | 'digitization'
  investment: number
  expectedReturn: number
  duration: number
  status: 'planning' | 'executing' | 'completed'
  dealId: string
  startDay: number
}

/**
 * Generate bolt-on acquisition opportunities
 */
export function generateBoltOnOpportunity(
  prng: PRNG,
  deal: Deal,
  currentDay: number
): BoltOnOpportunity | null {
  // Only generate bolt-ons for deals held longer than 6 months
  const holdingPeriod = currentDay - (deal.entryDay || 0)
  if (holdingPeriod < 180) return null
  
  // Base probability of 5% per quarter
  if (prng.next() > 0.05) return null
  
  const targetNames = [
    'Regional Competitor',
    'Complementary Services Co',
    'Tech Enabler Inc',
    'Supply Chain Partner',
    'Customer Base Expansion',
    'Geographic Extension',
    'Adjacent Market Player'
  ]
  
  const targetName = prng.pick(targetNames)
  const cost = deal.metrics.ebitda * (0.3 + prng.range(0, 0.7)) // 0.3x - 1.0x EBITDA
  const synergies = cost * (0.15 + prng.range(0, 0.25)) // 15-40% synergies
  const executionRisk = 20 + prng.range(0, 60) // 20-80% execution risk
  
  return {
    id: `bolton_${deal.id}_${currentDay}`,
    target: targetName,
    cost,
    synergies,
    executionRisk,
    dealId: deal.id,
    expiresOnDay: currentDay + 42 // 6 weeks to decide
  }
}

/**
 * Execute a bolt-on acquisition
 */
export function executeBoltOn(
  prng: PRNG,
  opportunity: BoltOnOpportunity,
  fund: { cash: number; undrawn: number }
): { success: boolean; actualSynergies?: number; cost: number } {
  // Check if we have enough capital
  const totalAvailable = fund.cash + fund.undrawn
  if (totalAvailable < opportunity.cost) {
    return { success: false, cost: 0 }
  }
  
  // Success probability based on execution risk
  const successProbability = 1 - (opportunity.executionRisk / 100)
  const success = prng.next() < successProbability
  
  if (!success) {
    return { success: false, cost: opportunity.cost }
  }
  
  // Calculate actual synergies (with some variance)
  const synergyVariance = 0.7 + prng.range(0, 0.6) // 70% - 130% of expected
  const actualSynergies = opportunity.synergies * synergyVariance
  
  return {
    success: true,
    actualSynergies,
    cost: opportunity.cost
  }
}

/**
 * Generate working capital optimization opportunities
 */
export function generateWorkingCapitalOptimization(
  prng: PRNG,
  deal: Deal,
  currentDay: number
): WorkingCapitalOptimization[] {
  const opportunities: WorkingCapitalOptimization[] = []
  
  // Only for deals held > 3 months
  if (currentDay - (deal.entryDay || 0) < 90) return opportunities
  
  const types: ('inventory' | 'receivables' | 'payables' | 'cash_mgmt')[] = 
    ['inventory', 'receivables', 'payables', 'cash_mgmt']
  
  types.forEach(type => {
    if (prng.next() < 0.3) { // 30% chance for each type
      const potential = deal.metrics.revenue * (0.01 + prng.range(0, 0.04)) // 1-5% of revenue
      const implementationCost = potential * (0.1 + prng.range(0, 0.2)) // 10-30% of potential
      const timeframe = 60 + prng.range(0, 120) // 2-6 months
      
      opportunities.push({
        id: `wc_${type}_${deal.id}_${currentDay}`,
        type,
        potential,
        implementationCost,
        timeframe,
        dealId: deal.id
      })
    }
  })
  
  return opportunities
}

/**
 * Implement working capital optimization
 */
export function implementWorkingCapitalOptimization(
  prng: PRNG,
  optimization: WorkingCapitalOptimization
): { success: boolean; actualBenefit?: number } {
  // Success probability varies by type
  const successProbabilities = {
    inventory: 0.8,
    receivables: 0.85,
    payables: 0.9,
    cash_mgmt: 0.75
  }
  
  const success = prng.next() < successProbabilities[optimization.type]
  
  if (!success) return { success: false }
  
  // Actual benefit varies from 70% to 120% of potential
  const variance = 0.7 + prng.range(0, 0.5)
  const actualBenefit = optimization.potential * variance
  
  return { success: true, actualBenefit }
}

/**
 * Generate portfolio company improvement initiatives
 */
export function generatePortfolioInitiatives(
  prng: PRNG,
  deal: Deal,
  currentDay: number
): PortfolioInitiative[] {
  const initiatives: PortfolioInitiative[] = []
  
  // Only for deals held > 1 month
  if (currentDay - (deal.entryDay || 0) < 30) return initiatives
  
  const initiativeTypes: {
    type: 'cost_reduction' | 'revenue_growth' | 'margin_expansion' | 'digitization'
    probability: number
    names: string[]
  }[] = [
    {
      type: 'cost_reduction',
      probability: 0.4,
      names: ['Procurement Optimization', 'Facility Consolidation', 'Process Automation', 'Overhead Reduction']
    },
    {
      type: 'revenue_growth',
      probability: 0.35,
      names: ['Sales Force Expansion', 'New Product Launch', 'Market Expansion', 'Customer Acquisition']
    },
    {
      type: 'margin_expansion',
      probability: 0.3,
      names: ['Pricing Optimization', 'Mix Improvement', 'Premium Service Launch', 'Value Engineering']
    },
    {
      type: 'digitization',
      probability: 0.25,
      names: ['ERP Implementation', 'Customer Portal', 'Digital Marketing', 'Analytics Platform']
    }
  ]
  
  initiativeTypes.forEach(({ type, probability, names }) => {
    if (prng.next() < probability) {
      const name = prng.pick(names)
      const baseInvestment = deal.metrics.ebitda * (0.1 + prng.range(0, 0.3)) // 10-40% of EBITDA
      const expectedReturn = baseInvestment * (1.5 + prng.range(0, 2.0)) // 1.5x - 3.5x return
      const duration = 90 + prng.range(0, 270) // 3-12 months
      
      initiatives.push({
        id: `init_${type}_${deal.id}_${currentDay}`,
        name,
        type,
        investment: baseInvestment,
        expectedReturn,
        duration,
        status: 'planning',
        dealId: deal.id,
        startDay: currentDay
      })
    }
  })
  
  return initiatives
}

/**
 * Execute a portfolio initiative
 */
export function executePortfolioInitiative(
  prng: PRNG,
  initiative: PortfolioInitiative,
  deal: Deal
): { success: boolean; actualReturn?: number; impactOnMeters?: Partial<Deal['meters']> } {
  // Success probability based on deal execution capability and initiative type
  const baseSuccess = {
    cost_reduction: 0.8,
    revenue_growth: 0.6,
    margin_expansion: 0.7,
    digitization: 0.5
  }[initiative.type]
  
  const executionBonus = (deal.meters.execution - 50) * 0.004 // +/- 20% based on execution
  const successProbability = Math.max(0.1, Math.min(0.95, baseSuccess + executionBonus))
  
  const success = prng.next() < successProbability
  
  if (!success) {
    return { 
      success: false, 
      impactOnMeters: { fragility: deal.meters.fragility + 5 } // Failed initiatives increase fragility
    }
  }
  
  // Calculate actual return with variance
  const variance = 0.5 + prng.range(0, 1.0) // 50% - 150% of expected
  const actualReturn = initiative.expectedReturn * variance
  
  // Impact on company meters
  const meterImpact: Partial<Deal['meters']> = {}
  
  switch (initiative.type) {
    case 'cost_reduction':
      meterImpact.fragility = Math.max(0, deal.meters.fragility - 3)
      meterImpact.execution = Math.min(100, deal.meters.execution + 2)
      break
    case 'revenue_growth':
      meterImpact.momentum = Math.min(100, deal.meters.momentum + 5)
      meterImpact.execution = Math.min(100, deal.meters.execution + 1)
      break
    case 'margin_expansion':
      meterImpact.momentum = Math.min(100, deal.meters.momentum + 3)
      meterImpact.fragility = Math.max(0, deal.meters.fragility - 2)
      break
    case 'digitization':
      meterImpact.execution = Math.min(100, deal.meters.execution + 4)
      meterImpact.momentum = Math.min(100, deal.meters.momentum + 2)
      break
  }
  
  return {
    success: true,
    actualReturn,
    impactOnMeters: meterImpact
  }
}

/**
 * Update portfolio company performance over time
 */
export function updatePortfolioPerformance(
  prng: PRNG,
  deals: Deal[],
  macroConditions: { M: number; R: number }
): Deal[] {
  return deals.map(deal => {
    // Base drift in company performance
    const executionDrift = prng.range(-1, 2) // Slight upward bias
    const momentumDrift = prng.range(-2, 2) * (1 + macroConditions.M * 0.3) // Macro-sensitive
    const fragilityDrift = prng.range(-1, 1) + macroConditions.R * 2 // Risk-sensitive
    
    const updatedMeters = {
      execution: Math.max(0, Math.min(100, deal.meters.execution + executionDrift)),
      momentum: Math.max(0, Math.min(100, deal.meters.momentum + momentumDrift)),
      fragility: Math.max(0, Math.min(100, deal.meters.fragility + fragilityDrift))
    }
    
    // Update financial metrics based on performance
    const performanceMultiplier = (updatedMeters.execution + updatedMeters.momentum - updatedMeters.fragility) / 150
    const growthRate = 0.02 + performanceMultiplier * 0.04 // 2-6% quarterly growth
    
    return {
      ...deal,
      meters: updatedMeters,
      metrics: {
        ...deal.metrics,
        ebitda: deal.metrics.ebitda * (1 + growthRate),
        revenue: deal.metrics.revenue * (1 + growthRate * 1.2) // Revenue grows slightly faster
      }
    }
  })
}

/**
 * Calculate portfolio-level metrics
 */
export function calculatePortfolioMetrics(
  deals: Deal[],
  currentDay: number
): {
  totalInvestedCapital: number
  totalCurrentValue: number
  weightedAvgMOIC: number
  weightedAvgIRR: number
  avgHoldingPeriod: number
} {
  if (deals.length === 0) {
    return {
      totalInvestedCapital: 0,
      totalCurrentValue: 0,
      weightedAvgMOIC: 1,
      weightedAvgIRR: 0,
      avgHoldingPeriod: 0
    }
  }
  
  let totalInvestedCapital = 0
  let totalCurrentValue = 0
  let weightedMOICSum = 0
  let weightedIRRSum = 0
  let totalHoldingPeriod = 0
  
  deals.forEach(deal => {
    const investedCapital = deal.metrics.ebitda * deal.entryMultiple
    const currentValue = deal.metrics.ebitda * deal.baseMultiple // Simplified current valuation
    const holdingPeriod = currentDay - (deal.entryDay || 0)
    
    totalInvestedCapital += investedCapital
    totalCurrentValue += currentValue
    totalHoldingPeriod += holdingPeriod
    
    const moic = currentValue / investedCapital
    const irr = holdingPeriod > 0 ? Math.pow(moic, 365 / holdingPeriod) - 1 : 0
    
    weightedMOICSum += moic * investedCapital
    weightedIRRSum += irr * investedCapital
  })
  
  return {
    totalInvestedCapital,
    totalCurrentValue,
    weightedAvgMOIC: totalInvestedCapital > 0 ? weightedMOICSum / totalInvestedCapital : 1,
    weightedAvgIRR: totalInvestedCapital > 0 ? weightedIRRSum / totalInvestedCapital : 0,
    avgHoldingPeriod: totalHoldingPeriod / deals.length
  }
}