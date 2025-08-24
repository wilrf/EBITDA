import { PRNG } from './prng'
import type { Deal, Fund, Firm } from './types'

export enum RiskType {
  MARKET_RISK = 'market_risk',
  CREDIT_RISK = 'credit_risk',
  OPERATIONAL_RISK = 'operational_risk',
  LIQUIDITY_RISK = 'liquidity_risk',
  CONCENTRATION_RISK = 'concentration_risk',
  ESG_RISK = 'esg_risk',
  REGULATORY_RISK = 'regulatory_risk',
  GEOPOLITICAL_RISK = 'geopolitical_risk',
  CYBER_RISK = 'cyber_risk',
  KEY_PERSON_RISK = 'key_person_risk'
}

export enum RiskSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum CrisisType {
  FINANCIAL_CRISIS = 'financial_crisis',
  PANDEMIC = 'pandemic',
  REGULATORY_SHOCK = 'regulatory_shock',
  CYBER_ATTACK = 'cyber_attack',
  GEOPOLITICAL_EVENT = 'geopolitical_event',
  NATURAL_DISASTER = 'natural_disaster',
  SUPPLY_CHAIN_DISRUPTION = 'supply_chain_disruption'
}

export interface RiskMetrics {
  portfolioVar: ValueAtRisk
  expectedShortfall: number
  stressTestResults: StressTestResult[]
  concentrationMetrics: ConcentrationMetric[]
  correlationMatrix: CorrelationMatrix
  diversificationBenefit: number
  sharpeRatio: number
  sortinoRatio: number
  calmarRatio: number
  maxDrawdown: MaxDrawdown
  tailRisk: TailRiskMetric[]
}

export interface ValueAtRisk {
  confidence95: number
  confidence99: number
  confidence995: number
  timeHorizon: number // days
  methodology: 'historical' | 'parametric' | 'monte_carlo'
  backtestResults: VaRBacktest[]
}

export interface VaRBacktest {
  date: Date
  predictedVar: number
  actualLoss: number
  exception: boolean
}

export interface StressTestResult {
  scenario: StressScenario
  portfolioImpact: number
  portfolioImpactPercent: number
  dealLevelImpacts: Map<string, number>
  timeToRecovery: number // months
  mitigationStrategies: string[]
}

export interface StressScenario {
  name: string
  description: string
  severity: 'mild' | 'moderate' | 'severe' | 'extreme'
  probability: number
  macroShocks: MacroShock[]
  sectorShocks: SectorShock[]
  idiosyncraticShocks: IdiosyncraticShock[]
}

export interface MacroShock {
  variable: string
  baseValue: number
  stressValue: number
  shockMagnitude: number
  duration: number // months
}

export interface SectorShock {
  sector: string
  revenueImpact: number
  marginImpact: number
  multipleImpact: number
  duration: number
}

export interface IdiosyncraticShock {
  dealId: string
  shockType: string
  magnitude: number
  probability: number
}

export interface ConcentrationMetric {
  type: 'sector' | 'geography' | 'vintage' | 'size' | 'manager'
  herfindahlIndex: number
  top3Concentration: number
  maxSingleExposure: number
  diversificationScore: number
  concentrationLimit: number
  currentExposure: number
  limitUtilization: number
}

export interface CorrelationMatrix {
  assets: string[]
  correlations: number[][]
  eigenvalues: number[]
  principalComponents: PrincipalComponent[]
  averageCorrelation: number
  maxCorrelation: number
  minCorrelation: number
}

export interface PrincipalComponent {
  component: number
  eigenvalue: number
  varianceExplained: number
  cumulativeVariance: number
  loadings: Map<string, number>
}

export interface MaxDrawdown {
  percentage: number
  duration: number // months
  peak: Date
  trough: Date
  recovery: Date | null
  underWater: boolean
  currentDrawdown: number
}

export interface TailRiskMetric {
  percentile: number
  value: number
  expectedShortfall: number
  tailExpectation: number
}

export interface RiskFactor {
  id: string
  name: string
  type: RiskType
  severity: RiskSeverity
  probability: number
  impact: number
  velocity: number // speed of impact realization
  
  // Risk characteristics
  description: string
  category: string
  subcategory: string
  
  // Exposure details
  affectedAssets: string[]
  exposureAmount: number
  netExposure: number // after hedges/mitigants
  
  // Quantitative measures
  var95: number
  var99: number
  expectedLoss: number
  worstCaseScenario: number
  
  // Risk evolution
  trendDirection: 'increasing' | 'stable' | 'decreasing'
  trendMagnitude: number
  lastAssessment: Date
  nextAssessment: Date
  
  // Management
  owner: string
  mitigationStrategies: MitigationStrategy[]
  hedgingInstruments: HedgingInstrument[]
  monitoringFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  
  // Dependencies and correlations
  dependencies: string[]
  correlatedRisks: Map<string, number>
}

export interface MitigationStrategy {
  id: string
  strategy: string
  type: 'avoid' | 'mitigate' | 'transfer' | 'accept'
  effectiveness: number // 0-1
  cost: number
  timeframe: number // days to implement
  responsible: string
  status: 'planned' | 'in_progress' | 'implemented' | 'ineffective'
  kpis: string[]
}

