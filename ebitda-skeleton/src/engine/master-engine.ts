import type { GameState, Deal, Fund, Firm, Mode, Scenario, EconomyCoeffs, DifficultyPack, EventDeck, RivalArchetype, LenderPolicy, LPPersona } from './types'
import { PRNG } from './prng'
import { computeMacroStep } from './macro'
import { runAuction } from './auctions'
import { priceDebt } from './capitalStack'
import { checkCovenants } from './covenants'
import { spawnEventFromDeck, advanceEvents } from './events'

// Import all detailed systems
import { DealSourcingEngine } from './deal-sourcing'
import { DueDiligenceEngine } from './due-diligence'
import { PortfolioOperationsEngine, type PortfolioCompany } from './portfolio-operations'
import { FinancialModelingEngine } from './financial-modeling'
import { MarketDynamicsEngine } from './market-dynamics'
import { LPManagementEngine } from './lp-management'
import { AdvancedAuctionEngine } from './advanced-auctions'
import { RiskManagementEngine } from './risk-management'

export interface MasterEngineConfig {
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

export interface EnhancedGameState extends GameState {
  portfolioCompanies: PortfolioCompany[]
  marketConditions: ReturnType<MarketDynamicsEngine['getCurrentConditions']>
  lpRelationships: ReturnType<LPManagementEngine['getLPRelationships']>
  riskMetrics: ReturnType<RiskManagementEngine['calculatePortfolioRisk']>
  dealPipeline: EnhancedDeal[]
  historicalPerformance: PerformanceHistory
}

export interface EnhancedDeal extends Deal {
  source: ReturnType<DealSourcingEngine['generateDealSource']>
  diligenceReport?: ReturnType<DueDiligenceEngine['conductDueDiligence']>
  auctionDetails?: ReturnType<AdvancedAuctionEngine['runAuction']>
  financialModel?: ReturnType<FinancialModelingEngine['buildLBOModel']>
}

export interface PerformanceHistory {
  fundReturns: { date: number; irr: number; tvpi: number; dpi: number }[]
  dealOutcomes: { dealId: string; exitMultiple: number; irr: number }[]
  marketTimingScore: number
  valueCreationScore: number
}

export class MasterGameEngine {
  // Core components
  private state: EnhancedGameState
  private prng: PRNG
  private cfg: MasterEngineConfig
  
  // Detailed engines
  private dealSourcing: DealSourcingEngine
  private dueDiligence: DueDiligenceEngine
  private portfolioOps: PortfolioOperationsEngine
  private financialModeling: FinancialModelingEngine
  private marketDynamics: MarketDynamicsEngine
  private lpManagement: LPManagementEngine
  private advancedAuctions: AdvancedAuctionEngine
  private riskManagement: RiskManagementEngine

  constructor(cfg: MasterEngineConfig) {
    this.cfg = cfg
    this.prng = new PRNG(cfg.seed)
    
    // Initialize all engines
    this.dealSourcing = new DealSourcingEngine(this.prng)
    this.dueDiligence = new DueDiligenceEngine(this.prng)
    this.portfolioOps = new PortfolioOperationsEngine(this.prng)
    this.financialModeling = new FinancialModelingEngine(this.prng)
    this.marketDynamics = new MarketDynamicsEngine(this.prng)
    this.lpManagement = new LPManagementEngine(this.prng)
    this.advancedAuctions = new AdvancedAuctionEngine(this.prng)
    this.riskManagement = new RiskManagementEngine(this.prng)
    
    // Initialize game state
    this.state = this.initializeState()
  }

  private initializeState(): EnhancedGameState {
    const firm: Firm = {
      reputation: 50,
      lenderTrust: 50,
      lpTrust: 50,
      auditComfort: 60,
      boardGov: 55,
      opsCapacity: 3,
      culture: 50
    }
    
    const fund: Fund = {
      id: 'Fund I',
      vintage: 1,
      size: 100_000_000,
      cash: 20_000_000,
      undrawn: 80_000_000,
      dpi: 0,
      rvpi: 1,
      tvpi: 1,
      netIRR: 0
    }
    
    // Initialize with LP relationships
    const lps = this.lpManagement.initializeLPs(fund.size)
    
    // Initialize market conditions
    const marketConditions = this.marketDynamics.initializeMarket()
    
    // Generate initial pipeline with enhanced deals
    const pipeline = this.generateEnhancedPipeline()
    
    return {
      mode: this.cfg.mode,
      day: 1,
      week: 1,
      quarter: 1,
      seed: this.cfg.seed,
      firm,
      fund,
      deals: [],
      activeEvents: [],
      pipeline,
      kpis: {},
      portfolioCompanies: [],
      marketConditions,
      lpRelationships: this.lpManagement.getLPRelationships(),
      riskMetrics: this.riskManagement.calculatePortfolioRisk([], marketConditions),
      dealPipeline: pipeline,
      historicalPerformance: {
        fundReturns: [],
        dealOutcomes: [],
        marketTimingScore: 50,
        valueCreationScore: 50
      }
    }
  }

