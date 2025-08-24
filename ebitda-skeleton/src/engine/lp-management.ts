import { PRNG } from './prng'
import type { Fund, Firm, LPPersona } from './types'

export enum LPType {
  PENSION_FUND = 'pension_fund',
  ENDOWMENT = 'endowment',
  FOUNDATION = 'foundation',
  INSURANCE = 'insurance',
  SOVEREIGN_WEALTH = 'sovereign_wealth',
  FAMILY_OFFICE = 'family_office',
  FUND_OF_FUNDS = 'fund_of_funds',
  CORPORATE = 'corporate',
  HIGH_NET_WORTH = 'high_net_worth',
  BANKS = 'banks'
}

export enum InvestorSize {
  ANCHOR = 'anchor',        // $100M+
  LARGE = 'large',         // $50-100M
  MEDIUM = 'medium',       // $10-50M
  SMALL = 'small'          // <$10M
}

export interface LimitedPartner extends LPPersona {
  name: string
  type: LPType
  size: InvestorSize
  commitment: number
  called: number
  distributed: number
  remainingCommitment: number
  
  // Relationship metrics
  relationshipTenure: number // years
  satisfactionScore: number // 0-1
  referralLikelihood: number // 0-1
  reinvestmentProbability: number // 0-1
  
  // Investment characteristics
  allocationToAlts: number // % of portfolio in alternatives
  allocationToPE: number // % of alternatives in PE
  preferredVintages: number[] // preferred fund sizes
  geographicFocus: string[]
  sectorRestrictions: string[]
  
  // Operational preferences
  reportingFrequency: 'monthly' | 'quarterly' | 'semi_annual'
  communicationStyle: 'formal' | 'informal' | 'data_driven'
  dueDiligenceDepth: 'light' | 'standard' | 'extensive'
  sideLetter: SideLetterTerms
  
  // Performance expectations
  targetNetIRR: number
  benchmarkIndex: string
  performanceToleranceDownside: number
  minimumHoldingPeriod: number
}

export interface SideLetterTerms {
  managementFeeDiscount: number // basis points
  keyPersonProvisions: string[]
  investmentRestrictions: InvestmentRestriction[]
  reportingEnhancements: string[]
  governanceRights: GovernanceRight[]
  economicTerms: EconomicTerm[]
  mostFavoredNationRights: boolean
  coinvestmentRights: CoinvestmentTerms
}

export interface InvestmentRestriction {
  type: 'sector' | 'geography' | 'deal_size' | 'leverage' | 'esg'
  description: string
  threshold?: number
  exclusions: string[]
}

export interface GovernanceRight {
  type: 'lpac_seat' | 'consent_right' | 'inspection_right' | 'key_person'
  description: string
  threshold?: number
  triggerEvents: string[]
}

export interface EconomicTerm {
  type: 'reduced_fees' | 'preferred_return' | 'catch_up' | 'carry_allocation'
  value: number
  conditions: string[]
}

export interface CoinvestmentTerms {
  minimumOpportunity: number
  feeStructure: 'no_fees' | 'reduced_fees' | 'standard_fees'
  carryStructure: 'no_carry' | 'reduced_carry' | 'standard_carry'
  allocationMethod: 'pro_rata' | 'discretionary' | 'equal'
}

export interface CapitalCall {
  id: string
  fundId: string
  callDate: Date
  dueDate: Date
  amount: number
  purpose: CapitalCallPurpose
  dealIds: string[]
  expenses: ExpenseAllocation[]
  lpAllocations: Map<string, number> // LP ID to amount
  status: 'pending' | 'collected' | 'overdue'
  collectionRate: number
}

export interface CapitalCallPurpose {
  type: 'investment' | 'expenses' | 'commitment_fees' | 'bridge_financing'
  description: string
  urgency: 'routine' | 'expedited' | 'emergency'
}

export interface ExpenseAllocation {
  category: 'management_fees' | 'deal_expenses' | 'fund_expenses' | 'broken_deal'
  amount: number
  description: string
}

export interface Distribution {
  id: string
  fundId: string
  distributionDate: Date
  totalAmount: number
  source: DistributionSource
  lpAllocations: Map<string, DistributionDetail>
  taxCharacterization: TaxCharacterization
  recallability: RecallProvision
}

export interface DistributionSource {
  type: 'exit' | 'dividend' | 'recapitalization' | 'fees' | 'expenses'
  dealId?: string
  dealName?: string
  description: string
}

export interface DistributionDetail {
  amount: number
  capitalGain: number
  dividendIncome: number
  returnOfCapital: number
  withholding: WithholdingDetail[]
}

export interface WithholdingDetail {
  jurisdiction: string
  rate: number
  amount: number
}

export interface TaxCharacterization {
  capitalGain: number
  ordinaryIncome: number
  returnOfCapital: number
  foreignTaxCredits: number
}

export interface RecallProvision {
  recallable: boolean
  recallPeriod: number // days
  recallPercentage: number
}

export interface LPACGovernance {
  members: LPACMember[]
  meetingFrequency: 'quarterly' | 'semi_annual' | 'annual' | 'as_needed'
  votingThreshold: number // percentage for decisions
  consentItems: ConsentItem[]
  advisoryItems: AdvisoryItem[]
  reportingRequirements: LPACReporting[]
}

export interface LPACMember {
  lpId: string
  lpName: string
  votingPower: number // based on commitment percentage
  expertise: string[]
  commitmentLevel: 'active' | 'passive' | 'advisory'
  termEndDate?: Date
}

export interface ConsentItem {
  category: string
  description: string
  threshold: number // minimum fund percentage requiring consent
  timeframe: number // days for response
}

