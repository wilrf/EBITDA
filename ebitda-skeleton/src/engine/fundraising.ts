import type { Fund, LPPersona, CapitalCall, Distribution, FundPhase } from './types'
import type { PRNG } from './prng'

export interface LPCommitment {
  lpId: string
  persona: LPPersona
  commitment: number
  unfunded: number
  satisfaction: number
  lastInteraction: number
}

export interface FundraisingResult {
  success: boolean
  newCommitments?: LPCommitment[]
  totalCommitted?: number
  fundraisingCosts?: number
}

export interface WaterfallDistribution {
  lpId: string
  distribution: number
  type: 'preferred_return' | 'return_of_capital' | 'carry' | 'excess_return'
}

/**
 * Determine fund phase based on metrics and age
 */
export function determineFundPhase(
  fund: Fund,
  currentDay: number,
  fundStartDay: number = 0
): FundPhase {
  const fundAge = currentDay - fundStartDay
  const deploymentRatio = (fund.size - fund.undrawn) / fund.size
  
  // Investing phase: First 5-7 years, deploying capital
  if (fundAge < 1825 && deploymentRatio < 0.85) { // 5 years
    return {
      phase: 'investing',
      startDay: fundStartDay,
      endDay: fundStartDay + 2555 // ~7 years
    }
  }
  
  // Harvesting phase: Years 5-12, holding and exiting
  if (fundAge < 4380) { // 12 years
    return {
      phase: 'harvesting',
      startDay: fundStartDay + 1825,
      endDay: fundStartDay + 4380
    }
  }
  
  // Winding down phase: Years 12+
  return {
    phase: 'winding_down',
    startDay: fundStartDay + 4380,
    endDay: undefined
  }
}

/**
 * Generate capital call for new investment
 */
export function generateCapitalCall(
  prng: PRNG,
  lpCommitments: LPCommitment[],
  investmentAmount: number,
  currentDay: number
): CapitalCall[] {
  const calls: CapitalCall[] = []
  const totalCommitment = lpCommitments.reduce((sum, lp) => sum + lp.commitment, 0)
  
  lpCommitments.forEach(lp => {
    const lpShare = lp.commitment / totalCommitment
    const lpCallAmount = investmentAmount * lpShare
    
    if (lpCallAmount > 0 && lp.unfunded >= lpCallAmount) {
      calls.push({
        id: `call_${lp.lpId}_${currentDay}`,
        amount: lpCallAmount,
        dealId: '', // Will be set by caller
        dueDate: currentDay + 30, // 30 days to fund
        status: 'pending'
      })
    }
  })
  
  return calls
}

/**
 * Process capital call funding
 */
export function processCapitalCall(
  prng: PRNG,
  call: CapitalCall,
  lp: LPCommitment
): { funded: boolean; actualAmount: number; impactOnSatisfaction?: number } {
  // Base funding probability
  let fundingProbability = 0.95
  
  // Adjust based on LP satisfaction
  if (lp.satisfaction < 50) {
    fundingProbability *= 0.8 // Lower satisfaction = higher default risk
  } else if (lp.satisfaction > 80) {
    fundingProbability *= 1.05 // High satisfaction = very reliable
  }
  
  // Adjust based on LP persona
  fundingProbability *= (1 - lp.persona.fee_sensitivity * 0.1) // Fee sensitive LPs are slightly less reliable
  
  const funded = prng.next() < Math.min(0.99, fundingProbability)
  
  if (!funded) {
    // Unfunded call significantly hurts satisfaction and relationship
    return {
      funded: false,
      actualAmount: 0,
      impactOnSatisfaction: -15
    }
  }
  
  // Successful funding maintains or slightly improves satisfaction
  return {
    funded: true,
    actualAmount: call.amount,
    impactOnSatisfaction: prng.range(0, 2)
  }
}

/**
 * Calculate distribution waterfall (European style)
 */
