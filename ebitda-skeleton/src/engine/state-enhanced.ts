import type { 
  GameState, Deal, Fund, Firm, Mode, Scenario, EconomyCoeffs, DifficultyPack, 
  EventDeck, RivalArchetype, LenderPolicy, LPPersona, ExitOpportunity, 
  DealPerformance, BoltOnOpportunity, WorkingCapitalOptimization, 
  PortfolioInitiative, LPCommitment, CapitalCall, Distribution, FundPhase 
} from './types'
import { PRNG } from './prng'
import { computeMacroStep } from './macro'
import { runAuction } from './auctions'
import { priceDebt } from './capitalStack'
import { checkCovenants } from './covenants'
import { spawnEventFromDeck, advanceEvents } from './events'
import { 
  generateExitOpportunity, executeExit, calculateDealPerformance, 
  regeneratePipeline, type ExitResult 
} from './exits'
import { 
  generateBoltOnOpportunity, executeBoltOn, generateWorkingCapitalOptimization,
  generatePortfolioInitiatives, updatePortfolioPerformance 
} from './portfolio'
import { 
  determineFundPhase, generateCapitalCall, processCapitalCall, 
  calculateDistributionWaterfall, attemptFundraising, calculateFundMetrics,
  type FundraisingResult, type WaterfallDistribution 
} from './fundraising'

export interface EngineConfig {
  mode: Mode
  seed: number
  scenario: Scenario
  economy: EconomyCoeffs
  difficulty: DifficultyPack
  decks: { takeovers: EventDeck; ops: EventDeck }
  rivals: RivalArchetype[]
  lenderPolicy: LenderPolicy
  lpPersonas: LPPersona[]
}

// Enhanced GameState with new properties
export interface EnhancedGameState extends GameState {
  exitOpportunities: ExitOpportunity[]
  dealPerformances: DealPerformance[]
  boltOnOpportunities: BoltOnOpportunity[]
  wcOptimizations: WorkingCapitalOptimization[]
  portfolioInitiatives: PortfolioInitiative[]
  lpCommitments: LPCommitment[]
  capitalCalls: CapitalCall[]
  distributions: Distribution[]
  fundPhase: FundPhase
}

export class EnhancedGameEngine {
  public state: EnhancedGameState
  private prng: PRNG
  private cfg: EngineConfig

  constructor(cfg: EngineConfig) {
    this.cfg = cfg
    this.prng = new PRNG(cfg.seed)
    const firm: Firm = { 
      reputation: 50, lenderTrust: 50, lpTrust: 50, auditComfort: 60, 
      boardGov: 55, opsCapacity: 3, culture: 50 
    }
    const fund: Fund = { 
      id: 'Fund I', vintage: 1, size: 100_000_000, cash: 20_000_000, 
      undrawn: 80_000_000, dpi: 0, rvpi: 1, tvpi: 1, netIRR: 0 
    }
    const pipeline = this.generateInitialPipeline()
    
    // Initialize LP commitments
    const lpCommitments: LPCommitment[] = cfg.lpPersonas.map(lp => ({
      lpId: lp.id,
      commitment: fund.size * 0.1, // Each LP commits 10% for initial fund
      called: 0,
      distributed: 0,
      satisfaction: 75 // Start with decent satisfaction
    }))
    
    this.state = {
      mode: cfg.mode, day: 1, week: 1, quarter: 1, seed: cfg.seed,
      firm, fund, deals: [], activeEvents: [], pipeline, kpis: {},
      exitOpportunities: [],
      dealPerformances: [],
      boltOnOpportunities: [],
      wcOptimizations: [],
      portfolioInitiatives: [],
      lpCommitments,
      capitalCalls: [],
      distributions: [],
      fundPhase: 'investing'
    }
  }