export interface AdvisoryItem {
  category: string
  description: string
  consultationRequired: boolean
}

export interface LPACReporting {
  reportType: 'investment_review' | 'performance_review' | 'conflict_review' | 'valuation_review'
  frequency: 'quarterly' | 'semi_annual' | 'annual'
  detailLevel: 'summary' | 'detailed' | 'comprehensive'
}

export interface LPReporting {
  reportId: string
  fundId: string
  reportPeriod: string
  reportDate: Date
  recipients: Map<string, ReportingPreference>
  content: ReportContent
  compliance: ComplianceReporting
}

export interface ReportingPreference {
  lpId: string
  deliveryMethod: 'email' | 'portal' | 'physical'
  format: 'pdf' | 'excel' | 'both'
  customizations: string[]
}

export interface ReportContent {
  executiveSummary: ExecutiveSummary
  portfolioOverview: PortfolioOverview
  individualInvestments: InvestmentDetail[]
  financialStatements: FinancialStatements
  performanceMetrics: PerformanceMetrics
  marketCommentary: MarketCommentary
  teamUpdates: TeamUpdate[]
}

export interface ExecutiveSummary {
  keyHighlights: string[]
  performanceSummary: string
  portfolioActivity: string
  outlookCommentary: string
  majorEvents: string[]
}

export interface PortfolioOverview {
  totalValue: number
  unrealizedValue: number
  realizationsSinceInception: number
  netIRR: number
  grossIRR: number
  dpi: number
  rvpi: number
  tvpi: number
  sectorAllocation: Map<string, number>
  vintageSpread: Map<number, number>
}

export interface InvestmentDetail {
  dealId: string
  companyName: string
  investmentDate: Date
  totalInvested: number
  currentValue: number
  totalRealized: number
  grossIRR: number
  grossMoM: number
  keyDevelopments: string[]
  outlook: string
}

export interface FinancialStatements {
  cashFlows: CashFlowStatement
  balanceSheet: BalanceSheet
  incomeStatement: IncomeStatement
}

export interface CashFlowStatement {
  contributions: number
  distributions: number
  netCashFlow: number
  managementFees: number
  operatingExpenses: number
}

export interface BalanceSheet {
  investments: number
  cash: number
  totalAssets: number
  unfundedCommitments: number
  netAssets: number
}

export interface IncomeStatement {
  realizedGains: number
  unrealizedGains: number
  dividendIncome: number
  interestIncome: number
  managementFees: number
  expenses: number
  netIncome: number
}

export interface PerformanceMetrics {
  sinceInception: MetricPeriod
  oneYear: MetricPeriod
  threeYear: MetricPeriod
  fiveYear: MetricPeriod
  benchmarkComparison: BenchmarkComparison[]
}

export interface MetricPeriod {
  netIRR: number
  grossIRR: number
  tvpi: number
  dpi: number
  rvpi: number
  volatility: number
}

export interface BenchmarkComparison {
  benchmarkName: string
  benchmarkReturn: number
  fundReturn: number
  outperformance: number
  percentileRanking: number
}

export interface MarketCommentary {
  marketEnvironment: string
  sectorTrends: Map<string, string>
  fundraisingEnvironment: string
  exitEnvironment: string
  outlook: string
}

export interface TeamUpdate {
  type: 'hiring' | 'promotion' | 'departure' | 'achievement'
  person: string
  role: string
  description: string
  effectiveDate: Date
}

export interface ComplianceReporting {
  regulatoryFilings: RegulatoryFiling[]
  auditStatus: AuditStatus
  valuationMethods: ValuationMethod[]
  conflicts: ConflictDisclosure[]
  materiality: MaterialityAssessment[]
}

export interface RegulatoryFiling {
  filingType: string
  jurisdiction: string
  filingDate: Date
  status: 'filed' | 'pending' | 'late'
}

export interface AuditStatus {
  auditor: string
  lastAuditDate: Date
  nextAuditDate: Date
  findings: string[]
  managementResponse: string[]
}

export interface ValuationMethod {
  dealId: string
  method: 'dcf' | 'comparable' | 'precedent' | 'cost'
  description: string
  dateApplied: Date
}

export interface ConflictDisclosure {
  type: 'related_party' | 'cross_fund' | 'allocation' | 'fees'
  description: string
  mitigation: string
  lpacReview: boolean
}

export interface MaterialityAssessment {
  item: string
  impact: 'low' | 'medium' | 'high'
  disclosure: string
}

export class LPManagementEngine {
  private prng: PRNG
  private limitedPartners: Map<string, LimitedPartner>
  private capitalCalls: CapitalCall[]
  private distributions: Distribution[]
  private lpacGovernance: LPACGovernance
  private reportingSchedule: Map<string, Date[]>

  constructor(prng: PRNG) {
    this.prng = prng
    this.limitedPartners = new Map()
    this.capitalCalls = []
    this.distributions = []
    this.lpacGovernance = this.initializeLPAC()
    this.reportingSchedule = new Map()
  }

  // Initialize fund with LP base
  initializeFundWithLPs(fund: Fund, targetSize: number): void {
    this.generateLimitedPartners(fund, targetSize)
    this.establishReportingSchedule(fund)
  }