  private generateEnhancedPipeline(): EnhancedDeal[] {
    const macro = computeMacroStep(this.cfg.scenario, this.cfg.economy, 0)
    const sectors = Object.keys(macro.baseSectorMultiple)
    const dealCount = 3 + Math.floor(this.prng.range(0, 5))
    
    return sectors.slice(0, dealCount).map((sector, i) => {
      const baseDeal: Deal = {
        id: `P${i+1}`,
        name: `${sector.charAt(0).toUpperCase() + sector.slice(1)} Corp ${i+1}`,
        sector,
        baseMultiple: macro.baseSectorMultiple[sector] ?? 7.5,
        entryMultiple: (macro.baseSectorMultiple[sector] ?? 7.5) * (1 + 0.02 * (this.state?.firm?.reputation ?? 50 - 50)/10),
        leverage: 4.5,
        covenants: {
          Lmax: this.cfg.lenderPolicy.cov_defaults.Lmax,
          Imin: this.cfg.lenderPolicy.cov_defaults.Imin
        },
        public: this.prng.next() > 0.8,
        metrics: {
          ebitda: 10_000_000 * this.prng.range(0.5, 3),
          revenue: 100_000_000 * this.prng.range(0.5, 3)
        },
        meters: {
          fragility: 30 + this.prng.range(0, 40),
          execution: 40 + this.prng.range(0, 30),
          momentum: 40 + this.prng.range(0, 30)
        }
      }
      
      // Enhance with sourcing details
      const source = this.dealSourcing.generateDealSource(this.state.firm, sector)
      
      return {
        ...baseDeal,
        source
      }
    })
  }

  /**
   * Main game loop - called every day
   */
  tickDay(): void {
    const step = Math.floor((this.state.week - 1) / (this.cfg.scenario.frequency === 'quarterly' ? 13 : 1))
    const macro = computeMacroStep(this.cfg.scenario, this.cfg.economy, step)
    
    // Update KPIs
    this.state.kpis['M'] = macro.M
    this.state.kpis['R'] = macro.R
    
    // Update market conditions
    this.state.marketConditions = this.marketDynamics.updateMarket(
      this.state.marketConditions,
      { M: macro.M, R: macro.R }
    )
    
    // Progress events
    advanceEvents(this.state)
    
    // Update portfolio companies
    this.updatePortfolioCompanies()
    
    // Update firm metrics
    this.updateFirmMetrics()
    
    // Progress time
    this.state.day += 1
    
    // Weekly updates
    if (this.state.day % 7 === 0) {
      this.state.week += 1
      this.performWeeklyActivities()
    }
    
    // Quarterly updates
    if (this.state.week % 13 === 0 && this.state.day % 7 === 0) {
      this.state.quarter += 1
      this.performQuarterlyActivities()
    }
  }

  private updatePortfolioCompanies(): void {
    this.state.portfolioCompanies = this.state.portfolioCompanies.map(company => 
      this.portfolioOps.updatePortfolioPerformance(
        company,
        company.holdingPeriod + 1,
        { M: this.state.kpis['M'] ?? 0, R: this.state.kpis['R'] ?? 0 }
      )
    )
  }

  private updateFirmMetrics(): void {
    // Update reputation based on portfolio performance
    const avgPerformance = this.state.portfolioCompanies.reduce(
      (sum, c) => sum + c.performanceMetrics.budgetVariance, 0
    ) / Math.max(1, this.state.portfolioCompanies.length)
    
    this.state.firm.reputation = this.clamp(
      this.state.firm.reputation + avgPerformance * 0.1 + this.prng.range(-0.3, 0.4),
      0, 100
    )
    
    // Update LP trust based on fund performance
    const fundPerformance = this.calculateFundPerformance()
    this.state.firm.lpTrust = this.clamp(
      this.state.firm.lpTrust + (fundPerformance.netIRR - 15) * 0.1,
      0, 100
    )
  }

