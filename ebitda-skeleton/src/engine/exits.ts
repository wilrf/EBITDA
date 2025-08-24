import type { Deal, GameState, ExitOpportunity } from './types'
import type { PRNG } from './prng'

export interface ExitResult {
  success: boolean
  proceeds?: number
  multiple?: number
  type?: 'strategic' | 'sponsor' | 'ipo'
  buyer?: string
}

/**
 * Generate exit opportunities for portfolio companies
 */
export function generateExitOpportunity(
  prng: PRNG,
  deal: Deal,
  currentDay: number,
  macroConditions: { M: number; R: number }
): ExitOpportunity | null {
  const holdingPeriodDays = currentDay - (deal.entryDay || 0)
  
  // Only generate exits for deals held longer than 1 year
  if (holdingPeriodDays < 365) return null
  
  // Base probability increases with holding period
  const baseProbability = Math.min(0.15 + (holdingPeriodDays - 365) * 0.0001, 0.35)
  
  // Adjust for macro conditions
  const macroProbability = baseProbability * (1 + macroConditions.M * 0.1)
  
  if (prng.next() > macroProbability) return null
  
  // Determine exit type
  const exitTypeRoll = prng.next()
  let exitType: 'strategic' | 'sponsor' | 'ipo'
  let baseMultiple: number
  
  if (exitTypeRoll < 0.15) {
    exitType = 'ipo'
    baseMultiple = deal.baseMultiple * (1.2 + prng.range(0, 0.8)) // 1.2x - 2.0x base
  } else if (exitTypeRoll < 0.6) {
    exitType = 'sponsor'
    baseMultiple = deal.baseMultiple * (1.0 + prng.range(0, 0.6)) // 1.0x - 1.6x base
  } else {
    exitType = 'strategic'
    baseMultiple = deal.baseMultiple * (1.1 + prng.range(0, 0.9)) // 1.1x - 2.0x base
  }
  
  // Adjust multiple based on company performance
  const executionMultiplier = 0.8 + (deal.meters.execution / 100) * 0.4
  const momentumMultiplier = 0.9 + (deal.meters.momentum / 100) * 0.2
  
  const finalMultiple = baseMultiple * executionMultiplier * momentumMultiplier
  
  // Calculate success probability
  const successProbability = Math.min(
    0.6 + (deal.meters.execution / 200) + (deal.meters.momentum / 300) - (deal.meters.fragility / 200),
    0.95
  )
  
  return {
    id: `exit_${deal.id}_${currentDay}`,
    type: exitType,
    multiple: finalMultiple,
    probability: successProbability,
    expiresOnDay: currentDay + 28, // 4 weeks to decide
    buyer: generateBuyerName(prng, exitType)
  }
}

/**
 * Execute an exit attempt
 */
export function executeExit(
  prng: PRNG,
  deal: Deal,
  opportunity: ExitOpportunity
): ExitResult {
  const success = prng.next() < opportunity.probability
  
  if (!success) {
    return { success: false }
  }
  
  // Calculate proceeds based on invested capital and current value
  const investedCapital = deal.metrics.ebitda * deal.entryMultiple
  const currentValue = deal.metrics.ebitda * opportunity.multiple
  
  return {
    success: true,
    proceeds: currentValue,
    multiple: opportunity.multiple,
    type: opportunity.type,
    buyer: opportunity.buyer
  }
}

/**
 * Calculate deal performance metrics
 */
export function calculateDealPerformance(
  deal: Deal,
  currentDay: number,
  currentEbitdaMultiple?: number
): {
  currentValue: number
  moic: number
  irr: number
  holdingPeriodDays: number
} {
  const investedCapital = deal.metrics.ebitda * deal.entryMultiple
  const holdingPeriodDays = currentDay - (deal.entryDay || 0)
  
  // Use provided multiple or estimate based on performance
  const multiple = currentEbitdaMultiple || estimateCurrentMultiple(deal, holdingPeriodDays)
  const currentValue = deal.metrics.ebitda * multiple
  
  const moic = currentValue / investedCapital
  
  // Calculate IRR (annualized return)
  const holdingPeriodYears = holdingPeriodDays / 365
  const irr = holdingPeriodYears > 0 ? Math.pow(moic, 1 / holdingPeriodYears) - 1 : 0
  
  return {
    currentValue,
    moic,
    irr,
    holdingPeriodDays
  }
}

/**
 * Estimate current multiple based on company performance
 */