  private generateLimitedPartners(fund: Fund, targetSize: number): void {
    const lpTypes = Object.values(LPType)
    const sizes = Object.values(InvestorSize)
    let totalCommitted = 0
    let lpCount = 0

    // Generate anchor investors first (typically 20-30% of fund)
    const anchorTarget = targetSize * (0.2 + this.prng.next() * 0.1)
    while (totalCommitted < anchorTarget && lpCount < 5) {
      const lp = this.createLimitedPartner(
        `LP_${lpCount + 1}`,
        lpTypes[Math.floor(this.prng.next() * lpTypes.length)],
        InvestorSize.ANCHOR,
        fund
      )
      
      const commitment = Math.min(
        targetSize * 0.15, // Max 15% per LP
        anchorTarget - totalCommitted + this.prng.next() * targetSize * 0.05
      )
      
      lp.commitment = commitment
      lp.remainingCommitment = commitment
      totalCommitted += commitment
      
      this.limitedPartners.set(lp.id, lp)
      lpCount++
    }

    // Generate remaining LPs
    while (totalCommitted < targetSize * 0.95 && lpCount < 50) {
      const sizeCategory = this.selectLPSize(totalCommitted, targetSize)
      const lp = this.createLimitedPartner(
        `LP_${lpCount + 1}`,
        lpTypes[Math.floor(this.prng.next() * lpTypes.length)],
        sizeCategory,
        fund
      )
      
      const commitment = this.calculateLPCommitment(sizeCategory, targetSize, totalCommitted)
      lp.commitment = commitment
      lp.remainingCommitment = commitment
      totalCommitted += commitment
      
      this.limitedPartners.set(lp.id, lp)
      lpCount++
    }

    // Update fund size to actual commitments
    fund.size = totalCommitted
    fund.undrawn = totalCommitted
  }

  private createLimitedPartner(
    id: string,
    type: LPType,
    size: InvestorSize,
    fund: Fund
  ): LimitedPartner {
    return {
      id,
      name: this.generateLPName(type, size),
      type,
      size,
      commitment: 0,
      called: 0,
      distributed: 0,
      remainingCommitment: 0,
      
      // Base persona attributes
      patience: this.getLPPatience(type),
      fee_sensitivity: this.getLPFeeSensitivity(type),
      esg_strictness: this.getLPESGStrictness(type),
      side_letters: this.generateSideLetterTerms(type, size),
      
      relationshipTenure: this.prng.next() * 10,
      satisfactionScore: 0.6 + this.prng.next() * 0.4,
      referralLikelihood: 0.4 + this.prng.next() * 0.6,
      reinvestmentProbability: 0.5 + this.prng.next() * 0.5,
      
      allocationToAlts: this.getLPAlternativesAllocation(type),
      allocationToPE: 0.3 + this.prng.next() * 0.4,
      preferredVintages: this.generatePreferredVintages(),
      geographicFocus: this.generateGeographicFocus(type),
      sectorRestrictions: this.generateSectorRestrictions(type),
      
      reportingFrequency: this.getReportingFrequency(type, size),
      communicationStyle: this.getCommunicationStyle(type),
      dueDiligenceDepth: this.getDueDiligenceDepth(size),
      sideLetter: this.generateSideLetterTerms(type, size),
      
      targetNetIRR: 0.12 + this.prng.next() * 0.06,
      benchmarkIndex: this.getBenchmarkIndex(type),
      performanceToleranceDownside: 0.05 + this.prng.next() * 0.1,
      minimumHoldingPeriod: 3 + this.prng.next() * 5
    }
  }

  private generateLPName(type: LPType, size: InvestorSize): string {
    const nameComponents: Record<LPType, string[]> = {
      [LPType.PENSION_FUND]: ['Teachers', 'Public Employees', 'State', 'Municipal', 'Fire & Police'],
      [LPType.ENDOWMENT]: ['University', 'College', 'Academy', 'Institute', 'School'],
      [LPType.FOUNDATION]: ['Healthcare', 'Education', 'Community', 'Family', 'Charitable'],
      [LPType.INSURANCE]: ['Life Insurance', 'Property & Casualty', 'Mutual', 'Reinsurance'],
      [LPType.SOVEREIGN_WEALTH]: ['National', 'Government', 'Sovereign', 'State Investment'],
      [LPType.FAMILY_OFFICE]: ['Family Office', 'Private Wealth', 'Investment Office'],
      [LPType.FUND_OF_FUNDS]: ['Fund of Funds', 'Multi-Manager', 'Alternatives'],
      [LPType.CORPORATE]: ['Corporate Ventures', 'Strategic Investment', 'Treasury'],
      [LPType.HIGH_NET_WORTH]: ['Private Client', 'Wealth Management', 'Individual'],
      [LPType.BANKS]: ['Investment Bank', 'Commercial Bank', 'Private Bank']
    }

    const sizeModifiers: Record<InvestorSize, string[]> = {
      [InvestorSize.ANCHOR]: ['Global', 'International', 'Major', 'Large'],
      [InvestorSize.LARGE]: ['Regional', 'Metropolitan', 'Multi-State'],
      [InvestorSize.MEDIUM]: ['State', 'City', 'Local'],
      [InvestorSize.SMALL]: ['Community', 'Local', 'Private']
    }

    const baseNames = nameComponents[type]
    const modifiers = sizeModifiers[size]
    
    const baseName = baseNames[Math.floor(this.prng.next() * baseNames.length)]
    const modifier = modifiers[Math.floor(this.prng.next() * modifiers.length)]
    
    return `${modifier} ${baseName}`
  }

  private selectLPSize(currentCommitted: number, targetSize: number): InvestorSize {
    const remaining = targetSize - currentCommitted
    const remainingRatio = remaining / targetSize
    
    if (remainingRatio > 0.3 && this.prng.next() < 0.3) return InvestorSize.LARGE
    if (remainingRatio > 0.1 && this.prng.next() < 0.5) return InvestorSize.MEDIUM
    return InvestorSize.SMALL
  }