  private performWeeklyActivities(): void {
    // Regenerate pipeline if depleted
    if (this.state.dealPipeline.length < 3) {
      const newDeals = this.generateEnhancedPipeline()
      this.state.dealPipeline.push(...newDeals)
    }
    
    // Update LP relationships
    this.lpManagement.updateRelationships(
      this.state.fund,
      this.calculateFundPerformance()
    )
    
    // Calculate risk metrics
    this.state.riskMetrics = this.riskManagement.calculatePortfolioRisk(
      this.state.portfolioCompanies,
      this.state.marketConditions
    )
  }

  private performQuarterlyActivities(): void {
    // LP reporting
    const report = this.lpManagement.generateQuarterlyReport(
      this.state.fund,
      this.state.portfolioCompanies,
      this.calculateFundPerformance()
    )
    
    // Process capital calls if needed
    if (this.state.fund.cash < 5_000_000 && this.state.fund.undrawn > 0) {
      const callAmount = Math.min(20_000_000, this.state.fund.undrawn)
      const callResult = this.lpManagement.processCapitalCall(
        this.state.fund.id,
        callAmount,
        'Growth capital for portfolio companies'
      )
      
      if (callResult.collected > 0) {
        this.state.fund.cash += callResult.collected
        this.state.fund.undrawn -= callResult.collected
      }
    }
    
    // Trust drift
    this.state.firm.lenderTrust = this.clamp(
      this.state.firm.lenderTrust + 1,
      0, 100
    )
  }

  /**
   * Start auction for a pipeline deal with full diligence
   */
  startAdvancedAuction(dealIndex: number): {
    success: boolean
    result?: any
    reason?: string
  } {
    const deal = this.state.dealPipeline[dealIndex]
    if (!deal) {
      return { success: false, reason: 'Deal not found' }
    }
    
    // Conduct due diligence
    const diligenceBudget = Math.min(
      this.state.fund.cash * 0.01,
      2_000_000
    )
    
    deal.diligenceReport = this.dueDiligence.conductDueDiligence(
      deal,
      this.state.firm,
      diligenceBudget,
      30 // 30 days for diligence
    )
    
    // Check for deal breakers
    if (deal.diligenceReport.dealBreakers.length > 0) {
      return {
        success: false,
        reason: `Deal breakers found: ${deal.diligenceReport.dealBreakers.join(', ')}`
      }
    }
    
    // Build financial model
    deal.financialModel = this.financialModeling.buildLBOModel({
      purchasePrice: deal.diligenceReport.recommendedPrice,
      ebitda: deal.diligenceReport.qofE.sustainableEBITDA,
      entryMultiple: deal.entryMultiple,
      leverage: deal.leverage,
      growthRate: 0.1,
      exitMultiple: deal.entryMultiple + 1,
      holdPeriod: 5
    })
    
    // Run advanced auction
    const auctionResult = this.advancedAuctions.runAuction(
      deal,
      this.state.firm,
      this.cfg.rivals,
      this.state.marketConditions
    )
    
    deal.auctionDetails = auctionResult
    
    if (auctionResult.winner === 'player') {
      // Create portfolio company
      const portfolioCompany = this.portfolioOps.createPortfolioCompany(
        deal,
        70, // 70% ownership
        2   // 2 board seats
      )
      
      this.state.portfolioCompanies.push(portfolioCompany)
      this.state.dealPipeline.splice(dealIndex, 1)
      
      // Deduct purchase price from fund
      const totalCost = deal.financialModel.sourcesAndUses.uses.purchasePrice +
                       deal.financialModel.sourcesAndUses.uses.fees
      this.state.fund.cash -= deal.financialModel.sourcesAndUses.sources.equity
      
      return {
        success: true,
        result: {
          company: portfolioCompany,
          model: deal.financialModel,
          auction: auctionResult
        }
      }
    } else {
      this.state.dealPipeline.splice(dealIndex, 1)
      return {
        success: false,
        reason: `Lost to ${auctionResult.winner}`
      }
    }
  }