function estimateCurrentMultiple(deal: Deal, holdingPeriodDays: number): number {
  const baseGrowth = 0.08 // 8% annual growth
  const executionBonus = (deal.meters.execution - 50) * 0.001 // +/- execution impact
  const momentumBonus = (deal.meters.momentum - 50) * 0.0005 // +/- momentum impact
  const fragilityPenalty = (deal.meters.fragility - 50) * 0.0008 // fragility penalty
  
  const totalGrowthRate = baseGrowth + executionBonus + momentumBonus - fragilityPenalty
  const holdingPeriodYears = holdingPeriodDays / 365
  
  return deal.entryMultiple * Math.pow(1 + totalGrowthRate, holdingPeriodYears)
}

/**
 * Generate buyer name based on exit type
 */
function generateBuyerName(prng: PRNG, exitType: 'strategic' | 'sponsor' | 'ipo'): string {
  if (exitType === 'ipo') {
    return 'Public Markets'
  }
  
  const strategicBuyers = [
    'MegaCorp Industries', 'Global Solutions Inc', 'Strategic Dynamics', 
    'Industry Leader Corp', 'Market Dominance LLC', 'Synergy Holdings',
    'Vertical Integration Co', 'Platform Expansion Inc'
  ]
  
  const sponsorBuyers = [
    'Apollo Management', 'Blackstone Capital', 'KKR Partners',
    'Carlyle Group', 'TPG Capital', 'Bain Capital', 'Silver Lake',
    'Vista Equity', 'Warburg Pincus', 'General Atlantic'
  ]
  
  const buyers = exitType === 'strategic' ? strategicBuyers : sponsorBuyers
  return prng.pick(buyers)
}

/**
 * Update pipeline with fresh deals to maintain 3-8 deals
 */
export function regeneratePipeline(
  prng: PRNG,
  currentPipeline: Deal[],
  currentDay: number,
  macroConditions: { M: number; R: number; baseSectorMultiple: Record<string, number> },
  targetCount: number = 6
): Deal[] {
  const newPipeline = [...currentPipeline]
  
  // Remove stale deals (older than 4 weeks)
  const cutoffDay = currentDay - 28
  const freshDeals = newPipeline.filter(deal => (deal.generatedDay || 0) > cutoffDay)
  
  // Generate new deals to reach target count
  const sectors = Object.keys(macroConditions.baseSectorMultiple)
  const dealsToGenerate = Math.max(0, targetCount - freshDeals.length)
  
  for (let i = 0; i < dealsToGenerate; i++) {
    const sector = prng.pick(sectors)
    const sectorMultiple = macroConditions.baseSectorMultiple[sector] || 7.5
    
    // Vary deal parameters
    const ebitdaVariation = prng.range(0.7, 2.0)
    const multipleVariation = prng.range(0.9, 1.2)
    
    const newDeal: Deal = {
      id: `P${currentDay}_${i}`,
      name: generateDealName(prng, sector),
      sector,
      baseMultiple: sectorMultiple * multipleVariation,
      entryMultiple: sectorMultiple * multipleVariation,
      leverage: 3.5 + prng.range(0, 2.0),
      covenants: { 
        Lmax: 5.0 + prng.range(0, 2.0), 
        Imin: 1.8 + prng.range(-0.3, 0.7) 
      },
      public: prng.next() < 0.15, // 15% public deals
      metrics: { 
        ebitda: Math.round(5_000_000 + 20_000_000 * ebitdaVariation),
        revenue: Math.round((5_000_000 + 20_000_000 * ebitdaVariation) * prng.range(8, 15))
      },
      meters: { 
        fragility: Math.round(30 + prng.range(0, 40)), 
        execution: Math.round(40 + prng.range(0, 40)), 
        momentum: Math.round(40 + prng.range(0, 40))
      },
      generatedDay: currentDay
    }
    
    freshDeals.push(newDeal)
  }
  
  return freshDeals
}

/**
 * Generate realistic deal names
 */
function generateDealName(prng: PRNG, sector: string): string {
  const prefixes = ['Advanced', 'Global', 'Premier', 'Integrated', 'Dynamic', 'Strategic', 'Leading', 'Superior']
  const suffixes = ['Solutions', 'Systems', 'Technologies', 'Services', 'Group', 'Corporation', 'Industries', 'Enterprises']
  
  const sectorTerms: Record<string, string[]> = {
    technology: ['Tech', 'Data', 'Software', 'Digital', 'Cloud', 'Cyber'],
    healthcare: ['Medical', 'Health', 'Care', 'Pharma', 'Bio', 'Clinical'],
    manufacturing: ['Industrial', 'Manufacturing', 'Production', 'Assembly'],
    retail: ['Retail', 'Consumer', 'Commerce', 'Distribution'],
    services: ['Professional', 'Business', 'Consulting', 'Advisory']
  }
  
  const prefix = prng.pick(prefixes)
  const suffix = prng.pick(suffixes)
  const sectorTerm = prng.pick(sectorTerms[sector] || ['Business'])
  
  return `${prefix} ${sectorTerm} ${suffix}`
}