  private calculateLPCommitment(
    size: InvestorSize,
    targetSize: number,
    currentCommitted: number
  ): number {
    const ranges: Record<InvestorSize, { min: number; max: number }> = {
      [InvestorSize.ANCHOR]: { min: 0.08, max: 0.15 },
      [InvestorSize.LARGE]: { min: 0.03, max: 0.08 },
      [InvestorSize.MEDIUM]: { min: 0.01, max: 0.04 },
      [InvestorSize.SMALL]: { min: 0.002, max: 0.015 }
    }

    const range = ranges[size]
    const percentage = range.min + this.prng.next() * (range.max - range.min)
    return Math.min(targetSize * percentage, targetSize - currentCommitted)
  }

  private getLPPatience(type: LPType): number {
    const patienceMap: Record<LPType, number> = {
      [LPType.PENSION_FUND]: 0.8 + this.prng.next() * 0.2,
      [LPType.ENDOWMENT]: 0.85 + this.prng.next() * 0.15,
      [LPType.FOUNDATION]: 0.8 + this.prng.next() * 0.2,
      [LPType.INSURANCE]: 0.7 + this.prng.next() * 0.3,
      [LPType.SOVEREIGN_WEALTH]: 0.9 + this.prng.next() * 0.1,
      [LPType.FAMILY_OFFICE]: 0.6 + this.prng.next() * 0.4,
      [LPType.FUND_OF_FUNDS]: 0.5 + this.prng.next() * 0.4,
      [LPType.CORPORATE]: 0.4 + this.prng.next() * 0.4,
      [LPType.HIGH_NET_WORTH]: 0.3 + this.prng.next() * 0.5,
      [LPType.BANKS]: 0.4 + this.prng.next() * 0.4
    }
    return patienceMap[type] || 0.5
  }

  private getLPFeeSensitivity(type: LPType): number {
    const sensitivityMap: Record<LPType, number> = {
      [LPType.PENSION_FUND]: 0.8 + this.prng.next() * 0.2,
      [LPType.ENDOWMENT]: 0.6 + this.prng.next() * 0.3,
      [LPType.FOUNDATION]: 0.7 + this.prng.next() * 0.3,
      [LPType.INSURANCE]: 0.9 + this.prng.next() * 0.1,
      [LPType.SOVEREIGN_WEALTH]: 0.5 + this.prng.next() * 0.3,
      [LPType.FAMILY_OFFICE]: 0.4 + this.prng.next() * 0.4,
      [LPType.FUND_OF_FUNDS]: 0.6 + this.prng.next() * 0.4,
      [LPType.CORPORATE]: 0.3 + this.prng.next() * 0.4,
      [LPType.HIGH_NET_WORTH]: 0.2 + this.prng.next() * 0.5,
      [LPType.BANKS]: 0.7 + this.prng.next() * 0.3
    }
    return sensitivityMap[type] || 0.5
  }

  private getLPESGStrictness(type: LPType): number {
    const esgMap: Record<LPType, number> = {
      [LPType.PENSION_FUND]: 0.7 + this.prng.next() * 0.3,
      [LPType.ENDOWMENT]: 0.8 + this.prng.next() * 0.2,
      [LPType.FOUNDATION]: 0.9 + this.prng.next() * 0.1,
      [LPType.INSURANCE]: 0.6 + this.prng.next() * 0.3,
      [LPType.SOVEREIGN_WEALTH]: 0.4 + this.prng.next() * 0.4,
      [LPType.FAMILY_OFFICE]: 0.5 + this.prng.next() * 0.5,
      [LPType.FUND_OF_FUNDS]: 0.5 + this.prng.next() * 0.3,
      [LPType.CORPORATE]: 0.6 + this.prng.next() * 0.4,
      [LPType.HIGH_NET_WORTH]: 0.3 + this.prng.next() * 0.6,
      [LPType.BANKS]: 0.5 + this.prng.next() * 0.3
    }
    return esgMap[type] || 0.5
  }

  private getLPAlternativesAllocation(type: LPType): number {
    const allocationMap: Record<LPType, number> = {
      [LPType.PENSION_FUND]: 0.15 + this.prng.next() * 0.15,
      [LPType.ENDOWMENT]: 0.25 + this.prng.next() * 0.25,
      [LPType.FOUNDATION]: 0.20 + this.prng.next() * 0.20,
      [LPType.INSURANCE]: 0.10 + this.prng.next() * 0.10,
      [LPType.SOVEREIGN_WEALTH]: 0.20 + this.prng.next() * 0.30,
      [LPType.FAMILY_OFFICE]: 0.30 + this.prng.next() * 0.40,
      [LPType.FUND_OF_FUNDS]: 0.80 + this.prng.next() * 0.20,
      [LPType.CORPORATE]: 0.05 + this.prng.next() * 0.15,
      [LPType.HIGH_NET_WORTH]: 0.10 + this.prng.next() * 0.40,
      [LPType.BANKS]: 0.05 + this.prng.next() * 0.15
    }
    return allocationMap[type] || 0.15
  }

  private generatePreferredVintages(): number[] {
    const vintages = []
    const count = 1 + Math.floor(this.prng.next() * 3)
    const baseVintage = 500 + Math.floor(this.prng.next() * 9500) // $500M to $10B
    
    for (let i = 0; i < count; i++) {
      vintages.push(baseVintage * (0.5 + this.prng.next()))
    }
    
    return vintages.sort((a, b) => a - b)
  }

  private generateGeographicFocus(type: LPType): string[] {
    const allRegions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa']
    const focusCount = type === LPType.SOVEREIGN_WEALTH ? 1 + Math.floor(this.prng.next() * 2) :
                      1 + Math.floor(this.prng.next() * 4)
    
    const shuffled = [...allRegions].sort(() => 0.5 - this.prng.next())
    return shuffled.slice(0, focusCount)
  }