export function calculateDistributionWaterfall(
  proceedsAmount: number,
  lpCommitments: LPCommitment[],
  fund: Fund,
  managementFeeRate: number = 0.02,
  carryRate: number = 0.20,
  hurdleRate: number = 0.08
): { lpDistributions: WaterfallDistribution[]; gpCarry: number; managementFeeOffset: number } {
  const totalCommitment = lpCommitments.reduce((sum, lp) => sum + lp.commitment, 0)
  const totalContributions = fund.size - fund.undrawn
  const totalManagementFees = totalContributions * managementFeeRate * (fund.vintage || 1) // Simplified
  
  const lpDistributions: WaterfallDistribution[] = []
  let remainingProceeds = proceedsAmount
  let totalGPCarry = 0
  
  // Step 1: Return of capital to LPs
  const returnOfCapital = Math.min(remainingProceeds, totalContributions)
  lpCommitments.forEach(lp => {
    const lpShare = lp.commitment / totalCommitment
    const lpReturnOfCapital = returnOfCapital * lpShare
    
    lpDistributions.push({
      lpId: lp.lpId,
      distribution: lpReturnOfCapital,
      type: 'return_of_capital'
    })
  })
  remainingProceeds -= returnOfCapital
  
  // Step 2: Preferred return to LPs (hurdle rate)
  if (remainingProceeds > 0) {
    const preferredReturn = Math.min(remainingProceeds, totalContributions * hurdleRate * (fund.vintage || 1))
    lpCommitments.forEach(lp => {
      const lpShare = lp.commitment / totalCommitment
      const lpPreferredReturn = preferredReturn * lpShare
      
      const existingDistribution = lpDistributions.find(d => d.lpId === lp.lpId && d.type === 'return_of_capital')
      if (existingDistribution) {
        lpDistributions.push({
          lpId: lp.lpId,
          distribution: lpPreferredReturn,
          type: 'preferred_return'
        })
      }
    })
    remainingProceeds -= preferredReturn
  }
  
  // Step 3: GP catch-up (if applicable)
  // Simplified: assume no catch-up for this basic implementation
  
  // Step 4: Carried interest split
  if (remainingProceeds > 0) {
    const gpCarry = remainingProceeds * carryRate
    const lpExcessReturn = remainingProceeds * (1 - carryRate)
    
    totalGPCarry += gpCarry
    
    lpCommitments.forEach(lp => {
      const lpShare = lp.commitment / totalCommitment
      const lpExcess = lpExcessReturn * lpShare
      
      lpDistributions.push({
        lpId: lp.lpId,
        distribution: lpExcess,
        type: 'excess_return'
      })
    })
  }
  
  return {
    lpDistributions,
    gpCarry: totalGPCarry,
    managementFeeOffset: Math.min(totalGPCarry, totalManagementFees) // Carry can offset management fees
  }
}

/**
 * Update LP satisfaction based on fund performance and interactions
 */
export function updateLPSatisfaction(
  prng: PRNG,
  lp: LPCommitment,
  fund: Fund,
  currentDay: number,
  recentDistributions: Distribution[] = []
): number {
  let satisfactionChange = 0
  
  // Base satisfaction drift
  satisfactionChange += prng.range(-1, 1)
  
  // Fund performance impact
  if (fund.netIRR > 0.15) { // Strong performance
    satisfactionChange += 2
  } else if (fund.netIRR < 0.05) { // Poor performance
    satisfactionChange -= 3
  }
  
  // DPI impact (distributions are good)
  if (fund.dpi > 0.5) {
    satisfactionChange += 1
  }
  
  // TVPI impact (total value creation)
  if (fund.tvpi > 1.5) {
    satisfactionChange += 1
  } else if (fund.tvpi < 1.1) {
    satisfactionChange -= 2
  }
  
  // Recent distributions boost satisfaction
  const recentLPDistributions = recentDistributions.filter(d => 
    d.date > currentDay - 90 && d.type === 'exit_proceeds'
  )
  if (recentLPDistributions.length > 0) {
    satisfactionChange += 3
  }
  
  // Communication frequency impact
  const daysSinceLastInteraction = currentDay - lp.lastInteraction
  if (daysSinceLastInteraction > 180) { // No communication in 6 months
    satisfactionChange -= 2
  }
  
  // Persona-specific adjustments
  if (lp.persona.patience < 0.5 && fund.vintage && fund.vintage > 3) {
    satisfactionChange -= 1 // Impatient LPs get frustrated over time
  }
  
  if (lp.persona.fee_sensitivity > 0.7 && fund.netIRR < 0.12) {
    satisfactionChange -= 1 // Fee-sensitive LPs unhappy with poor net returns
  }
  
  return Math.max(0, Math.min(100, lp.satisfaction + satisfactionChange))
}

/**
 * Attempt to raise a new fund
 */
