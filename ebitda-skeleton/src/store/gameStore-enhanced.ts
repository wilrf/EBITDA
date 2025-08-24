import { create } from 'zustand'
import type { GameState, Mode } from '../engine/types-enhanced'
import { EnhancedGameEngine, type EngineConfig, type EnhancedGameState } from '../engine/state-enhanced'
import type { ExitResult, FundraisingResult } from '../engine/exits'

interface EnhancedGameStore {
  engine?: EnhancedGameEngine
  state?: EnhancedGameState
  
  // Core game actions
  start: (cfg: EngineConfig) => void
  nextDay: () => void
  weeklyReport?: () => ReturnType<EnhancedGameEngine['weeklyReport']>
  
  // Deal actions
  startAuction: (i: number) => any
  priceDebtPreview: (lev: number, covLite: boolean) => any
  
  // Exit actions
  executeExit: (opportunityId: string) => ExitResult
  
  // Portfolio actions
  executeBoltOn: (opportunityId: string) => boolean
  executeWorkingCapitalOptimization: (opportunityId: string) => boolean
  executePortfolioInitiative: (initiativeId: string) => boolean
  
  // LP and fundraising actions
  issueCapitalCall: (amount: number, purpose: string) => boolean
  processCapitalCalls: () => void
  attemptFundraising: () => FundraisingResult
  distributeToLPs: (amount: number, dealId?: string) => boolean
  
  // Event actions
  processEventChoice: (eventId: string, choiceId: string) => boolean
  resolveOperationalEvent: (eventId: string, spendMoney: boolean) => boolean
  
  // Analytics and reporting
  getDealPerformances: () => any[]
  getFundMetrics: () => any
  getLPSatisfaction: () => any[]
  getPortfolioOpportunities: () => any
}