  private generateSectorRestrictions(type: LPType): string[] {
    const restrictedSectors = []
    
    if (this.prng.next() < 0.3) restrictedSectors.push('Tobacco')
    if (this.prng.next() < 0.4) restrictedSectors.push('Gaming')
    if (this.prng.next() < 0.2) restrictedSectors.push('Alcohol')
    if (this.prng.next() < 0.5) restrictedSectors.push('Weapons')
    if (this.prng.next() < 0.1) restrictedSectors.push('Adult Entertainment')
    
    // ESG-conscious LPs may have more restrictions
    if (type === LPType.ENDOWMENT || type === LPType.FOUNDATION) {
      if (this.prng.next() < 0.6) restrictedSectors.push('Oil & Gas')
      if (this.prng.next() < 0.3) restrictedSectors.push('Coal')
    }
    
    return restrictedSectors
  }

  private getReportingFrequency(type: LPType, size: InvestorSize): 'monthly' | 'quarterly' | 'semi_annual' {
    if (size === InvestorSize.ANCHOR) return 'quarterly'
    if (size === InvestorSize.LARGE) return this.prng.next() < 0.7 ? 'quarterly' : 'semi_annual'
    return this.prng.next() < 0.3 ? 'quarterly' : 'semi_annual'
  }

  private getCommunicationStyle(type: LPType): 'formal' | 'informal' | 'data_driven' {
    const styleMap: Record<LPType, string[]> = {
      [LPType.PENSION_FUND]: ['formal', 'data_driven'],
      [LPType.ENDOWMENT]: ['formal', 'informal'],
      [LPType.FOUNDATION]: ['formal', 'informal'],
      [LPType.INSURANCE]: ['formal', 'data_driven'],
      [LPType.SOVEREIGN_WEALTH]: ['formal'],
      [LPType.FAMILY_OFFICE]: ['informal', 'data_driven'],
      [LPType.FUND_OF_FUNDS]: ['data_driven'],
      [LPType.CORPORATE]: ['formal', 'data_driven'],
      [LPType.HIGH_NET_WORTH]: ['informal'],
      [LPType.BANKS]: ['formal', 'data_driven']
    }
    
    const options = styleMap[type] || ['formal']
    return options[Math.floor(this.prng.next() * options.length)] as 'formal' | 'informal' | 'data_driven'
  }

  private getDueDiligenceDepth(size: InvestorSize): 'light' | 'standard' | 'extensive' {
    switch (size) {
      case InvestorSize.ANCHOR:
        return 'extensive'
      case InvestorSize.LARGE:
        return this.prng.next() < 0.7 ? 'extensive' : 'standard'
      case InvestorSize.MEDIUM:
        return this.prng.next() < 0.6 ? 'standard' : 'light'
      case InvestorSize.SMALL:
        return this.prng.next() < 0.3 ? 'standard' : 'light'
    }
  }

  private generateSideLetterTerms(type: LPType, size: InvestorSize): SideLetterTerms {
    const hasSignificantSideLetter = size === InvestorSize.ANCHOR || 
                                   (size === InvestorSize.LARGE && this.prng.next() < 0.5)
    
    if (!hasSignificantSideLetter) {
      return {
        managementFeeDiscount: 0,
        keyPersonProvisions: [],
        investmentRestrictions: [],
        reportingEnhancements: [],
        governanceRights: [],
        economicTerms: [],
        mostFavoredNationRights: false,
        coinvestmentRights: {
          minimumOpportunity: 0,
          feeStructure: 'standard_fees',
          carryStructure: 'standard_carry',
          allocationMethod: 'pro_rata'
        }
      }
    }

    return {
      managementFeeDiscount: size === InvestorSize.ANCHOR ? 10 + this.prng.next() * 15 : 
                            this.prng.next() * 10,
      keyPersonProvisions: this.generateKeyPersonProvisions(),
      investmentRestrictions: this.generateInvestmentRestrictions(type),
      reportingEnhancements: this.generateReportingEnhancements(size),
      governanceRights: this.generateGovernanceRights(size),
      economicTerms: this.generateEconomicTerms(size),
      mostFavoredNationRights: size === InvestorSize.ANCHOR || 
                              (size === InvestorSize.LARGE && this.prng.next() < 0.7),
      coinvestmentRights: this.generateCoinvestmentRights(size)
    }
  }

  private generateKeyPersonProvisions(): string[] {
    const provisions = []
    if (this.prng.next() < 0.8) provisions.push('Key person event triggers investment period suspension')
    if (this.prng.next() < 0.6) provisions.push('Replacement key person approval required')
    if (this.prng.next() < 0.4) provisions.push('Time commitment requirements')
    return provisions
  }

  private generateInvestmentRestrictions(type: LPType): InvestmentRestriction[] {
    const restrictions: InvestmentRestriction[] = []
    
    if (this.prng.next() < 0.5) {
      restrictions.push({
        type: 'sector',
        description: 'Sector concentration limit',
        threshold: 25 + this.prng.next() * 15, // 25-40%
        exclusions: this.generateSectorRestrictions(type)
      })
    }
    
    if (this.prng.next() < 0.3) {
      restrictions.push({
        type: 'geography',
        description: 'Geographic diversification requirement',
        threshold: 70 + this.prng.next() * 20, // Max 70-90% in one region
        exclusions: []
      })
    }
    
    return restrictions
  }

  private generateReportingEnhancements(size: InvestorSize): string[] {
    const enhancements = []
    if (size === InvestorSize.ANCHOR) {
      enhancements.push('Monthly cash flow reporting')
      enhancements.push('ESG impact reporting')
      enhancements.push('Portfolio company board minutes')
    }
    return enhancements
  }