export function attemptFundraising(
  prng: PRNG,
  existingLPs: LPCommitment[],
  targetFundSize: number,
  trackRecord: { netIRR: number; dpi: number; tvpi: number },
  marketConditions: { M: number }
): FundraisingResult {
  let totalCommitted = 0
  const newCommitments: LPCommitment[] = []
  const fundraisingCosts = targetFundSize * 0.02 // 2% fundraising costs
  
  // Existing LP re-up probability based on satisfaction and performance
  existingLPs.forEach(lp => {
    let reUpProbability = 0.6 // Base probability
    
    // Satisfaction impact
    reUpProbability += (lp.satisfaction - 50) * 0.01
    
    // Track record impact
    if (trackRecord.netIRR > 0.15) reUpProbability += 0.2
    if (trackRecord.dpi > 0.8) reUpProbability += 0.15
    if (trackRecord.tvpi > 1.8) reUpProbability += 0.1
    
    // Market conditions
    reUpProbability += marketConditions.M * 0.1
    
    // Persona adjustments
    reUpProbability *= (1 + lp.persona.patience * 0.2)
    reUpProbability *= (1 - lp.persona.fee_sensitivity * 0.1)
    
    if (prng.next() < Math.min(0.95, Math.max(0.1, reUpProbability))) {
      // Commitment size varies based on satisfaction and performance
      const commitmentMultiplier = 0.8 + (lp.satisfaction / 100) * 0.4 + prng.range(-0.1, 0.2)
      const newCommitmentSize = lp.commitment * commitmentMultiplier
      
      newCommitments.push({
        lpId: lp.lpId,
        persona: lp.persona,
        commitment: newCommitmentSize,
        unfunded: newCommitmentSize,
        satisfaction: lp.satisfaction,
        lastInteraction: 0
      })
      
      totalCommitted += newCommitmentSize
    }
  })
  
  // Attempt to attract new LPs to fill remaining target
  const remainingTarget = targetFundSize - totalCommitted
  const newLPAttractionRate = Math.max(0.3, 0.7 + marketConditions.M * 0.2) // Market dependent
  
  if (remainingTarget > 0 && trackRecord.netIRR > 0.08) { // Need decent track record for new LPs
    const newLPCommitment = remainingTarget * prng.range(newLPAttractionRate * 0.5, newLPAttractionRate)
    
    if (newLPCommitment > 0) {
      // Generate a few new LP commitments
      const numNewLPs = Math.floor(prng.range(2, 6))
      for (let i = 0; i < numNewLPs; i++) {
        const individualCommitment = newLPCommitment / numNewLPs * prng.range(0.7, 1.5)
        
        // Generate new LP persona
        const newLP: LPCommitment = {
          lpId: `NewLP_${Date.now()}_${i}`,
          persona: {
            id: `new_${i}`,
            patience: prng.range(0.3, 0.9),
            fee_sensitivity: prng.range(0.2, 0.8),
            esg_strictness: prng.range(0.1, 0.7),
            side_letters: {}
          },
          commitment: individualCommitment,
          unfunded: individualCommitment,
          satisfaction: 70, // New LPs start with neutral satisfaction
          lastInteraction: 0
        }
        
        newCommitments.push(newLP)
        totalCommitted += individualCommitment
      }
    }
  }
  
  const success = totalCommitted >= targetFundSize * 0.75 // Success if raised 75%+ of target
  
  return {
    success,
    newCommitments: success ? newCommitments : undefined,
    totalCommitted: success ? totalCommitted : 0,
    fundraisingCosts: success ? fundraisingCosts : fundraisingCosts * 0.5 // Partial costs if failed
  }
}

/**
 * Calculate fund-level metrics
 */
export function calculateFundMetrics(
  investedAmount: number,
  currentValue: number,
  distributionsToLPs: number,
  totalCommitment: number,
  fundAge: number
): { dpi: number; rvpi: number; tvpi: number; netIRR: number } {
  // DPI = Distributed to Paid In
  const dpi = investedAmount > 0 ? distributionsToLPs / investedAmount : 0
  
  // RVPI = Residual Value to Paid In
  const rvpi = investedAmount > 0 ? (currentValue - distributionsToLPs) / investedAmount : 1
  
  // TVPI = Total Value to Paid In
  const tvpi = dpi + rvpi
  
  // Net IRR calculation (simplified)
  const totalValue = distributionsToLPs + currentValue
  const holdingPeriodYears = Math.max(0.25, fundAge / 365)
  const grossReturn = investedAmount > 0 ? totalValue / investedAmount : 1
  const netIRR = holdingPeriodYears > 0 ? Math.pow(grossReturn, 1 / holdingPeriodYears) - 1 : 0
  
  return { dpi, rvpi, tvpi, netIRR }
}

/**
 * Generate management fee calculation
 */
export function calculateManagementFee(
  fund: Fund,
  currentDay: number,
  fundStartDay: number,
  feeRate: number = 0.02
): number {
  const fundAge = currentDay - fundStartDay
  const yearsActive = fundAge / 365
  
  // Management fee typically steps down after investment period
  let effectiveRate = feeRate
  if (yearsActive > 5) {
    effectiveRate = feeRate * 0.5 // 50% reduction after year 5
  }
  
  // Fee calculated on committed capital during investment period, then on cost of investments
  const deploymentRatio = (fund.size - fund.undrawn) / fund.size
  const feeBase = yearsActive <= 5 ? fund.size : fund.size * deploymentRatio
  
  // Quarterly fee calculation
  return (feeBase * effectiveRate) / 4
}