  private generateInitialPipeline(): Deal[] {
    const macro = computeMacroStep(this.cfg.scenario, this.cfg.economy, 0)
    const sectors = Object.keys(macro.baseSectorMultiple)
    const picks = sectors.slice(0, 3)
    return picks.map((s, i) => ({
      id: `P${i+1}`,
      name: `${s.toUpperCase()} Co`,
      sector: s,
      baseMultiple: macro.baseSectorMultiple[s] ?? 7.5,
      entryMultiple: (macro.baseSectorMultiple[s] ?? 7.5) * (1 + 0.02 * (this.state?.firm?.reputation ?? 50 - 50)/10),
      leverage: 4.5,
      covenants: { Lmax: this.cfg.lenderPolicy.cov_defaults.Lmax, Imin: this.cfg.lenderPolicy.cov_defaults.Imin },
      public: false,
      metrics: { ebitda: 10_000_000, revenue: 100_000_000 },
      meters: { fragility: 40, execution: 55, momentum: 50 }
    }))
  }

  tickDay() {
    const step = Math.floor((this.state.week-1)/ (this.cfg.scenario.frequency === 'quarterly' ? 13 : 1))
    const macro = computeMacroStep(this.cfg.scenario, this.cfg.economy, step)
    this.state.kpis['M'] = macro.M
    this.state.kpis['R'] = macro.R

    // Progress timers & events
    advanceEvents(this.state)

    // Update deal performances
    this.updateDealPerformances()

    // Generate exit opportunities (weekly)
    if (this.state.day % 7 === 0) {
      this.generateExitOpportunities()
      this.generatePortfolioOpportunities()
    }

    // Update fund phase
    this.state.fundPhase = determineFundPhase(this.state.fund, this.state.deals.length)

    // Regenerate pipeline if needed
    const updatedPipeline = regeneratePipeline(
      this.prng, this.state.pipeline, this.state.day, 
      this.cfg.scenario, this.cfg.economy, step, 
      this.state.firm.reputation, this.cfg.lenderPolicy
    )
    this.state.pipeline = updatedPipeline

    // Light random drift on reputation/momentum
    this.state.firm.reputation = clamp(this.state.firm.reputation + (this.prng.range(-0.3, 0.4)), 0, 100)
    this.state.day += 1

    // Week gate every 7 days
    if (this.state.day % 7 === 0) {
      this.state.week += 1
    }

    // Quarter gate every 13 weeks
    if (this.state.week % 13 === 0 && this.state.day % 7 === 0) {
      this.state.quarter += 1
      // Trust drift
      this.state.firm.lenderTrust = clamp(this.state.firm.lenderTrust + 1, 0, 100)
      
      // Update fund metrics
      calculateFundMetrics(this.state.fund, this.state.dealPerformances, this.state.distributions)
    }
  }

  private updateDealPerformances() {
    for (const deal of this.state.deals) {
      const existing = this.state.dealPerformances.find(p => p.dealId === deal.id)
      const step = Math.floor((this.state.week-1)/ (this.cfg.scenario.frequency === 'quarterly' ? 13 : 1))
      const macro = computeMacroStep(this.cfg.scenario, this.cfg.economy, step)
      
      const performance = calculateDealPerformance(
        deal, existing?.entryDate || this.state.day, 
        existing?.entryValuation || (deal.metrics.ebitda * deal.entryMultiple),
        this.state.day, macro.M, this.state.kpis['R'] ?? 0
      )
      
      if (existing) {
        Object.assign(existing, performance)
      } else {
        this.state.dealPerformances.push(performance)
      }
    }
  }

  private generateExitOpportunities() {
    // Generate exit opportunities for mature deals (held > 2 years)
    const matureDeals = this.state.deals.filter(deal => {
      const performance = this.state.dealPerformances.find(p => p.dealId === deal.id)
      return performance && performance.daysHeld > 730 // 2 years
    })

    for (const deal of matureDeals.slice(0, 2)) { // Limit to 2 opportunities per week
      if (!this.state.exitOpportunities.some(e => e.dealId === deal.id)) {
        const opportunity = generateExitOpportunity(
          this.prng, deal, this.state.day,
          this.state.kpis['M'] ?? 0, this.state.kpis['R'] ?? 0
        )
        if (opportunity) {
          this.state.exitOpportunities.push(opportunity)
        }
      }
    }
  }