export const useEnhancedGame = create<EnhancedGameStore>((set, get) => ({
  start: (cfg) => {
    const engine = new EnhancedGameEngine(cfg)
    set({ 
      engine, 
      state: engine.state, 
      weeklyReport: engine.weeklyReport.bind(engine),
      priceDebtPreview: engine.priceDebtPreview.bind(engine)
    })
  },

  nextDay: () => {
    const { engine } = get()
    if (!engine) return
    engine.tickDay()
    engine.processCapitalCalls()
    set({ state: engine.state })
  },

  startAuction: (i: number) => {
    const { engine } = get()
    if (!engine) return
    const res = engine.startAuctionForPipeline(i)
    set({ state: engine.state })
    return res
  },

  executeExit: (opportunityId: string) => {
    const { engine } = get()
    if (!engine) return { success: false }
    const result = engine.executeExitOpportunity(opportunityId)
    set({ state: engine.state })
    return result
  },

  executeBoltOn: (opportunityId: string) => {
    const { engine } = get()
    if (!engine) return false
    const success = engine.executeBoltOnAcquisition(opportunityId)
    set({ state: engine.state })
    return success
  },

  executeWorkingCapitalOptimization: (opportunityId: string) => {
    const { engine, state } = get()
    if (!engine || !state) return false
    
    const opportunity = state.wcOptimizations.find(o => o.id === opportunityId)
    if (!opportunity) return false
    
    const deal = state.deals.find(d => d.id === opportunity.dealId)
    if (!deal) return false
    
    // Check if we have enough cash for implementation
    if (state.fund.cash < opportunity.implementationCost) return false
    
    // Apply working capital optimization
    state.fund.cash -= opportunity.implementationCost
    state.fund.cash += opportunity.cashImpact
    
    // Update deal metrics
    deal.meters.execution = Math.min(100, deal.meters.execution + 3)
    
    // Remove the opportunity
    state.wcOptimizations = state.wcOptimizations.filter(o => o.id !== opportunityId)
    
    set({ state })
    return true
  },

  executePortfolioInitiative: (initiativeId: string) => {
    const { engine, state } = get()
    if (!engine || !state) return false
    
    const initiative = state.portfolioInitiatives.find(i => i.id === initiativeId)
    if (!initiative) return false
    
    const deal = state.deals.find(d => d.id === initiative.dealId)
    if (!deal) return false
    
    // Check capacity and cash requirements
    if (state.firm.opsCapacity < initiative.requiredCapacity) return false
    if (state.fund.cash < initiative.cost) return false
    
    // Apply initiative effects
    state.fund.cash -= initiative.cost
    state.firm.opsCapacity -= initiative.requiredCapacity
    
    // Update deal based on initiative type
    switch (initiative.type) {
      case 'operational_improvement':
        deal.meters.execution = Math.min(100, deal.meters.execution + 10)
        deal.metrics.ebitda *= 1.05 // 5% EBITDA improvement
        break
      case 'market_expansion':
        deal.metrics.revenue *= 1.08 // 8% revenue growth
        deal.meters.momentum = Math.min(100, deal.meters.momentum + 5)
        break
      case 'cost_reduction':
        deal.metrics.ebitda *= 1.03 // 3% margin improvement
        break
      case 'tech_upgrade':
        deal.meters.execution = Math.min(100, deal.meters.execution + 8)
        deal.meters.fragility = Math.max(0, deal.meters.fragility - 3)
        break
      case 'esg_initiative':
        state.firm.reputation = Math.min(100, state.firm.reputation + 2)
        state.firm.lpTrust = Math.min(100, state.firm.lpTrust + 1)
        break
    }
    
    // Remove completed initiative
    state.portfolioInitiatives = state.portfolioInitiatives.filter(i => i.id !== initiativeId)
    
    set({ state })
    return true
  },

  issueCapitalCall: (amount: number, purpose: string) => {
    const { engine } = get()
    if (!engine) return false
    const success = engine.issueCapitalCall(amount, purpose)
    set({ state: engine.state })
    return success
  },

  processCapitalCalls: () => {
    const { engine } = get()
    if (!engine) return
    engine.processCapitalCalls()
    set({ state: engine.state })
  },

  attemptFundraising: () => {
    const { engine } = get()
    if (!engine) return { success: false, newCommitments: 0, newFundSize: 0 }
    const result = engine.attemptFundraising()
    set({ state: engine.state })
    return result
  },

  distributeToLPs: (amount: number, dealId?: string) => {
    const { state } = get()
    if (!state) return false
    
    // Check if we have enough cash to distribute
    if (state.fund.cash < amount) return false
    
    // Calculate distribution to LPs
    const totalCommitment = state.lpCommitments.reduce((sum, lp) => sum + lp.commitment, 0)
    
    for (const lp of state.lpCommitments) {
      const lpShare = lp.commitment / totalCommitment
      const lpDistribution = amount * lpShare
      lp.distributed += lpDistribution
      lp.satisfaction = Math.min(100, lp.satisfaction + 1) // Small satisfaction boost
    }
    
    // Deduct from fund cash
    state.fund.cash -= amount
    
    // Add to distributions history
    state.distributions.push({
      id: `dist_${state.day}`,
      amount,
      type: 'return_of_capital',
      dealId,
      distributionDate: state.day
    })
    
    set({ state })
    return true
  },

  processEventChoice: (eventId: string, choiceId: string) => {
    const { engine } = get()
    if (!engine) return false
    
    // Would need to import the enhanced events module
    // const success = processEventChoice(engine.prng, engine.state, eventId, choiceId)
    // set({ state: engine.state })
    // return success
    
    // Simplified implementation for now
    const event = engine.state.activeEvents.find(e => e.id === eventId)
    if (event) {
      // Remove the event after choice
      engine.state.activeEvents = engine.state.activeEvents.filter(e => e.id !== eventId)
      set({ state: engine.state })
      return true
    }
    return false
  },

  resolveOperationalEvent: (eventId: string, spendMoney: boolean) => {
    const { engine } = get()
    if (!engine) return false
    
    // Would need to import the enhanced events module
    // const success = resolveOperationalEvent(engine.state, eventId, spendMoney)
    // set({ state: engine.state })
    // return success
    
    // Simplified implementation for now
    if (spendMoney && engine.state.fund.cash >= 5_000_000) {
      engine.state.fund.cash -= 5_000_000
      engine.state.activeEvents = engine.state.activeEvents.filter(e => e.id !== eventId)
      set({ state: engine.state })
      return true
    }
    return false
  },

  getDealPerformances: () => {
    const { state } = get()
    if (!state) return []
    
    return state.dealPerformances.map(perf => {
      const deal = state.deals.find(d => d.id === perf.dealId)
      return {
        ...perf,
        dealName: deal?.name || 'Unknown',
        sector: deal?.sector || 'Unknown'
      }
    })
  },

  getFundMetrics: () => {
    const { state } = get()
    if (!state) return {}
    
    return {
      dpi: state.fund.dpi,
      rvpi: state.fund.rvpi,
      tvpi: state.fund.tvpi,
      netIRR: state.fund.netIRR,
      cash: state.fund.cash,
      undrawn: state.fund.undrawn,
      deployed: state.fund.size - state.fund.undrawn - state.fund.cash,
      nav: state.dealPerformances.reduce((sum, perf) => sum + perf.currentValuation, 0),
      totalDistributions: state.distributions.reduce((sum, dist) => sum + dist.amount, 0),
      fundPhase: state.fundPhase
    }
  },

  getLPSatisfaction: () => {
    const { state } = get()
    if (!state) return []
    
    return state.lpCommitments.map(lp => ({
      lpId: lp.lpId,
      commitment: lp.commitment,
      called: lp.called,
      distributed: lp.distributed,
      satisfaction: lp.satisfaction,
      dpi: lp.called > 0 ? lp.distributed / lp.called : 0
    }))
  },

  getPortfolioOpportunities: () => {
    const { state } = get()
    if (!state) return {}
    
    return {
      exitOpportunities: state.exitOpportunities.length,
      boltOnOpportunities: state.boltOnOpportunities.length,
      wcOptimizations: state.wcOptimizations.length,
      portfolioInitiatives: state.portfolioInitiatives.length,
      
      exitOppsList: state.exitOpportunities.map(opp => {
        const deal = state.deals.find(d => d.id === opp.dealId)
        return {
          ...opp,
          dealName: deal?.name || 'Unknown'
        }
      }),
      
      boltOnOppsList: state.boltOnOpportunities.map(opp => {
        const deal = state.deals.find(d => d.id === opp.dealId)
        return {
          ...opp,
          parentDealName: deal?.name || 'Unknown'
        }
      }),
      
      wcOptsList: state.wcOptimizations.map(opt => {
        const deal = state.deals.find(d => d.id === opt.dealId)
        return {
          ...opt,
          dealName: deal?.name || 'Unknown'
        }
      }),
      
      initiativesList: state.portfolioInitiatives.map(init => {
        const deal = state.deals.find(d => d.id === init.dealId)
        return {
          ...init,
          dealName: deal?.name || 'Unknown'
        }
      })
    }
  }
}))

// Legacy compatibility - keep the original store available
export { useGame } from './gameStore'