export interface HedgingInstrument {
  id: string
  instrument: string
  type: 'derivative' | 'insurance' | 'diversification' | 'operational'
  notional: number
  costBasisPoints: number
  effectiveness: number
  maturity: Date
  counterparty: string
  counterpartyRating: string
  documentation: string
  marginRequirements: number
}

export interface PortfolioRiskProfile {
  riskRating: 'conservative' | 'moderate' | 'aggressive'
  riskCapacity: number
  riskTolerance: number
  riskBudget: RiskBudget
  limits: RiskLimit[]
  utilization: RiskUtilization[]
  breaches: RiskBreach[]
}

export interface RiskBudget {
  totalRiskBudget: number
  allocatedRisk: number
  availableRisk: number
  utilizationRatio: number
  budgetByCategory: Map<RiskType, number>
  budgetByAsset: Map<string, number>
}

export interface RiskLimit {
  id: string
  name: string
  type: RiskType
  limitType: 'absolute' | 'relative' | 'var' | 'concentration'
  threshold: number
  warningThreshold: number
  currency: string
  scope: 'portfolio' | 'fund' | 'sector' | 'geography'
  measurement: 'notional' | 'var' | 'percentage' | 'ratio'
  frequency: string
  reviewDate: Date
}

export interface RiskUtilization {
  limitId: string
  currentValue: number
  utilizationPercent: number
  availableCapacity: number
  trend: 'increasing' | 'stable' | 'decreasing'
}

export interface RiskBreach {
  id: string
  limitId: string
  breachDate: Date
  severity: RiskSeverity
  magnitude: number
  duration: number
  status: 'open' | 'acknowledged' | 'mitigated' | 'closed'
  actionTaken: string[]
  responsible: string
  remediation: RemediationPlan
}

export interface RemediationPlan {
  plan: string
  timeline: number // days
  milestones: Milestone[]
  responsible: string
  approver: string
  status: 'draft' | 'approved' | 'in_progress' | 'completed'
}

export interface Milestone {
  description: string
  targetDate: Date
  actualDate?: Date
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  responsible: string
}

export interface CrisisEvent {
  id: string
  type: CrisisType
  name: string
  startDate: Date
  endDate?: Date
  
  // Crisis characteristics
  severity: RiskSeverity
  scope: 'global' | 'regional' | 'national' | 'sectoral' | 'firm_specific'
  velocity: 'slow_burn' | 'rapid' | 'flash_crash'
  
  // Impact assessment
  portfolioImpact: number
  affectedAssets: string[]
  liquidityImpact: number
  valuationImpact: number
  operationalImpact: number
  
  // Crisis response
  responseTeam: CrisisResponseTeam
  communications: CrisisCommunication[]
  decisions: CrisisDecision[]
  lessons: string[]
  
  // Recovery metrics
  recoveryPlan: RecoveryPlan
  recoveryProgress: number
  estimatedRecovery: Date
}

export interface CrisisResponseTeam {
  leader: string
  members: CrisisTeamMember[]
  advisors: string[]
  meetingFrequency: string
  communicationProtocol: string
}

export interface CrisisTeamMember {
  name: string
  role: string
  responsibilities: string[]
  contactInfo: string
  backup: string
}

export interface CrisisCommunication {
  date: Date
  type: 'internal' | 'lp' | 'regulatory' | 'public'
  audience: string
  message: string
  medium: string
  feedback: string
}

export interface CrisisDecision {
  date: Date
  decision: string
  rationale: string
  alternatives: string[]
  decisionMaker: string
  impact: string
  reversible: boolean
}

export interface RecoveryPlan {
  phases: RecoveryPhase[]
  totalTimeframe: number
  keyMilestones: string[]
  successMetrics: string[]
  resourceRequirements: string[]
}

export interface RecoveryPhase {
  phase: string
  description: string
  duration: number
  activities: string[]
  dependencies: string[]
  successCriteria: string[]
}

export interface ESGRiskAssessment {
  overallScore: number
  environmentalRisks: EnvironmentalRisk[]
  socialRisks: SocialRisk[]
  governanceRisks: GovernanceRisk[]
  materiality: ESGMateriality
  regulatory: ESGRegulatory
  reputational: ESGReputational
  stranded: ESGStrandedAssets
}

export interface EnvironmentalRisk {
  category: string
  description: string
  exposure: number
  timeHorizon: 'short' | 'medium' | 'long'
  likelihood: number
  impact: number
  mitigation: string[]
}

export interface SocialRisk {
  category: string
  description: string
  stakeholders: string[]
  exposure: number
  likelihood: number
  impact: number
  mitigation: string[]
}

export interface GovernanceRisk {
  category: string
  description: string
  exposure: number
  controlEffectiveness: number
  likelihood: number
  impact: number
  remediation: string[]
}

export interface ESGMateriality {
  materialTopics: string[]
  stakeholderPriorities: Map<string, number>
  businessImpact: Map<string, number>
  regulatoryFocus: Map<string, number>
}

export interface ESGRegulatory {
  currentCompliance: number
  upcomingRegulations: UpcomingRegulation[]
  complianceCost: number
  nonComplianceRisk: number
}

export interface UpcomingRegulation {
  regulation: string
  effectiveDate: Date
  applicability: string
  complianceGap: number
  implementationCost: number
  businessImpact: string
}