  private generatePortfolioOpportunities() {
    // Generate bolt-on and working capital opportunities
    for (const deal of this.state.deals.slice(0, 3)) { // Limit scope
      // Bolt-on opportunities (monthly)
      if (this.state.week % 4 === 0 && this.prng.next() < 0.3) {
        const boltOn = generateBoltOnOpportunity(this.prng, deal, this.state.day)
        if (boltOn && !this.state.boltOnOpportunities.some(b => b.dealId === deal.id)) {
          this.state.boltOnOpportunities.push(boltOn)
        }
      }

      // Working capital optimizations (quarterly)
      if (this.state.week % 13 === 0 && this.prng.next() < 0.4) {
        const wcOpt = generateWorkingCapitalOptimization(this.prng, deal)
        if (wcOpt && !this.state.wcOptimizations.some(w => w.dealId === deal.id)) {
          this.state.wcOptimizations.push(wcOpt)
        }
      }

      // Portfolio initiatives (ongoing)
      if (this.prng.next() < 0.1) {
        const initiatives = generatePortfolioInitiatives(this.prng, deal, this.state.firm.opsCapacity)
        this.state.portfolioInitiatives.push(...initiatives.filter(
          init => !this.state.portfolioInitiatives.some(p => p.dealId === init.dealId && p.type === init.type)
        ))
      }
    }
  }

  startAuctionForPipeline(i: number) {
    const deal = this.state.pipeline[i]
    if (!deal) return { ok: false }
    
    // Initialize rivals subset
    const rivalSet = this.cfg.rivals.slice(0, Math.max(2, Math.min(this.cfg.difficulty.multipliers.rivals_count, this.cfg.rivals.length)))
    const heat = clamp(this.state.kpis['M'] ?? 0, -2, 2) / 2 + 0.5
    const res = runAuction(this.prng, deal, rivalSet, heat)
    
    if (res.winner === 'player') {
      this.state.deals.push(deal)
      this.state.pipeline.splice(i,1)
      return { ok: true, won: true, multiple: res.clearingMultiple }
    } else if (res.winner === 'rival') {
      this.state.pipeline.splice(i,1)
      return { ok: true, won: false, rival: res.rivalId, multiple: res.clearingMultiple }
    } else {
      return { ok: true, won: false, walk: true, multiple: res.clearingMultiple }
    }
  }

  executeExitOpportunity(opportunityId: string): ExitResult {
    const opportunity = this.state.exitOpportunities.find(o => o.id === opportunityId)
    if (!opportunity) return { success: false }

    const deal = this.state.deals.find(d => d.id === opportunity.dealId)
    if (!deal) return { success: false }

    const performance = this.state.dealPerformances.find(p => p.dealId === deal.id)
    if (!performance) return { success: false }

    const result = executeExit(
      this.prng, opportunity, deal, performance,
      this.state.kpis['M'] ?? 0, this.state.kpis['R'] ?? 0
    )

    if (result.success) {
      // Remove deal from portfolio
      this.state.deals = this.state.deals.filter(d => d.id !== deal.id)
      
      // Remove exit opportunity
      this.state.exitOpportunities = this.state.exitOpportunities.filter(o => o.id !== opportunityId)
      
      // Add distribution
      if (result.proceeds) {
        const distribution: Distribution = {
          id: `dist_${this.state.day}`,
          amount: result.proceeds,
          type: 'return_of_capital',
          dealId: deal.id,
          distributionDate: this.state.day
        }
        this.state.distributions.push(distribution)
        
        // Update fund cash
        this.state.fund.cash += result.proceeds
        
        // Process distribution to LPs
        const waterfall = calculateDistributionWaterfall(
          result.proceeds, this.state.fund.size, 
          this.state.lpCommitments.reduce((sum, lp) => sum + lp.called, 0),
          0.2 // 20% carried interest
        )
        
        // Update LP distributions
        for (const lp of this.state.lpCommitments) {
          const lpShare = lp.commitment / this.state.fund.size
          lp.distributed += waterfall.lpDistribution * lpShare
        }
      }
    }

    return result
  }

  executeBoltOnAcquisition(opportunityId: string): boolean {
    const opportunity = this.state.boltOnOpportunities.find(o => o.id === opportunityId)
    if (!opportunity) return false

    const deal = this.state.deals.find(d => d.id === opportunity.dealId)
    if (!deal) return false

    const success = executeBoltOn(this.prng, opportunity, deal, this.state.fund)
    if (success) {
      this.state.boltOnOpportunities = this.state.boltOnOpportunities.filter(o => o.id !== opportunityId)
      
      // Update deal metrics
      deal.metrics.revenue *= (1 + opportunity.synergies)
      deal.meters.execution = clamp(deal.meters.execution + 5, 0, 100)
    }

    return success
  }