  private generateGovernanceRights(size: InvestorSize): GovernanceRight[] {
    const rights: GovernanceRight[] = []
    
    if (size === InvestorSize.ANCHOR) {
      rights.push({
        type: 'lpac_seat',
        description: 'Guaranteed LPAC representation',
        triggerEvents: []
      })
      
      rights.push({
        type: 'consent_right',
        description: 'Consent required for major decisions',
        threshold: 50,
        triggerEvents: ['key_person_departure', 'strategy_change', 'major_conflict']
      })
    }
    
    return rights
  }

  private generateEconomicTerms(size: InvestorSize): EconomicTerm[] {
    const terms: EconomicTerm[] = []
    
    if (size === InvestorSize.ANCHOR && this.prng.next() < 0.3) {
      terms.push({
        type: 'preferred_return',
        value: 8 + this.prng.next() * 2, // 8-10%
        conditions: ['hurdle_must_be_met_before_catch_up']
      })
    }
    
    return terms
  }

  private generateCoinvestmentRights(size: InvestorSize): CoinvestmentTerms {
    if (size === InvestorSize.ANCHOR) {
      return {
        minimumOpportunity: 25 + this.prng.next() * 75, // $25-100M
        feeStructure: 'no_fees',
        carryStructure: this.prng.next() < 0.5 ? 'no_carry' : 'reduced_carry',
        allocationMethod: 'pro_rata'
      }
    } else if (size === InvestorSize.LARGE && this.prng.next() < 0.7) {
      return {
        minimumOpportunity: 10 + this.prng.next() * 40, // $10-50M
        feeStructure: 'reduced_fees',
        carryStructure: 'standard_carry',
        allocationMethod: 'discretionary'
      }
    } else {
      return {
        minimumOpportunity: 0,
        feeStructure: 'standard_fees',
        carryStructure: 'standard_carry',
        allocationMethod: 'pro_rata'
      }
    }
  }

  private getBenchmarkIndex(type: LPType): string {
    const benchmarkMap: Record<LPType, string[]> = {
      [LPType.PENSION_FUND]: ['Russell 3000', 'MSCI ACWI', 'Custom Benchmark'],
      [LPType.ENDOWMENT]: ['S&P 500', 'Russell 3000', 'Custom Benchmark'],
      [LPType.FOUNDATION]: ['S&P 500', 'Balanced Index', 'Custom Benchmark'],
      [LPType.INSURANCE]: ['High Yield Index', 'Investment Grade', 'Custom Benchmark'],
      [LPType.SOVEREIGN_WEALTH]: ['MSCI World', 'Custom Benchmark', 'GDP + Premium'],
      [LPType.FAMILY_OFFICE]: ['S&P 500', 'Custom Benchmark', 'Absolute Return'],
      [LPType.FUND_OF_FUNDS]: ['PE Index', 'Custom Benchmark', 'Multi-Asset'],
      [LPType.CORPORATE]: ['S&P 500', 'Industry Index', 'Custom Benchmark'],
      [LPType.HIGH_NET_WORTH]: ['S&P 500', 'Balanced Index', 'Absolute Return'],
      [LPType.BANKS]: ['Bank Index', 'Financial Sector', 'Custom Benchmark']
    }
    
    const options = benchmarkMap[type] || ['S&P 500']
    return options[Math.floor(this.prng.next() * options.length)]
  }

  private initializeLPAC(): LPACGovernance {
    return {
      members: [],
      meetingFrequency: 'quarterly',
      votingThreshold: 50,
      consentItems: this.generateConsentItems(),
      advisoryItems: this.generateAdvisoryItems(),
      reportingRequirements: this.generateLPACReporting()
    }
  }

  private generateConsentItems(): ConsentItem[] {
    return [
      {
        category: 'Investment Decisions',
        description: 'Single investment exceeding 15% of fund size',
        threshold: 15,
        timeframe: 10
      },
      {
        category: 'Conflicts',
        description: 'Related party transactions',
        threshold: 0,
        timeframe: 15
      },
      {
        category: 'Fund Operations',
        description: 'Changes to investment strategy',
        threshold: 0,
        timeframe: 20
      },
      {
        category: 'Key Personnel',
        description: 'Key person departures',
        threshold: 0,
        timeframe: 5
      }
    ]
  }

  private generateAdvisoryItems(): AdvisoryItem[] {
    return [
      {
        category: 'Market Conditions',
        description: 'Quarterly market assessment',
        consultationRequired: false
      },
      {
        category: 'Portfolio Performance',
        description: 'Underperforming investments',
        consultationRequired: true
      },
      {
        category: 'ESG Matters',
        description: 'ESG incidents or opportunities',
        consultationRequired: true
      }
    ]
  }

  private generateLPACReporting(): LPACReporting[] {
    return [
      {
        reportType: 'investment_review',
        frequency: 'quarterly',
        detailLevel: 'comprehensive'
      },
      {
        reportType: 'performance_review',
        frequency: 'quarterly',
        detailLevel: 'detailed'
      },
      {
        reportType: 'conflict_review',
        frequency: 'quarterly',
        detailLevel: 'summary'
      },
      {
        reportType: 'valuation_review',
        frequency: 'quarterly',
        detailLevel: 'detailed'
      }
    ]
  }