export interface ESGReputational {
  currentRating: string
  ratingTrend: 'improving' | 'stable' | 'deteriorating'
  mediaMonitoring: MediaMention[]
  stakeholderFeedback: StakeholderFeedback[]
  incidentResponse: string[]
}

export interface MediaMention {
  date: Date
  source: string
  sentiment: 'positive' | 'neutral' | 'negative'
  reach: number
  topic: string
  impact: string
}

export interface StakeholderFeedback {
  stakeholder: string
  channel: string
  sentiment: 'positive' | 'neutral' | 'negative'
  topic: string
  actionRequired: boolean
}

export interface ESGStrandedAssets {
  identifiedAssets: StrandedAsset[]
  totalExposure: number
  timeframe: string
  transitionPlan: string[]
  mitigationStrategies: string[]
}

export interface StrandedAsset {
  assetId: string
  assetName: string
  reason: string
  timeframe: number
  exposure: number
  recoveryPotential: number
}

export class RiskManagementEngine {
  private prng: PRNG
  private riskFactors: Map<string, RiskFactor>
  private portfolioRiskProfile: PortfolioRiskProfile
  private activeCrises: Map<string, CrisisEvent>
  private historicalCrises: CrisisEvent[]
  private esgAssessments: Map<string, ESGRiskAssessment>

  constructor(prng: PRNG) {
    this.prng = prng
    this.riskFactors = new Map()
    this.portfolioRiskProfile = this.initializeRiskProfile()
    this.activeCrises = new Map()
    this.historicalCrises = []
    this.esgAssessments = new Map()
    this.initializeSystemicRiskFactors()
  }

  private initializeRiskProfile(): PortfolioRiskProfile {
    return {
      riskRating: 'moderate',
      riskCapacity: 100, // millions
      riskTolerance: 0.15, // 15% max portfolio loss
      riskBudget: {
        totalRiskBudget: 100,
        allocatedRisk: 0,
        availableRisk: 100,
        utilizationRatio: 0,
        budgetByCategory: new Map([
          [RiskType.MARKET_RISK, 40],
          [RiskType.CREDIT_RISK, 25],
          [RiskType.OPERATIONAL_RISK, 15],
          [RiskType.LIQUIDITY_RISK, 10],
          [RiskType.CONCENTRATION_RISK, 10]
        ]),
        budgetByAsset: new Map()
      },
      limits: this.initializeRiskLimits(),
      utilization: [],
      breaches: []
    }
  }