  priceDebtPreview(leverage: number, covLite: boolean) {
    const step = Math.floor((this.state.week-1)/ (this.cfg.scenario.frequency === 'quarterly' ? 13 : 1))
    const macro = computeMacroStep(this.cfg.scenario, this.cfg.economy, step)
    const baseRate = (this.cfg.scenario.series.fed_funds_rate_pct?.[step] ?? 2.0)
    const ts = priceDebt(baseRate, leverage, 5.0, covLite, this.state.firm.lenderTrust, macro.R, Math.floor(this.state.firm.reputation/20), this.cfg.lenderPolicy)
    return ts
  }

  attemptFundraising(): FundraisingResult {
    return attemptFundraising(
      this.prng, this.state.fund, this.state.firm, 
      this.state.dealPerformances, this.cfg.lpPersonas
    )
  }

  issueCapitalCall(amount: number, purpose: string): boolean {
    const call = generateCapitalCall(amount, purpose, this.state.day + 30) // 30 days to respond
    
    if (call) {
      this.state.capitalCalls.push(call)
      return true
    }
    return false
  }

  processCapitalCalls() {
    for (const call of this.state.capitalCalls.filter(c => !c.issued && c.dueDate <= this.state.day)) {
      const result = processCapitalCall(call, this.state.lpCommitments, this.state.fund)
      if (result.success) {
        call.issued = true
        call.collected = result.collected || 0
        this.state.fund.cash += result.collected || 0
        this.state.fund.undrawn -= result.collected || 0
      }
    }
  }

  weeklyReport() {
    return {
      week: this.state.week,
      fundCash: this.state.fund.cash,
      reputation: this.state.firm.reputation,
      lenderTrust: this.state.firm.lenderTrust,
      lpTrust: this.state.firm.lpTrust,
      fundPhase: this.state.fundPhase,
      pipeline: this.state.pipeline.map(d => ({ 
        id: d.id, name: d.name, sector: d.sector, multiple: d.entryMultiple 
      })),
      deals: this.state.deals.map(d => {
        const performance = this.state.dealPerformances.find(p => p.dealId === d.id)
        return { 
          id: d.id, name: d.name, lev: d.leverage, cov: d.covenants,
          moic: performance?.moic || 1.0, irr: performance?.irr || 0
        }
      }),
      exitOpportunities: this.state.exitOpportunities.map(e => ({
        id: e.id, dealId: e.dealId, type: e.type, multiple: e.multiple, buyer: e.buyerName
      })),
      portfolioOpportunities: {
        boltOns: this.state.boltOnOpportunities.length,
        wcOptimizations: this.state.wcOptimizations.length,
        initiatives: this.state.portfolioInitiatives.length
      },
      risks: this.state.deals.map(d => ({ 
        id: d.id, breach: checkCovenants(d, this.state.kpis['R'] ?? 0) 
      })),
      suggestions: this.suggestActions()
    }
  }

  private suggestActions(): string[] {
    const s: string[] = []
    
    if (this.state.pipeline.length > 0) {
      s.push('Consider running an auction on a pipeline target.')
    }
    
    if (this.state.deals.some(d => d.meters.fragility > 60)) {
      s.push('Reduce fragility: lower leverage or improve execution.')
    }
    
    if ((this.state.kpis['R'] ?? 0) > 1.5) {
      s.push('Risk stress high: avoid cov-lite this week.')
    }
    
    if (this.state.exitOpportunities.length > 0) {
      s.push(`${this.state.exitOpportunities.length} exit opportunities available.`)
    }
    
    if (this.state.boltOnOpportunities.length > 0) {
      s.push(`${this.state.boltOnOpportunities.length} bolt-on acquisitions available.`)
    }
    
    if (this.state.fund.cash < this.state.fund.size * 0.05) {
      s.push('Fund cash is low. Consider issuing a capital call.')
    }
    
    if (this.state.fundPhase === 'harvesting') {
      s.push('Fund is in harvesting phase. Focus on exits and distributions.')
    }
    
    return s
  }
}

function clamp(x: number, a: number, b: number) { 
  return Math.max(a, Math.min(b, x)) 
}