  private establishReportingSchedule(fund: Fund): void {
    const quarterlies: Date[] = []
    const semiAnnuals: Date[] = []
    const annuals: Date[] = []
    
    // Generate reporting dates for next 5 years
    const startDate = new Date()
    for (let year = 0; year < 5; year++) {
      for (let quarter = 0; quarter < 4; quarter++) {
        const quarterEnd = new Date(startDate.getFullYear() + year, quarter * 3 + 2, 30)
        quarterlies.push(quarterEnd)
        
        if (quarter % 2 === 1) { // Semi-annual
          semiAnnuals.push(quarterEnd)
        }
        
        if (quarter === 3) { // Annual
          annuals.push(quarterEnd)
        }
      }
    }
    
    this.reportingSchedule.set('quarterly', quarterlies)
    this.reportingSchedule.set('semi_annual', semiAnnuals)
    this.reportingSchedule.set('annual', annuals)
  }

  // Capital call operations
  createCapitalCall(
    fund: Fund,
    amount: number,
    purpose: CapitalCallPurpose,
    dealIds: string[] = []
  ): CapitalCall {
    const callDate = new Date()
    const dueDate = new Date(callDate.getTime() + 10 * 24 * 60 * 60 * 1000) // 10 days
    
    const lpAllocations = new Map<string, number>()
    
    this.limitedPartners.forEach((lp, lpId) => {
      const allocation = (lp.remainingCommitment / fund.undrawn) * amount
      lpAllocations.set(lpId, allocation)
    })
    
    const capitalCall: CapitalCall = {
      id: `CC_${this.capitalCalls.length + 1}`,
      fundId: fund.id,
      callDate,
      dueDate,
      amount,
      purpose,
      dealIds,
      expenses: [],
      lpAllocations,
      status: 'pending',
      collectionRate: 0
    }
    
    this.capitalCalls.push(capitalCall)
    return capitalCall
  }

  processCapitalCall(capitalCall: CapitalCall, fund: Fund): void {
    let totalCollected = 0
    
    capitalCall.lpAllocations.forEach((allocation, lpId) => {
      const lp = this.limitedPartners.get(lpId)
      if (lp) {
        // Simulate collection success rate based on LP characteristics
        const collectionSuccess = this.prng.next() < 0.98 // 98% success rate
        
        if (collectionSuccess) {
          totalCollected += allocation
          lp.called += allocation
          lp.remainingCommitment -= allocation
        }
      }
    })
    
    capitalCall.collectionRate = totalCollected / capitalCall.amount
    capitalCall.status = capitalCall.collectionRate > 0.95 ? 'collected' : 'overdue'
    
    fund.cash += totalCollected
    fund.undrawn -= totalCollected
  }

  // Distribution operations
  createDistribution(
    fund: Fund,
    totalAmount: number,
    source: DistributionSource
  ): Distribution {
    const distributionDate = new Date()
    const lpAllocations = new Map<string, DistributionDetail>()
    
    this.limitedPartners.forEach((lp, lpId) => {
      const ownership = lp.called / (fund.size - fund.undrawn) // Based on called capital
      const allocation = totalAmount * ownership
      
      lpAllocations.set(lpId, {
        amount: allocation,
        capitalGain: allocation * 0.8, // Assume 80% capital gains
        dividendIncome: allocation * 0.15, // 15% dividends
        returnOfCapital: allocation * 0.05, // 5% return of capital
        withholding: []
      })
      
      lp.distributed += allocation
    })
    
    const distribution: Distribution = {
      id: `DIST_${this.distributions.length + 1}`,
      fundId: fund.id,
      distributionDate,
      totalAmount,
      source,
      lpAllocations,
      taxCharacterization: {
        capitalGain: totalAmount * 0.8,
        ordinaryIncome: totalAmount * 0.15,
        returnOfCapital: totalAmount * 0.05,
        foreignTaxCredits: 0
      },
      recallability: {
        recallable: source.type === 'exit' && this.prng.next() < 0.3,
        recallPeriod: 365,
        recallPercentage: 0.1
      }
    }
    
    this.distributions.push(distribution)
    return distribution
  }

  // Generate comprehensive LP report
  generateLPReport(fund: Fund, reportPeriod: string): LPReporting {
    const reportDate = new Date()
    const recipients = new Map<string, ReportingPreference>()
    
    this.limitedPartners.forEach((lp, lpId) => {
      recipients.set(lpId, {
        lpId,
        deliveryMethod: 'email',
        format: lp.communicationStyle === 'data_driven' ? 'excel' : 'pdf',
        customizations: []
      })
    })
    
    return {
      reportId: `RPT_${reportPeriod}_${Date.now()}`,
      fundId: fund.id,
      reportPeriod,
      reportDate,
      recipients,
      content: this.generateReportContent(fund),
      compliance: this.generateComplianceReporting(fund)
    }
  }