  private initializeRiskLimits(): RiskLimit[] {
    return [
      {
        id: 'VAR_95_PORTFOLIO',
        name: 'Portfolio VaR 95%',
        type: RiskType.MARKET_RISK,
        limitType: 'var',
        threshold: 15, // 15% of portfolio
        warningThreshold: 12,
        currency: 'USD',
        scope: 'portfolio',
        measurement: 'percentage',
        frequency: 'daily',
        reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'SECTOR_CONCENTRATION',
        name: 'Single Sector Concentration',
        type: RiskType.CONCENTRATION_RISK,
        limitType: 'concentration',
        threshold: 30, // 30% max in one sector
        warningThreshold: 25,
        currency: 'USD',
        scope: 'portfolio',
        measurement: 'percentage',
        frequency: 'monthly',
        reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'SINGLE_DEAL_EXPOSURE',
        name: 'Single Deal Exposure',
        type: RiskType.CONCENTRATION_RISK,
        limitType: 'concentration',
        threshold: 15, // 15% max in one deal
        warningThreshold: 12,
        currency: 'USD',
        scope: 'portfolio',
        measurement: 'percentage',
        frequency: 'monthly',
        reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    ]
  }

  private initializeSystemicRiskFactors(): void {
    // Market risk factors
    this.addRiskFactor({
      id: 'EQUITY_MARKET_VOLATILITY',
      name: 'Equity Market Volatility',
      type: RiskType.MARKET_RISK,
      severity: RiskSeverity.MEDIUM,
      probability: 0.7,
      impact: 0.8,
      velocity: 0.9,
      description: 'Risk of equity market volatility affecting portfolio valuations',
      category: 'Market',
      subcategory: 'Equity',
      affectedAssets: [],
      exposureAmount: 0,
      netExposure: 0,
      var95: 0.12,
      var99: 0.18,
      expectedLoss: 0.05,
      worstCaseScenario: 0.35,
      trendDirection: 'stable',
      trendMagnitude: 0,
      lastAssessment: new Date(),
      nextAssessment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      owner: 'Risk Manager',
      mitigationStrategies: [],
      hedgingInstruments: [],
      monitoringFrequency: 'daily',
      dependencies: [],
      correlatedRisks: new Map()
    })

    // Credit risk factors
    this.addRiskFactor({
      id: 'CREDIT_SPREADS',
      name: 'Credit Spread Widening',
      type: RiskType.CREDIT_RISK,
      severity: RiskSeverity.MEDIUM,
      probability: 0.6,
      impact: 0.7,
      velocity: 0.8,
      description: 'Risk of credit spread widening affecting debt financing and valuations',
      category: 'Credit',
      subcategory: 'Spreads',
      affectedAssets: [],
      exposureAmount: 0,
      netExposure: 0,
      var95: 0.08,
      var99: 0.15,
      expectedLoss: 0.03,
      worstCaseScenario: 0.25,
      trendDirection: 'increasing',
      trendMagnitude: 0.1,
      lastAssessment: new Date(),
      nextAssessment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      owner: 'Credit Risk Manager',
      mitigationStrategies: [],
      hedgingInstruments: [],
      monitoringFrequency: 'daily',
      dependencies: ['EQUITY_MARKET_VOLATILITY'],
      correlatedRisks: new Map([['EQUITY_MARKET_VOLATILITY', 0.6]])
    })

    // Operational risk factors
    this.addRiskFactor({
      id: 'CYBER_SECURITY',
      name: 'Cyber Security Risk',
      type: RiskType.CYBER_RISK,
      severity: RiskSeverity.HIGH,
      probability: 0.3,
      impact: 0.9,
      velocity: 1.0,
      description: 'Risk of cyber attacks affecting operations and data security',
      category: 'Operational',
      subcategory: 'Technology',
      affectedAssets: [],
      exposureAmount: 0,
      netExposure: 0,
      var95: 0.02,
      var99: 0.1,
      expectedLoss: 0.01,
      worstCaseScenario: 0.5,
      trendDirection: 'increasing',
      trendMagnitude: 0.2,
      lastAssessment: new Date(),
      nextAssessment: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      owner: 'CTO',
      mitigationStrategies: [],
      hedgingInstruments: [],
      monitoringFrequency: 'daily',
      dependencies: [],
      correlatedRisks: new Map()
    })
  }

  private addRiskFactor(riskFactor: RiskFactor): void {
    this.riskFactors.set(riskFactor.id, riskFactor)
  }

  // Main risk assessment method
  assessPortfolioRisk(deals: Deal[], fund: Fund): RiskMetrics {
    const var95 = this.calculateValueAtRisk(deals, 0.95)
    const var99 = this.calculateValueAtRisk(deals, 0.99)
    const expectedShortfall = this.calculateExpectedShortfall(deals, 0.95)
    
    return {
      portfolioVar: {
        confidence95: var95,
        confidence99: var99,
        confidence995: this.calculateValueAtRisk(deals, 0.995),
        timeHorizon: 252, // 1 year
        methodology: 'monte_carlo',
        backtestResults: this.generateVaRBacktests(var95)
      },
      expectedShortfall,
      stressTestResults: this.runStressTests(deals),
      concentrationMetrics: this.calculateConcentrationMetrics(deals),
      correlationMatrix: this.calculateCorrelationMatrix(deals),
      diversificationBenefit: this.calculateDiversificationBenefit(deals),
      sharpeRatio: fund.netIRR / this.calculatePortfolioVolatility(deals),
      sortinoRatio: fund.netIRR / this.calculateDownsideDeviation(deals),
      calmarRatio: fund.netIRR / this.calculateMaxDrawdown(deals).percentage,
      maxDrawdown: this.calculateMaxDrawdown(deals),
      tailRisk: this.calculateTailRisk(deals)
    }
  }

  private calculateValueAtRisk(deals: Deal[], confidence: number): number {
    const numSimulations = 10000
    const returns: number[] = []
    
    // Monte Carlo simulation
    for (let i = 0; i < numSimulations; i++) {
      let portfolioReturn = 0
      
      deals.forEach(deal => {
        // Generate correlated random returns
        const dealReturn = this.generateDealReturn(deal)
        const dealWeight = (deal.entryMultiple * deal.metrics.ebitda) / 
                          deals.reduce((sum, d) => sum + d.entryMultiple * d.metrics.ebitda, 0)
        portfolioReturn += dealReturn * dealWeight
      })
      
      returns.push(portfolioReturn)
    }
    
    returns.sort((a, b) => a - b)
    const varIndex = Math.floor((1 - confidence) * numSimulations)
    return -returns[varIndex] // VaR is positive for losses
  }

  private generateDealReturn(deal: Deal): number {
    // Base return based on deal characteristics
    const baseReturn = (deal.baseMultiple - deal.entryMultiple) / deal.entryMultiple
    
    // Add volatility based on sector and company characteristics
    const volatility = 0.2 + deal.meters.fragility * 0.3
    const randomShock = this.prng.normalRandom(0, volatility)
    
    return baseReturn + randomShock
  }

  private calculateExpectedShortfall(deals: Deal[], confidence: number): number {
    const numSimulations = 10000
    const returns: number[] = []
    
    // Monte Carlo simulation
    for (let i = 0; i < numSimulations; i++) {
      let portfolioReturn = 0
      
      deals.forEach(deal => {
        const dealReturn = this.generateDealReturn(deal)
        const dealWeight = (deal.entryMultiple * deal.metrics.ebitda) / 
                          deals.reduce((sum, d) => sum + d.entryMultiple * d.metrics.ebitda, 0)
        portfolioReturn += dealReturn * dealWeight
      })
      
      returns.push(portfolioReturn)
    }
    
    returns.sort((a, b) => a - b)
    const cutoff = Math.floor((1 - confidence) * numSimulations)
    const tailLosses = returns.slice(0, cutoff)
    
    return -tailLosses.reduce((sum, loss) => sum + loss, 0) / tailLosses.length
  }

  private generateVaRBacktests(var95: number): VaRBacktest[] {
    const backtests: VaRBacktest[] = []
    const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    
    for (let i = 0; i < 252; i++) { // Trading days in a year
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      const actualLoss = this.prng.normalRandom(0, 0.15) // Simulated daily return
      
      backtests.push({
        date,
        predictedVar: var95 / Math.sqrt(252), // Daily VaR
        actualLoss: -actualLoss,
        exception: actualLoss < -var95 / Math.sqrt(252)
      })
    }
    
    return backtests
  }

  private runStressTests(deals: Deal[]): StressTestResult[] {
    const scenarios = this.generateStressScenarios()
    return scenarios.map(scenario => this.executeStressTest(deals, scenario))
  }

  private generateStressScenarios(): StressScenario[] {
    return [
      {
        name: 'Financial Crisis 2008-style',
        description: 'Severe credit crunch and economic recession',
        severity: 'extreme',
        probability: 0.02,
        macroShocks: [
          { variable: 'GDP Growth', baseValue: 0.025, stressValue: -0.08, shockMagnitude: -0.105, duration: 18 },
          { variable: 'Credit Spreads', baseValue: 0.04, stressValue: 0.12, shockMagnitude: 0.08, duration: 24 },
          { variable: 'Equity Markets', baseValue: 0.10, stressValue: -0.50, shockMagnitude: -0.60, duration: 12 }
        ],
        sectorShocks: [
          { sector: 'Financial Services', revenueImpact: -0.30, marginImpact: -0.40, multipleImpact: -0.60, duration: 36 },
          { sector: 'Consumer', revenueImpact: -0.20, marginImpact: -0.25, multipleImpact: -0.40, duration: 24 }
        ],
        idiosyncraticShocks: []
      },
      {
        name: 'Technology Disruption',
        description: 'Rapid technological change disrupts traditional industries',
        severity: 'moderate',
        probability: 0.15,
        macroShocks: [
          { variable: 'Innovation Rate', baseValue: 0.05, stressValue: 0.20, shockMagnitude: 0.15, duration: 60 }
        ],
        sectorShocks: [
          { sector: 'Technology', revenueImpact: 0.15, marginImpact: 0.10, multipleImpact: 0.25, duration: 36 },
          { sector: 'Industrials', revenueImpact: -0.15, marginImpact: -0.10, multipleImpact: -0.20, duration: 48 }
        ],
        idiosyncraticShocks: []
      },
      {
        name: 'Pandemic Response',
        description: 'Global pandemic with lockdowns and supply chain disruption',
        severity: 'severe',
        probability: 0.05,
        macroShocks: [
          { variable: 'GDP Growth', baseValue: 0.025, stressValue: -0.05, shockMagnitude: -0.075, duration: 12 },
          { variable: 'Supply Chain', baseValue: 1.0, stressValue: 0.7, shockMagnitude: -0.3, duration: 18 }
        ],
        sectorShocks: [
          { sector: 'Healthcare', revenueImpact: 0.20, marginImpact: 0.15, multipleImpact: 0.10, duration: 24 },
          { sector: 'Consumer', revenueImpact: -0.25, marginImpact: -0.30, multipleImpact: -0.35, duration: 18 }
        ],
        idiosyncraticShocks: []
      },
      {
        name: 'Interest Rate Shock',
        description: 'Rapid increase in interest rates',
        severity: 'moderate',
        probability: 0.20,
        macroShocks: [
          { variable: 'Interest Rates', baseValue: 0.05, stressValue: 0.12, shockMagnitude: 0.07, duration: 12 }
        ],
        sectorShocks: [
          { sector: 'Real Estate', revenueImpact: -0.15, marginImpact: -0.10, multipleImpact: -0.30, duration: 24 },
          { sector: 'Utilities', revenueImpact: -0.05, marginImpact: -0.08, multipleImpact: -0.20, duration: 18 }
        ],
        idiosyncraticShocks: []
      }
    ]
  }

  private executeStressTest(deals: Deal[], scenario: StressScenario): StressTestResult {
    const dealImpacts = new Map<string, number>()
    let totalPortfolioValue = 0
    let stressedPortfolioValue = 0
    
    deals.forEach(deal => {
      const dealValue = deal.entryMultiple * deal.metrics.ebitda
      totalPortfolioValue += dealValue
      
      let stressedValue = dealValue
      
      // Apply sector shocks
      const sectorShock = scenario.sectorShocks.find(shock => shock.sector === deal.sector)
      if (sectorShock) {
        stressedValue *= (1 + sectorShock.revenueImpact) * (1 + sectorShock.multipleImpact)
      }
      
      // Apply macro shocks (simplified)
      scenario.macroShocks.forEach(shock => {
        if (shock.variable === 'GDP Growth' && shock.shockMagnitude < -0.05) {
          stressedValue *= (1 + shock.shockMagnitude * 2) // 2x sensitivity to GDP
        }
      })
      
      // Apply company-specific factors
      stressedValue *= (1 - deal.meters.fragility * 0.3) // Fragile companies hit harder
      
      const dealImpact = stressedValue - dealValue
      dealImpacts.set(deal.id, dealImpact)
      stressedPortfolioValue += stressedValue
    })
    
    const portfolioImpact = stressedPortfolioValue - totalPortfolioValue
    const portfolioImpactPercent = portfolioImpact / totalPortfolioValue
    
    return {
      scenario,
      portfolioImpact,
      portfolioImpactPercent,
      dealLevelImpacts: dealImpacts,
      timeToRecovery: this.estimateRecoveryTime(scenario, portfolioImpactPercent),
      mitigationStrategies: this.generateMitigationStrategies(scenario, portfolioImpactPercent)
    }
  }

  private estimateRecoveryTime(scenario: StressScenario, impact: number): number {
    const baseRecovery = 12 // months
    const severityMultiplier = {
      'mild': 0.5,
      'moderate': 1.0,
      'severe': 1.5,
      'extreme': 2.5
    }[scenario.severity] || 1.0
    
    const impactMultiplier = Math.abs(impact) * 2 // 2x multiplier for impact
    
    return Math.ceil(baseRecovery * severityMultiplier * (1 + impactMultiplier))
  }

  private generateMitigationStrategies(scenario: StressScenario, impact: number): string[] {
    const strategies: string[] = []
    
    if (Math.abs(impact) > 0.2) {
      strategies.push('Reduce portfolio leverage')
      strategies.push('Increase cash reserves')
      strategies.push('Hedge interest rate exposure')
    }
    
    if (scenario.name.includes('Crisis')) {
      strategies.push('Implement operational efficiency programs')
      strategies.push('Negotiate covenant amendments')
      strategies.push('Delay non-essential investments')
    }
    
    if (scenario.name.includes('Technology')) {
      strategies.push('Accelerate digital transformation')
      strategies.push('Invest in innovation capabilities')
    }
    
    return strategies
  }

  private calculateConcentrationMetrics(deals: Deal[]): ConcentrationMetric[] {
    const metrics: ConcentrationMetric[] = []
    
    // Sector concentration
    const sectorExposure = new Map<string, number>()
    let totalValue = 0
    
    deals.forEach(deal => {
      const dealValue = deal.entryMultiple * deal.metrics.ebitda
      totalValue += dealValue
      const currentSector = sectorExposure.get(deal.sector) || 0
      sectorExposure.set(deal.sector, currentSector + dealValue)
    })
    
    const sectorWeights = Array.from(sectorExposure.values()).map(value => value / totalValue)
    const sectorHHI = sectorWeights.reduce((sum, weight) => sum + weight * weight, 0)
    const top3Sectors = sectorWeights.sort((a, b) => b - a).slice(0, 3).reduce((sum, weight) => sum + weight, 0)
    const maxSector = Math.max(...sectorWeights)
    
    metrics.push({
      type: 'sector',
      herfindahlIndex: sectorHHI,
      top3Concentration: top3Sectors,
      maxSingleExposure: maxSector,
      diversificationScore: (1 - sectorHHI) * 100,
      concentrationLimit: 0.30,
      currentExposure: maxSector,
      limitUtilization: maxSector / 0.30
    })
    
    return metrics
  }

  private calculateCorrelationMatrix(deals: Deal[]): CorrelationMatrix {
    const assets = deals.map(deal => deal.id)
    const n = assets.length
    const correlations: number[][] = []
    
    // Generate correlation matrix (simplified)
    for (let i = 0; i < n; i++) {
      correlations[i] = []
      for (let j = 0; j < n; j++) {
        if (i === j) {
          correlations[i][j] = 1.0
        } else {
          // Higher correlation for same sector
          const sameSector = deals[i].sector === deals[j].sector
          const baseCorrelation = sameSector ? 0.5 + this.prng.next() * 0.3 : 
                                             0.1 + this.prng.next() * 0.3
          correlations[i][j] = baseCorrelation
          correlations[j][i] = baseCorrelation
        }
      }
    }
    
    // Calculate eigenvalues (simplified)
    const eigenvalues = [0.4, 0.3, 0.2, 0.1] // Simplified
    
    const avgCorrelation = correlations.flat().filter((_, i) => i % (n + 1) !== 0)
                          .reduce((sum, corr) => sum + corr, 0) / (n * n - n)
    
    return {
      assets,
      correlations,
      eigenvalues,
      principalComponents: [],
      averageCorrelation: avgCorrelation,
      maxCorrelation: 0.8,
      minCorrelation: 0.1
    }
  }

  private calculateDiversificationBenefit(deals: Deal[]): number {
    // Simplified calculation: benefit from not being 100% correlated
    const averageCorrelation = 0.3 // Assumed average correlation
    return (1 - averageCorrelation) * 100
  }

  private calculatePortfolioVolatility(deals: Deal[]): number {
    // Simplified portfolio volatility calculation
    const individualVolatilities = deals.map(deal => 0.2 + deal.meters.fragility * 0.3)
    const avgVolatility = individualVolatilities.reduce((sum, vol) => sum + vol, 0) / deals.length
    const diversificationEffect = 0.7 // Assume 30% reduction due to diversification
    
    return avgVolatility * diversificationEffect
  }

  private calculateDownsideDeviation(deals: Deal[]): number {
    // Simplified calculation
    return this.calculatePortfolioVolatility(deals) * 0.7
  }

  private calculateMaxDrawdown(deals: Deal[]): MaxDrawdown {
    // Simplified historical maximum drawdown calculation
    const volatility = this.calculatePortfolioVolatility(deals)
    const maxDD = volatility * 2 // Assume max drawdown is 2x volatility
    
    return {
      percentage: maxDD,
      duration: 12 + Math.floor(this.prng.next() * 18), // 12-30 months
      peak: new Date(Date.now() - 24 * 30 * 24 * 60 * 60 * 1000),
      trough: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
      recovery: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000),
      underWater: false,
      currentDrawdown: 0.05
    }
  }