  /**
   * Execute exit for a portfolio company
   */
  executeExit(companyIndex: number): {
    success: boolean
    result?: any
    reason?: string
  } {
    const company = this.state.portfolioCompanies[companyIndex]
    if (!company) {
      return { success: false, reason: 'Company not found' }
    }
    
    // Check if ready for exit (minimum hold period)
    if (company.holdingPeriod < 24) {
      return { success: false, reason: 'Too early for exit (min 24 months)' }
    }
    
    // Calculate exit value
    const exitMultiple = company.performanceMetrics.currentMultiple
    const exitEBITDA = company.performanceMetrics.currentEBITDA
    const exitValue = exitMultiple * exitEBITDA
    
    // Calculate returns
    const entryValue = company.entryMultiple * company.metrics.ebitda
    const totalReturn = exitValue * company.ownershipPct / 100
    const multiple = totalReturn / entryValue
    const irr = this.calculateIRR(
      -entryValue,
      totalReturn,
      company.holdingPeriod / 12
    )
    
    // Process distribution
    const distribution = this.lpManagement.processDistribution(
      this.state.fund.id,
      totalReturn,
      'realized',
      irr > 0.08 // Carried interest if IRR > 8%
    )
    
    // Update fund metrics
    this.state.fund.cash += distribution.net
    this.state.fund.dpi += distribution.net / this.state.fund.size
    
    // Record outcome
    this.state.historicalPerformance.dealOutcomes.push({
      dealId: company.id,
      exitMultiple: multiple,
      irr
    })
    
    // Remove from portfolio
    this.state.portfolioCompanies.splice(companyIndex, 1)
    
    return {
      success: true,
      result: {
        exitValue,
        multiple,
        irr,
        distribution
      }
    }
  }

  /**
   * Get comprehensive dashboard data
   */
  getDashboard(): any {
    return {
      fund: {
        ...this.state.fund,
        performance: this.calculateFundPerformance()
      },
      firm: this.state.firm,
      portfolio: {
        companies: this.state.portfolioCompanies.length,
        totalValue: this.state.portfolioCompanies.reduce(
          (sum, c) => sum + c.performanceMetrics.currentEBITDA * c.performanceMetrics.currentMultiple,
          0
        ),
        avgPerformance: this.state.portfolioCompanies.reduce(
          (sum, c) => sum + c.performanceMetrics.ltmEBITDAGrowth,
          0
        ) / Math.max(1, this.state.portfolioCompanies.length)
      },
      pipeline: {
        deals: this.state.dealPipeline.length,
        proprietaryRatio: this.state.dealPipeline.filter(
          d => d.source.type === 'proprietary'
        ).length / Math.max(1, this.state.dealPipeline.length)
      },
      market: {
        conditions: this.state.marketConditions,
        momentum: this.state.kpis['M'],
        risk: this.state.kpis['R']
      },
      risk: this.state.riskMetrics,
      lpRelations: {
        avgSatisfaction: this.lpManagement.getAverageSatisfaction(),
        topConcerns: this.lpManagement.getTopConcerns()
      }
    }
  }

  private calculateFundPerformance(): typeof this.state.fund {
    const portfolioValue = this.state.portfolioCompanies.reduce(
      (sum, c) => sum + c.performanceMetrics.currentEBITDA * 
                        c.performanceMetrics.currentMultiple * 
                        c.ownershipPct / 100,
      0
    )
    
    const totalValue = this.state.fund.cash + portfolioValue
    const invested = this.state.fund.size - this.state.fund.undrawn - this.state.fund.cash
    
    return {
      ...this.state.fund,
      rvpi: portfolioValue / this.state.fund.size,
      tvpi: (this.state.fund.dpi * this.state.fund.size + portfolioValue) / this.state.fund.size,
      netIRR: this.estimateIRR(invested, totalValue, this.state.quarter / 4)
    }
  }

  private calculateIRR(initialInvestment: number, finalValue: number, years: number): number {
    if (years <= 0) return 0
    return Math.pow(finalValue / Math.abs(initialInvestment), 1 / years) - 1
  }

  private estimateIRR(invested: number, currentValue: number, years: number): number {
    if (invested <= 0 || years <= 0) return 0
    return Math.pow(currentValue / invested, 1 / years) - 1
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value))
  }
}