  private generateReportContent(fund: Fund): ReportContent {
    return {
      executiveSummary: {
        keyHighlights: [
          'Completed 3 new investments totaling $150M',
          'Realized partial exit generating 2.1x return',
          'Portfolio companies showing strong operational performance'
        ],
        performanceSummary: `Fund generating ${(fund.netIRR * 100).toFixed(1)}% net IRR`,
        portfolioActivity: 'Active value creation initiatives across portfolio',
        outlookCommentary: 'Market conditions remain favorable for exits',
        majorEvents: ['New fund launch announced', 'Key hire in operations team']
      },
      portfolioOverview: {
        totalValue: fund.cash + (fund.size - fund.undrawn) * fund.rvpi,
        unrealizedValue: (fund.size - fund.undrawn) * fund.rvpi,
        realizationsSinceInception: (fund.size - fund.undrawn) * fund.dpi,
        netIRR: fund.netIRR,
        grossIRR: fund.netIRR * 1.25, // Gross typically higher
        dpi: fund.dpi,
        rvpi: fund.rvpi,
        tvpi: fund.tvpi,
        sectorAllocation: new Map([
          ['Technology', 0.3],
          ['Healthcare', 0.25],
          ['Consumer', 0.2],
          ['Industrials', 0.15],
          ['Other', 0.1]
        ]),
        vintageSpread: new Map([[fund.vintage, 1.0]])
      },
      individualInvestments: [], // Would be populated with actual deals
      financialStatements: {
        cashFlows: {
          contributions: fund.size - fund.undrawn,
          distributions: (fund.size - fund.undrawn) * fund.dpi,
          netCashFlow: (fund.size - fund.undrawn) * (fund.dpi - 1),
          managementFees: (fund.size - fund.undrawn) * 0.02,
          operatingExpenses: (fund.size - fund.undrawn) * 0.005
        },
        balanceSheet: {
          investments: (fund.size - fund.undrawn) * fund.rvpi,
          cash: fund.cash,
          totalAssets: fund.cash + (fund.size - fund.undrawn) * fund.rvpi,
          unfundedCommitments: fund.undrawn,
          netAssets: fund.cash + (fund.size - fund.undrawn) * fund.rvpi
        },
        incomeStatement: {
          realizedGains: (fund.size - fund.undrawn) * fund.dpi * 0.8,
          unrealizedGains: (fund.size - fund.undrawn) * fund.rvpi * 0.2,
          dividendIncome: (fund.size - fund.undrawn) * 0.03,
          interestIncome: fund.cash * 0.02,
          managementFees: (fund.size - fund.undrawn) * 0.02,
          expenses: (fund.size - fund.undrawn) * 0.005,
          netIncome: (fund.size - fund.undrawn) * (fund.netIRR - 0.025)
        }
      },
      performanceMetrics: {
        sinceInception: {
          netIRR: fund.netIRR,
          grossIRR: fund.netIRR * 1.25,
          tvpi: fund.tvpi,
          dpi: fund.dpi,
          rvpi: fund.rvpi,
          volatility: 0.15
        },
        oneYear: {
          netIRR: fund.netIRR * 1.1,
          grossIRR: fund.netIRR * 1.35,
          tvpi: fund.tvpi * 0.9,
          dpi: fund.dpi * 0.8,
          rvpi: fund.rvpi * 1.1,
          volatility: 0.12
        },
        threeYear: {
          netIRR: fund.netIRR,
          grossIRR: fund.netIRR * 1.25,
          tvpi: fund.tvpi,
          dpi: fund.dpi,
          rvpi: fund.rvpi,
          volatility: 0.15
        },
        fiveYear: {
          netIRR: fund.netIRR,
          grossIRR: fund.netIRR * 1.25,
          tvpi: fund.tvpi,
          dpi: fund.dpi,
          rvpi: fund.rvpi,
          volatility: 0.15
        },
        benchmarkComparison: [
          {
            benchmarkName: 'Cambridge PE Index',
            benchmarkReturn: 0.12,
            fundReturn: fund.netIRR,
            outperformance: fund.netIRR - 0.12,
            percentileRanking: 25 + this.prng.next() * 50 // 25-75th percentile
          }
        ]
      },
      marketCommentary: {
        marketEnvironment: 'Markets remain constructive with selective opportunities',
        sectorTrends: new Map([
          ['Technology', 'Continued growth in AI and cloud infrastructure'],
          ['Healthcare', 'Aging demographics driving growth'],
          ['Consumer', 'Evolving preferences post-pandemic']
        ]),
        fundraisingEnvironment: 'Flight to quality among institutional investors',
        exitEnvironment: 'Strategic buyers active, IPO markets selective',
        outlook: 'Cautiously optimistic with focus on operational excellence'
      },
      teamUpdates: [
        {
          type: 'hiring',
          person: 'Jane Smith',
          role: 'Operating Partner',
          description: 'Former Fortune 500 CEO joining to lead value creation',
          effectiveDate: new Date()
        }
      ]
    }
  }

  private generateComplianceReporting(fund: Fund): ComplianceReporting {
    return {
      regulatoryFilings: [
        {
          filingType: 'Form ADV',
          jurisdiction: 'SEC',
          filingDate: new Date(),
          status: 'filed'
        }
      ],
      auditStatus: {
        auditor: 'Big 4 Accounting Firm',
        lastAuditDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        nextAuditDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        findings: [],
        managementResponse: []
      },
      valuationMethods: [],
      conflicts: [],
      materiality: []
    }
  }

  // Public accessors
  getLimitedPartners(): Map<string, LimitedPartner> {
    return new Map(this.limitedPartners)
  }

  getCapitalCalls(): CapitalCall[] {
    return [...this.capitalCalls]
  }

  getDistributions(): Distribution[] {
    return [...this.distributions]
  }

  getLPACGovernance(): LPACGovernance {
    return { ...this.lpacGovernance }
  }

  // Update LP relationships based on performance
  updateLPRelationships(fund: Fund, performanceMetric: number): void {
    this.limitedPartners.forEach((lp, lpId) => {
      // Update satisfaction based on performance vs expectations
      const performanceDelta = performanceMetric - lp.targetNetIRR
      lp.satisfactionScore = Math.max(0, Math.min(1, 
        lp.satisfactionScore + performanceDelta * 0.1
      ))
      
      // Update reinvestment probability
      lp.reinvestmentProbability = Math.max(0.1, Math.min(0.95,
        lp.satisfactionScore * 0.8 + lp.relationshipTenure * 0.05
      ))
      
      // Update referral likelihood
      lp.referralLikelihood = Math.max(0.1, Math.min(0.9,
        lp.satisfactionScore * 0.9
      ))
    })
  }
}