  private calculateTailRisk(deals: Deal[]): TailRiskMetric[] {
    const percentiles = [0.01, 0.05, 0.10]
    return percentiles.map(percentile => ({
      percentile,
      value: this.calculateValueAtRisk(deals, 1 - percentile),
      expectedShortfall: this.calculateExpectedShortfall(deals, 1 - percentile),
      tailExpectation: this.calculateExpectedShortfall(deals, 1 - percentile) * 1.2
    }))
  }

  // Crisis management
  detectCrisis(riskMetrics: RiskMetrics, marketConditions: any): CrisisEvent | null {
    // Crisis detection logic
    const highVolatility = riskMetrics.portfolioVar.confidence95 > 0.25
    const highCorrelation = riskMetrics.correlationMatrix.averageCorrelation > 0.7
    const marketStress = marketConditions?.creditSpreads?.highYield > 0.08
    
    if (highVolatility && (highCorrelation || marketStress)) {
      return this.createCrisisEvent('financial_crisis', 'severe')
    }
    
    return null
  }

  private createCrisisEvent(crisisType: string, severity: string): CrisisEvent {
    const crisis: CrisisEvent = {
      id: `CRISIS_${Date.now()}`,
      type: crisisType as CrisisType,
      name: `Market Crisis ${new Date().getFullYear()}`,
      startDate: new Date(),
      severity: severity as RiskSeverity,
      scope: 'global',
      velocity: 'rapid',
      portfolioImpact: -0.2 - this.prng.next() * 0.3,
      affectedAssets: [],
      liquidityImpact: -0.15,
      valuationImpact: -0.25,
      operationalImpact: -0.10,
      responseTeam: {
        leader: 'Crisis Manager',
        members: [
          { name: 'Risk Manager', role: 'Risk Assessment', responsibilities: ['Monitor portfolio risk'], contactInfo: '', backup: '' },
          { name: 'Portfolio Manager', role: 'Investment Decisions', responsibilities: ['Make investment decisions'], contactInfo: '', backup: '' }
        ],
        advisors: ['External Crisis Consultant'],
        meetingFrequency: 'daily',
        communicationProtocol: 'immediate escalation'
      },
      communications: [],
      decisions: [],
      lessons: [],
      recoveryPlan: {
        phases: [
          { phase: 'Immediate Response', description: 'Stabilize operations', duration: 30, activities: [], dependencies: [], successCriteria: [] },
          { phase: 'Recovery', description: 'Restore normal operations', duration: 90, activities: [], dependencies: [], successCriteria: [] }
        ],
        totalTimeframe: 120,
        keyMilestones: [],
        successMetrics: [],
        resourceRequirements: []
      },
      recoveryProgress: 0,
      estimatedRecovery: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)
    }
    
    this.activeCrises.set(crisis.id, crisis)
    return crisis
  }

  // ESG risk assessment
  assessESGRisk(deal: Deal): ESGRiskAssessment {
    const environmentalRisks = this.assessEnvironmentalRisk(deal)
    const socialRisks = this.assessSocialRisk(deal)
    const governanceRisks = this.assessGovernanceRisk(deal)
    
    const overallScore = (
      environmentalRisks.reduce((sum, risk) => sum + risk.likelihood * risk.impact, 0) +
      socialRisks.reduce((sum, risk) => sum + risk.likelihood * risk.impact, 0) +
      governanceRisks.reduce((sum, risk) => sum + risk.likelihood * risk.impact, 0)
    ) / 3
    
    const assessment: ESGRiskAssessment = {
      overallScore,
      environmentalRisks,
      socialRisks,
      governanceRisks,
      materiality: {
        materialTopics: ['Climate Change', 'Data Privacy', 'Labor Practices'],
        stakeholderPriorities: new Map([
          ['Investors', 0.8],
          ['Regulators', 0.9],
          ['Employees', 0.6]
        ]),
        businessImpact: new Map([
          ['Climate Change', 0.7],
          ['Data Privacy', 0.8],
          ['Labor Practices', 0.5]
        ]),
        regulatoryFocus: new Map([
          ['Climate Change', 0.9],
          ['Data Privacy', 0.95],
          ['Labor Practices', 0.6]
        ])
      },
      regulatory: {
        currentCompliance: 0.8,
        upcomingRegulations: [],
        complianceCost: deal.metrics.ebitda * 0.02,
        nonComplianceRisk: 0.1
      },
      reputational: {
        currentRating: 'B+',
        ratingTrend: 'stable',
        mediaMonitoring: [],
        stakeholderFeedback: [],
        incidentResponse: []
      },
      stranded: {
        identifiedAssets: [],
        totalExposure: 0,
        timeframe: '10+ years',
        transitionPlan: [],
        mitigationStrategies: []
      }
    }
    
    this.esgAssessments.set(deal.id, assessment)
    return assessment
  }

  private assessEnvironmentalRisk(deal: Deal): EnvironmentalRisk[] {
    const risks: EnvironmentalRisk[] = []
    
    // Climate change risk varies by sector
    const climateRisk = this.getClimateRiskBySector(deal.sector)
    risks.push({
      category: 'Climate Change',
      description: 'Physical and transition risks from climate change',
      exposure: deal.metrics.ebitda * 0.1,
      timeHorizon: 'long',
      likelihood: climateRisk,
      impact: 0.6,
      mitigation: ['Carbon reduction program', 'Climate adaptation plan']
    })
    
    return risks
  }

  private assessSocialRisk(deal: Deal): SocialRisk[] {
    const risks: SocialRisk[] = []
    
    risks.push({
      category: 'Labor Relations',
      description: 'Risk of labor disputes and workforce issues',
      stakeholders: ['Employees', 'Unions', 'Communities'],
      exposure: deal.metrics.ebitda * 0.05,
      likelihood: 0.3,
      impact: 0.4,
      mitigation: ['Employee engagement programs', 'Fair labor practices']
    })
    
    return risks
  }

  private assessGovernanceRisk(deal: Deal): GovernanceRisk[] {
    const risks: GovernanceRisk[] = []
    
    risks.push({
      category: 'Board Oversight',
      description: 'Risk of inadequate board oversight and governance',
      exposure: deal.metrics.ebitda * 0.03,
      controlEffectiveness: 0.7,
      likelihood: 0.2,
      impact: 0.5,
      remediation: ['Board training', 'Governance policy update']
    })
    
    return risks
  }

  private getClimateRiskBySector(sector: string): number {
    const riskMap: Record<string, number> = {
      'Energy': 0.9,
      'Utilities': 0.8,
      'Materials': 0.7,
      'Industrials': 0.6,
      'Consumer': 0.4,
      'Healthcare': 0.3,
      'Technology': 0.2,
      'Financial Services': 0.3
    }
    
    return riskMap[sector] || 0.5
  }

  // Hedging strategies
  implementHedgingStrategy(
    riskFactorId: string,
    hedgingInstrument: HedgingInstrument
  ): boolean {
    const riskFactor = this.riskFactors.get(riskFactorId)
    if (!riskFactor) return false
    
    riskFactor.hedgingInstruments.push(hedgingInstrument)
    
    // Update net exposure
    riskFactor.netExposure = riskFactor.exposureAmount * (1 - hedgingInstrument.effectiveness)
    
    return true
  }

  // Public accessor methods
  getRiskFactors(): Map<string, RiskFactor> {
    return new Map(this.riskFactors)
  }

  getPortfolioRiskProfile(): PortfolioRiskProfile {
    return { ...this.portfolioRiskProfile }
  }

  getActiveCrises(): Map<string, CrisisEvent> {
    return new Map(this.activeCrises)
  }

  getESGAssessments(): Map<string, ESGRiskAssessment> {
    return new Map(this.esgAssessments)
  }

  // Risk monitoring and alerting
  checkRiskLimits(currentMetrics: RiskMetrics): RiskBreach[] {
    const breaches: RiskBreach[] = []
    
    this.portfolioRiskProfile.limits.forEach(limit => {
      const currentValue = this.getCurrentLimitValue(limit, currentMetrics)
      
      if (currentValue > limit.threshold) {
        breaches.push({
          id: `BREACH_${limit.id}_${Date.now()}`,
          limitId: limit.id,
          breachDate: new Date(),
          severity: currentValue > limit.threshold * 1.5 ? RiskSeverity.HIGH : RiskSeverity.MEDIUM,
          magnitude: (currentValue - limit.threshold) / limit.threshold,
          duration: 0,
          status: 'open',
          actionTaken: [],
          responsible: 'Risk Manager',
          remediation: {
            plan: `Reduce exposure to comply with ${limit.name} limit`,
            timeline: 30,
            milestones: [],
            responsible: 'Portfolio Manager',
            approver: 'CRO',
            status: 'draft'
          }
        })
      }
    })
    
    this.portfolioRiskProfile.breaches.push(...breaches)
    return breaches
  }

  private getCurrentLimitValue(limit: RiskLimit, metrics: RiskMetrics): number {
    switch (limit.id) {
      case 'VAR_95_PORTFOLIO':
        return metrics.portfolioVar.confidence95 * 100
      case 'SECTOR_CONCENTRATION':
        return Math.max(...metrics.concentrationMetrics
          .filter(m => m.type === 'sector')
          .map(m => m.maxSingleExposure * 100))
      default:
        return 0
    }
  }

  // Update risk factors over time
  updateRiskFactors(timeStep: number): void {
    this.riskFactors.forEach(riskFactor => {
      // Update trend
      if (riskFactor.trendDirection === 'increasing') {
        riskFactor.impact = Math.min(1.0, riskFactor.impact + riskFactor.trendMagnitude * timeStep / 100)
      } else if (riskFactor.trendDirection === 'decreasing') {
        riskFactor.impact = Math.max(0.1, riskFactor.impact - riskFactor.trendMagnitude * timeStep / 100)
      }
      
      // Random walk for probability
      riskFactor.probability += this.prng.normalRandom(0, 0.01)
      riskFactor.probability = Math.max(0.01, Math.min(0.99, riskFactor.probability))
    })
  }
}