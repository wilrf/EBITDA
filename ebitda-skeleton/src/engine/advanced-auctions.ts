import { PRNG } from './prng'
import type { Deal, Firm, RivalArchetype } from './types'

export enum AuctionType {
  BROAD_AUCTION = 'broad_auction',
  LIMITED_AUCTION = 'limited_auction',
  DUAL_TRACK = 'dual_track',
  NEGOTIATED_SALE = 'negotiated_sale',
  STAPLED_FINANCING = 'stapled_financing',
  COMPRESSED_TIMELINE = 'compressed_timeline'
}

export enum BidderType {
  FINANCIAL_BUYER = 'financial_buyer',
  STRATEGIC_BUYER = 'strategic_buyer',
  SPONSOR_TO_SPONSOR = 'sponsor_to_sponsor',
  MANAGEMENT_BUYOUT = 'management_buyout',
  FAMILY_OFFICE = 'family_office'
}

export enum AuctionPhase {
  TEASER = 'teaser',
  FIRST_ROUND = 'first_round',
  MANAGEMENT_PRESENTATION = 'management_presentation',
  SECOND_ROUND = 'second_round',
  FINAL_ROUND = 'final_round',
  BEST_AND_FINAL = 'best_and_final',
  NEGOTIATION = 'negotiation',
  SIGNING = 'signing'
}

export interface AdvancedAuction {
  id: string
  dealId: string
  type: AuctionType
  phase: AuctionPhase
  sellSide: SellSideAdvisor
  buySide: BuySideAdvisor[]
  
  // Auction mechanics
  participantList: AuctionParticipant[]
  currentBids: BidSubmission[]
  leadingBid: BidSubmission | null
  reservePrice?: number
  
  // Timeline
  phases: AuctionPhaseDetail[]
  currentDeadline: Date
  totalDuration: number // days
  compressionFactor: number // 1.0 = normal, <1.0 = compressed
  
  // Market dynamics
  competitionIntensity: number
  informationFlow: InformationPackage[]
  dueEligence: DueDiligenceProcess[]
  
  // Financial structure
  stapledFinancing?: StapledFinancing
  goShopProvision?: GoShopProvision
  breakupFee: number
  reverseBreakupFee: number
  
  // Process characteristics
  exclusivityPeriods: ExclusivityPeriod[]
  materialAdverseChange: MACClause[]
  closingConditions: ClosingCondition[]
  representationsWarranties: RepWarranty[]
}

export interface SellSideAdvisor {
  bankName: string
  tier: 'bulge_bracket' | 'middle_market' | 'boutique'
  reputation: number
  sectorExpertise: number
  processExecution: number
  clientRelationships: number
  fees: { retainer: number; success: number } // M&A fees
}

export interface BuySideAdvisor {
  bankName: string
  clientId: string
  mandate: 'financing' | 'advisory' | 'both'
  commitment: 'highly_confident' | 'best_efforts' | 'committed'
}

export interface AuctionParticipant {
  id: string
  name: string
  type: BidderType
  tier: 'tier_1' | 'tier_2' | 'tier_3'
  
  // Bidder characteristics
  reputation: number
  trackRecord: TrackRecord
  executionCertainty: number
  financialStrength: number
  strategicFit: number
  
  // Auction behavior
  biddingAggression: number
  informationSeeking: number
  processCompliance: number
  timelineSensitivity: number
  
  // Financial capacity
  equityCapacity: number
  debtCapacity: number
  totalCapacity: number
  costOfCapital: number
  
  // Strategic considerations
  synergies?: SynergyAnalysis
  integrationRisk: number
  culturalFit: number
  regulatoryRisk: number
  
  // Process engagement
  teamQuality: BidderTeam
  advisors: string[]
  dueDiligenceApproach: DDApproach
  
  // Current status
  currentPhase: AuctionPhase
  qualifiedForNextRound: boolean
  eliminationReason?: string
  confidentialityStatus: 'signed' | 'pending' | 'declined'
}

export interface TrackRecord {
  totalDeals: number
  sectorExperience: number
  avgDealSize: number
  successRate: number
  timeToClose: number
  postDealPerformance: number
}

export interface SynergyAnalysis {
  revenueSynergies: number
  costSynergies: number
  taxSynergies: number
  financingSynergies: number
  totalValue: number
  realizationProbability: number
  timeToRealize: number
}

export interface BidderTeam {
  principalInvolvement: number
  industryExpertise: number
  executionExperience: number
  bandwidth: number
  continuity: number
}

export interface DDApproach {
  depth: 'light' | 'standard' | 'extensive'
  speed: 'fast' | 'normal' | 'thorough'
  focus: string[]
  advisorQuality: number
}

export interface BidSubmission {
  id: string
  bidderId: string
  submissionDate: Date
  phase: AuctionPhase
  
  // Financial terms
  enterpriseValue: number
  equityValue: number
  cashFree: boolean
  debtFree: boolean
  workingCapitalPeg: number
  
  // Structure
  considerationMix: ConsiderationMix
  financingStructure: BidFinancing
  closingDate: Date
  
  // Risk allocation
  representations: RepresentationScope
  indemnification: IndemnificationStructure
  escrow: EscrowStructure
  
  // Conditions and contingencies
  financingCondition: FinancingCondition
  diligenceCondition: DiligenceCondition
  regulatoryApprovals: RegulatoryApproval[]
  materialAdverseChange: MACDefinition
  
  // Execution certainty
  certaintyScore: number
  riskFactors: RiskFactor[]
  mitigants: string[]
  
  // Competitive positioning
  competitiveAdvantages: string[]
  differentiators: string[]
  processComments: string
}

export interface ConsiderationMix {
  cash: number
  stock: number
  earnout: EarnoutStructure | null
  otherConsideration: number
}

export interface EarnoutStructure {
  amount: number
  period: number // years
  metric: 'revenue' | 'ebitda' | 'milestone'
  threshold: number
  cap: number
  protections: string[]
}

export interface BidFinancing {
  equityCommitment: number
  debtFinancing: DebtCommitment[]
  contingency: number
  backstop: boolean
  marketFlex: MarketFlexProvision[]
}

export interface DebtCommitment {
  provider: string
  amount: number
  type: 'senior' | 'subordinated' | 'mezzanine'
  commitment: 'firm' | 'highly_confident' | 'indicative'
  pricing: { margin: number; floor: number }
  terms: string[]
}

export interface MarketFlexProvision {
  type: 'pricing' | 'amount' | 'structure'
  flexibility: number
  conditions: string[]
}

export interface RepresentationScope {
  fundamental: boolean
  businessSpecific: boolean
  financial: boolean
  survivalPeriod: number // months
  basketThreshold: number
  capAmount: number
}

export interface IndemnificationStructure {
  generalCap: number
  fundamentalCap: number
  survivalPeriod: number
  basketAmount: number
  deductible: number
}

export interface EscrowStructure {
  generalEscrow: { amount: number; period: number }
  representationEscrow: { amount: number; period: number }
  adjustmentEscrow: { amount: number; period: number }
}

export interface FinancingCondition {
  type: 'none' | 'limited' | 'full'
  exceptions: string[]
  drops: FinancingDrop[]
  flexibilityProvisions: string[]
}

export interface FinancingDrop {
  condition: string
  amount: number
  mitigation: string
}

export interface DiligenceCondition {
  scope: 'standard' | 'limited' | 'extensive'
  timeframe: number // days
  materialityThreshold: number
  exceptions: string[]
}

export interface RegulatoryApproval {
  jurisdiction: string
  agency: string
  timeframe: number
  probability: number
  risk: 'low' | 'medium' | 'high'
}

export interface MACDefinition {
  scope: 'broad' | 'narrow' | 'industry_standard'
  carveouts: string[]
  quantitativeThresholds: boolean
  durations: boolean
}

export interface RiskFactor {
  category: string
  description: string
  probability: number
  impact: number
  mitigation: string
}

export interface StapledFinancing {
  provider: string
  structure: DebtCommitment[]
  commitment: 'firm' | 'highly_confident'
  terms: StapledTerms
  competitiveProcess: boolean
}

export interface StapledTerms {
  leverage: number
  pricing: { margin: number; floor: number }
  covenants: 'covenant_lite' | 'maintenance' | 'incurrence'
  call_protection: number
  amortization: number
}

export interface GoShopProvision {
  duration: number // days
  terminationFee: number
  superiorProposal: SuperiorProposal
  fiduciaryOut: boolean
  informationRights: boolean
}

export interface SuperiorProposal {
  valueThreshold: number
  conditionsImprovement: string[]
  certaintyEnhancement: string[]
}

export interface ExclusivityPeriod {
  bidderId: string
  startDate: Date
  duration: number // days
  scope: 'full' | 'limited'
  conditions: string[]
  extensions: number
}

export interface MACClause {
  scope: 'company' | 'industry' | 'general'
  materialityThreshold: number
  timeframe: number
  carveouts: string[]
  quantitative: boolean
}

export interface ClosingCondition {
  type: string
  description: string
  waivable: boolean
  satisfactionProbability: number
  timeToSatisfy: number
}

export interface RepWarranty {
  category: string
  scope: 'fundamental' | 'general' | 'specific'
  survival: number // months
  cap: number
  basket: number
}

export interface AuctionPhaseDetail {
  phase: AuctionPhase
  startDate: Date
  duration: number // days
  activities: PhaseActivity[]
  deliverables: string[]
  participantActions: ParticipantAction[]
}

export interface PhaseActivity {
  activity: string
  responsible: 'seller' | 'buyer' | 'advisor'
  timeframe: number
  dependencies: string[]
}

export interface ParticipantAction {
  participantId: string
  action: string
  deadline: Date
  completed: boolean
}

export interface InformationPackage {
  name: string
  phase: AuctionPhase
  content: string[]
  recipients: string[]
  releaseDate: Date
  confidentialityLevel: 'low' | 'medium' | 'high'
}

export interface DueDiligenceProcess {
  participantId: string
  scope: DDScope[]
  dataRoom: DataRoomAccess
  managementMeetings: ManagementMeeting[]
  siteVisits: SiteVisit[]
  expertCalls: ExpertCall[]
  progress: number // 0-1
}

export interface DDScope {
  area: string
  depth: 'overview' | 'detailed' | 'extensive'
  advisors: string[]
  timeframe: number
}

export interface DataRoomAccess {
  accessLevel: 'tier_1' | 'tier_2' | 'tier_3'
  documentsAvailable: number
  accessLog: DataRoomActivity[]
}

export interface DataRoomActivity {
  timestamp: Date
  user: string
  action: 'view' | 'download' | 'print'
  document: string
}

export interface ManagementMeeting {
  date: Date
  duration: number
  attendees: string[]
  topics: string[]
  format: 'presentation' | 'q_and_a' | 'site_visit'
}

export interface SiteVisit {
  location: string
  date: Date
  attendees: string[]
  facilities: string[]
  duration: number
}

export interface ExpertCall {
  expertType: string
  topic: string
  duration: number
  participants: string[]
  insights: string[]
}

export class AdvancedAuctionEngine {
  private prng: PRNG
  private auctions: Map<string, AdvancedAuction>
  private bidderDatabase: Map<string, AuctionParticipant>
  private advisorNetwork: Map<string, SellSideAdvisor>

  constructor(prng: PRNG) {
    this.prng = prng
    this.auctions = new Map()
    this.bidderDatabase = new Map()
    this.advisorNetwork = new Map()
    this.initializeMarketParticipants()
  }

  private initializeMarketParticipants(): void {
    this.initializeBidderDatabase()
    this.initializeAdvisorNetwork()
  }

  private initializeBidderDatabase(): void {
    // Financial buyers
    for (let i = 0; i < 50; i++) {
      this.bidderDatabase.set(`FB_${i}`, this.createFinancialBuyer(i))
    }

    // Strategic buyers
    for (let i = 0; i < 30; i++) {
      this.bidderDatabase.set(`SB_${i}`, this.createStrategicBuyer(i))
    }

    // Family offices
    for (let i = 0; i < 15; i++) {
      this.bidderDatabase.set(`FO_${i}`, this.createFamilyOfficeBuyer(i))
    }
  }

  private createFinancialBuyer(index: number): AuctionParticipant {
    const tier = index < 10 ? 'tier_1' : index < 25 ? 'tier_2' : 'tier_3'
    
    return {
      id: `FB_${index}`,
      name: `PE Fund ${index + 1}`,
      type: BidderType.FINANCIAL_BUYER,
      tier,
      
      reputation: this.getTierReputation(tier),
      trackRecord: this.generateTrackRecord(BidderType.FINANCIAL_BUYER, tier),
      executionCertainty: this.getTierExecutionCertainty(tier),
      financialStrength: this.getTierFinancialStrength(tier),
      strategicFit: 0.3 + this.prng.next() * 0.4, // Lower for financial buyers
      
      biddingAggression: 0.4 + this.prng.next() * 0.6,
      informationSeeking: 0.6 + this.prng.next() * 0.4,
      processCompliance: 0.8 + this.prng.next() * 0.2,
      timelineSensitivity: 0.5 + this.prng.next() * 0.5,
      
      equityCapacity: this.getTierEquityCapacity(tier),
      debtCapacity: this.getTierDebtCapacity(tier),
      totalCapacity: 0,
      costOfCapital: this.getTierCostOfCapital(tier),
      
      integrationRisk: 0.2 + this.prng.next() * 0.3,
      culturalFit: 0.5 + this.prng.next() * 0.5,
      regulatoryRisk: 0.1 + this.prng.next() * 0.2,
      
      teamQuality: this.generateBidderTeam(tier),
      advisors: this.selectAdvisors(BidderType.FINANCIAL_BUYER),
      dueDiligenceApproach: this.generateDDApproach(BidderType.FINANCIAL_BUYER),
      
      currentPhase: AuctionPhase.TEASER,
      qualifiedForNextRound: true,
      confidentialityStatus: 'pending'
    }
  }

  private createStrategicBuyer(index: number): AuctionParticipant {
    const tier = index < 8 ? 'tier_1' : index < 18 ? 'tier_2' : 'tier_3'
    
    return {
      id: `SB_${index}`,
      name: `Strategic Corp ${index + 1}`,
      type: BidderType.STRATEGIC_BUYER,
      tier,
      
      reputation: this.getTierReputation(tier),
      trackRecord: this.generateTrackRecord(BidderType.STRATEGIC_BUYER, tier),
      executionCertainty: this.getTierExecutionCertainty(tier) * 0.9, // Slightly lower
      financialStrength: this.getTierFinancialStrength(tier),
      strategicFit: 0.6 + this.prng.next() * 0.4, // Higher for strategics
      
      biddingAggression: 0.3 + this.prng.next() * 0.5,
      informationSeeking: 0.7 + this.prng.next() * 0.3,
      processCompliance: 0.6 + this.prng.next() * 0.4,
      timelineSensitivity: 0.3 + this.prng.next() * 0.4,
      
      equityCapacity: this.getTierEquityCapacity(tier) * 1.5,
      debtCapacity: this.getTierDebtCapacity(tier) * 0.5,
      totalCapacity: 0,
      costOfCapital: this.getTierCostOfCapital(tier) * 0.8,
      
      synergies: this.generateSynergyAnalysis(),
      integrationRisk: 0.4 + this.prng.next() * 0.4,
      culturalFit: 0.3 + this.prng.next() * 0.6,
      regulatoryRisk: 0.3 + this.prng.next() * 0.4,
      
      teamQuality: this.generateBidderTeam(tier),
      advisors: this.selectAdvisors(BidderType.STRATEGIC_BUYER),
      dueDiligenceApproach: this.generateDDApproach(BidderType.STRATEGIC_BUYER),
      
      currentPhase: AuctionPhase.TEASER,
      qualifiedForNextRound: true,
      confidentialityStatus: 'pending'
    }
  }

  private createFamilyOfficeBuyer(index: number): AuctionParticipant {
    return {
      id: `FO_${index}`,
      name: `Family Office ${index + 1}`,
      type: BidderType.FAMILY_OFFICE,
      tier: 'tier_2',
      
      reputation: 0.5 + this.prng.next() * 0.4,
      trackRecord: this.generateTrackRecord(BidderType.FAMILY_OFFICE, 'tier_2'),
      executionCertainty: 0.6 + this.prng.next() * 0.3,
      financialStrength: 0.7 + this.prng.next() * 0.3,
      strategicFit: 0.4 + this.prng.next() * 0.4,
      
      biddingAggression: 0.2 + this.prng.next() * 0.4,
      informationSeeking: 0.8 + this.prng.next() * 0.2,
      processCompliance: 0.5 + this.prng.next() * 0.4,
      timelineSensitivity: 0.2 + this.prng.next() * 0.3,
      
      equityCapacity: 50 + this.prng.next() * 200, // $50-250M
      debtCapacity: 20 + this.prng.next() * 80, // $20-100M
      totalCapacity: 0,
      costOfCapital: 0.08 + this.prng.next() * 0.04,
      
      integrationRisk: 0.5 + this.prng.next() * 0.3,
      culturalFit: 0.6 + this.prng.next() * 0.4,
      regulatoryRisk: 0.2 + this.prng.next() * 0.3,
      
      teamQuality: this.generateBidderTeam('tier_2'),
      advisors: this.selectAdvisors(BidderType.FAMILY_OFFICE),
      dueDiligenceApproach: this.generateDDApproach(BidderType.FAMILY_OFFICE),
      
      currentPhase: AuctionPhase.TEASER,
      qualifiedForNextRound: true,
      confidentialityStatus: 'pending'
    }
  }

  private getTierReputation(tier: string): number {
    switch (tier) {
      case 'tier_1': return 0.8 + this.prng.next() * 0.2
      case 'tier_2': return 0.6 + this.prng.next() * 0.3
      case 'tier_3': return 0.4 + this.prng.next() * 0.4
      default: return 0.5
    }
  }

  private getTierExecutionCertainty(tier: string): number {
    switch (tier) {
      case 'tier_1': return 0.85 + this.prng.next() * 0.15
      case 'tier_2': return 0.7 + this.prng.next() * 0.25
      case 'tier_3': return 0.5 + this.prng.next() * 0.4
      default: return 0.6
    }
  }

  private getTierFinancialStrength(tier: string): number {
    switch (tier) {
      case 'tier_1': return 0.9 + this.prng.next() * 0.1
      case 'tier_2': return 0.7 + this.prng.next() * 0.25
      case 'tier_3': return 0.5 + this.prng.next() * 0.4
      default: return 0.6
    }
  }

  private getTierEquityCapacity(tier: string): number {
    switch (tier) {
      case 'tier_1': return 500 + this.prng.next() * 2000 // $500M - $2.5B
      case 'tier_2': return 100 + this.prng.next() * 400 // $100M - $500M
      case 'tier_3': return 25 + this.prng.next() * 150 // $25M - $175M
      default: return 100
    }
  }

  private getTierDebtCapacity(tier: string): number {
    switch (tier) {
      case 'tier_1': return 2000 + this.prng.next() * 8000 // $2B - $10B
      case 'tier_2': return 300 + this.prng.next() * 1200 // $300M - $1.5B
      case 'tier_3': return 50 + this.prng.next() * 450 // $50M - $500M
      default: return 300
    }
  }

  private getTierCostOfCapital(tier: string): number {
    switch (tier) {
      case 'tier_1': return 0.08 + this.prng.next() * 0.04
      case 'tier_2': return 0.10 + this.prng.next() * 0.05
      case 'tier_3': return 0.12 + this.prng.next() * 0.06
      default: return 0.10
    }
  }

  private generateTrackRecord(type: BidderType, tier: string): TrackRecord {
    const baseDeals = tier === 'tier_1' ? 20 : tier === 'tier_2' ? 12 : 6
    const sizeMult = tier === 'tier_1' ? 5 : tier === 'tier_2' ? 2 : 1

    return {
      totalDeals: baseDeals + Math.floor(this.prng.next() * baseDeals),
      sectorExperience: 0.4 + this.prng.next() * 0.6,
      avgDealSize: sizeMult * (50 + this.prng.next() * 200), // millions
      successRate: 0.6 + this.prng.next() * 0.35,
      timeToClose: 60 + this.prng.next() * 60, // days
      postDealPerformance: type === BidderType.FINANCIAL_BUYER ? 
        0.6 + this.prng.next() * 0.4 : 0.5 + this.prng.next() * 0.4
    }
  }

  private generateSynergyAnalysis(): SynergyAnalysis {
    const revenue = this.prng.next() * 100 // $0-100M
    const cost = this.prng.next() * 50 // $0-50M
    const tax = this.prng.next() * 20 // $0-20M
    const financing = this.prng.next() * 30 // $0-30M

    return {
      revenueSynergies: revenue,
      costSynergies: cost,
      taxSynergies: tax,
      financingSynergies: financing,
      totalValue: revenue + cost + tax + financing,
      realizationProbability: 0.5 + this.prng.next() * 0.4,
      timeToRealize: 1 + this.prng.next() * 3 // 1-4 years
    }
  }

  private generateBidderTeam(tier: string): BidderTeam {
    const quality = this.getTierReputation(tier)
    
    return {
      principalInvolvement: quality,
      industryExpertise: 0.4 + this.prng.next() * 0.6,
      executionExperience: quality,
      bandwidth: 0.5 + this.prng.next() * 0.5,
      continuity: 0.6 + this.prng.next() * 0.4
    }
  }

  private selectAdvisors(type: BidderType): string[] {
    const advisors = ['Goldman Sachs', 'Morgan Stanley', 'JP Morgan', 'Bank of America', 
                     'Credit Suisse', 'Barclays', 'Deutsche Bank', 'Wells Fargo',
                     'Jefferies', 'Guggenheim', 'Lazard', 'Evercore']
    
    const count = type === BidderType.STRATEGIC_BUYER ? 1 + Math.floor(this.prng.next() * 2) : 
                  1 + Math.floor(this.prng.next() * 3)
    
    const shuffled = [...advisors].sort(() => 0.5 - this.prng.next())
    return shuffled.slice(0, count)
  }

  private generateDDApproach(type: BidderType): DDApproach {
    const approaches = {
      [BidderType.FINANCIAL_BUYER]: {
        depth: 'extensive' as const,
        speed: 'normal' as const,
        focus: ['financial', 'operational', 'market', 'management']
      },
      [BidderType.STRATEGIC_BUYER]: {
        depth: 'extensive' as const,
        speed: 'thorough' as const,
        focus: ['strategic', 'synergies', 'integration', 'regulatory']
      },
      [BidderType.FAMILY_OFFICE]: {
        depth: 'standard' as const,
        speed: 'thorough' as const,
        focus: ['financial', 'management', 'governance']
      }
    }
    
    const base = approaches[type] || approaches[BidderType.FINANCIAL_BUYER]
    
    return {
      depth: base.depth,
      speed: base.speed,
      focus: base.focus,
      advisorQuality: 0.6 + this.prng.next() * 0.4
    }
  }

  private initializeAdvisorNetwork(): void {
    const advisors = [
      { name: 'Goldman Sachs', tier: 'bulge_bracket' as const },
      { name: 'Morgan Stanley', tier: 'bulge_bracket' as const },
      { name: 'JP Morgan', tier: 'bulge_bracket' as const },
      { name: 'Bank of America', tier: 'bulge_bracket' as const },
      { name: 'Jefferies', tier: 'middle_market' as const },
      { name: 'Guggenheim', tier: 'middle_market' as const },
      { name: 'Lazard', tier: 'boutique' as const },
      { name: 'Evercore', tier: 'boutique' as const }
    ]

    advisors.forEach(advisor => {
      this.advisorNetwork.set(advisor.name, {
        bankName: advisor.name,
        tier: advisor.tier,
        reputation: this.getAdvisorReputation(advisor.tier),
        sectorExpertise: 0.6 + this.prng.next() * 0.4,
        processExecution: this.getAdvisorExecution(advisor.tier),
        clientRelationships: 0.5 + this.prng.next() * 0.5,
        fees: {
          retainer: advisor.tier === 'bulge_bracket' ? 2 : advisor.tier === 'middle_market' ? 1 : 0.5,
          success: advisor.tier === 'bulge_bracket' ? 1.0 : advisor.tier === 'middle_market' ? 0.8 : 0.6
        }
      })
    })
  }

  private getAdvisorReputation(tier: 'bulge_bracket' | 'middle_market' | 'boutique'): number {
    switch (tier) {
      case 'bulge_bracket': return 0.85 + this.prng.next() * 0.15
      case 'middle_market': return 0.7 + this.prng.next() * 0.25
      case 'boutique': return 0.8 + this.prng.next() * 0.2
    }
  }

  private getAdvisorExecution(tier: 'bulge_bracket' | 'middle_market' | 'boutique'): number {
    switch (tier) {
      case 'bulge_bracket': return 0.8 + this.prng.next() * 0.2
      case 'middle_market': return 0.75 + this.prng.next() * 0.25
      case 'boutique': return 0.85 + this.prng.next() * 0.15
    }
  }

  // Main auction creation method
  createAdvancedAuction(
    deal: Deal,
    type: AuctionType,
    sellSideAdvisor?: string
  ): AdvancedAuction {
    const auctionId = `AUC_${deal.id}_${Date.now()}`
    const advisor = sellSideAdvisor ? 
      this.advisorNetwork.get(sellSideAdvisor) || this.selectSellSideAdvisor(deal) :
      this.selectSellSideAdvisor(deal)

    const auction: AdvancedAuction = {
      id: auctionId,
      dealId: deal.id,
      type,
      phase: AuctionPhase.TEASER,
      sellSide: advisor,
      buySide: [],
      
      participantList: this.selectAuctionParticipants(deal, type),
      currentBids: [],
      leadingBid: null,
      
      phases: this.generateAuctionPhases(type),
      currentDeadline: new Date(),
      totalDuration: this.calculateAuctionDuration(type),
      compressionFactor: this.calculateCompressionFactor(deal, type),
      
      competitionIntensity: 0.5,
      informationFlow: [],
      dueEligence: [],
      
      breakupFee: this.calculateBreakupFee(deal.entryMultiple * deal.metrics.ebitda),
      reverseBreakupFee: 0,
      
      exclusivityPeriods: [],
      materialAdverseChange: [],
      closingConditions: [],
      representationsWarranties: []
    }

    // Add stapled financing if applicable
    if (type === AuctionType.STAPLED_FINANCING) {
      auction.stapledFinancing = this.createStapledFinancing(deal)
    }

    this.auctions.set(auctionId, auction)
    return auction
  }

  private selectSellSideAdvisor(deal: Deal): SellSideAdvisor {
    const advisorOptions = Array.from(this.advisorNetwork.values())
    
    // Weight selection by reputation and sector expertise
    const weights = advisorOptions.map(advisor => 
      advisor.reputation * advisor.sectorExpertise * advisor.processExecution
    )
    
    const totalWeight = weights.reduce((sum, w) => sum + w, 0)
    let random = this.prng.next() * totalWeight
    
    for (let i = 0; i < advisorOptions.length; i++) {
      random -= weights[i]
      if (random <= 0) {
        return advisorOptions[i]
      }
    }
    
    return advisorOptions[0]
  }

  private selectAuctionParticipants(deal: Deal, type: AuctionType): AuctionParticipant[] {
    const allBidders = Array.from(this.bidderDatabase.values())
    
    // Filter by capacity
    const qualifiedBidders = allBidders.filter(bidder => {
      const dealValue = deal.entryMultiple * deal.metrics.ebitda
      return bidder.totalCapacity === 0 || // Initialize capacity
             (bidder.equityCapacity + bidder.debtCapacity) >= dealValue * 0.7
    })

    // Set capacity for bidders
    qualifiedBidders.forEach(bidder => {
      if (bidder.totalCapacity === 0) {
        bidder.totalCapacity = bidder.equityCapacity + bidder.debtCapacity
      }
    })

    // Determine participation list size based on auction type
    let targetParticipants: number
    switch (type) {
      case AuctionType.BROAD_AUCTION:
        targetParticipants = 15 + Math.floor(this.prng.next() * 20) // 15-35
        break
      case AuctionType.LIMITED_AUCTION:
        targetParticipants = 5 + Math.floor(this.prng.next() * 10) // 5-15
        break
      case AuctionType.NEGOTIATED_SALE:
        targetParticipants = 1 + Math.floor(this.prng.next() * 3) // 1-3
        break
      default:
        targetParticipants = 8 + Math.floor(this.prng.next() * 12) // 8-20
    }

    // Prioritize by reputation, financial strength, and strategic fit
    const scoredBidders = qualifiedBidders.map(bidder => ({
      bidder,
      score: bidder.reputation * 0.4 + 
             bidder.financialStrength * 0.3 + 
             bidder.strategicFit * 0.2 +
             bidder.executionCertainty * 0.1
    }))

    scoredBidders.sort((a, b) => b.score - a.score)
    
    return scoredBidders
      .slice(0, Math.min(targetParticipants, scoredBidders.length))
      .map(item => ({ ...item.bidder })) // Clone to avoid mutation
  }

  private generateAuctionPhases(type: AuctionType): AuctionPhaseDetail[] {
    const basePhases: AuctionPhaseDetail[] = [
      {
        phase: AuctionPhase.TEASER,
        startDate: new Date(),
        duration: 5,
        activities: [
          { activity: 'Distribute teaser', responsible: 'advisor', timeframe: 1, dependencies: [] },
          { activity: 'Initial interest gathering', responsible: 'advisor', timeframe: 4, dependencies: ['Distribute teaser'] }
        ],
        deliverables: ['Teaser document', 'NDA template'],
        participantActions: []
      },
      {
        phase: AuctionPhase.FIRST_ROUND,
        startDate: new Date(),
        duration: 21,
        activities: [
          { activity: 'Release CIM', responsible: 'advisor', timeframe: 2, dependencies: [] },
          { activity: 'Data room setup', responsible: 'seller', timeframe: 3, dependencies: [] },
          { activity: 'First round bids', responsible: 'buyer', timeframe: 21, dependencies: ['Release CIM'] }
        ],
        deliverables: ['Confidential Information Memorandum', 'Process letter', 'Data room access'],
        participantActions: []
      },
      {
        phase: AuctionPhase.MANAGEMENT_PRESENTATION,
        startDate: new Date(),
        duration: 14,
        activities: [
          { activity: 'Schedule presentations', responsible: 'advisor', timeframe: 3, dependencies: [] },
          { activity: 'Management presentations', responsible: 'seller', timeframe: 10, dependencies: ['Schedule presentations'] },
          { activity: 'Site visits', responsible: 'seller', timeframe: 14, dependencies: [] }
        ],
        deliverables: ['Presentation schedule', 'Site visit logistics'],
        participantActions: []
      },
      {
        phase: AuctionPhase.FINAL_ROUND,
        startDate: new Date(),
        duration: 14,
        activities: [
          { activity: 'Final round instructions', responsible: 'advisor', timeframe: 2, dependencies: [] },
          { activity: 'Final bids submission', responsible: 'buyer', timeframe: 14, dependencies: ['Final round instructions'] }
        ],
        deliverables: ['Final bid instructions', 'Purchase agreement draft'],
        participantActions: []
      }
    ]

    // Adjust phases based on auction type
    if (type === AuctionType.COMPRESSED_TIMELINE) {
      basePhases.forEach(phase => {
        phase.duration = Math.ceil(phase.duration * 0.6) // 40% compression
      })
    }

    return basePhases
  }

  private calculateAuctionDuration(type: AuctionType): number {
    const baseDurations: Record<AuctionType, number> = {
      [AuctionType.BROAD_AUCTION]: 90,
      [AuctionType.LIMITED_AUCTION]: 70,
      [AuctionType.DUAL_TRACK]: 120,
      [AuctionType.NEGOTIATED_SALE]: 45,
      [AuctionType.STAPLED_FINANCING]: 75,
      [AuctionType.COMPRESSED_TIMELINE]: 50
    }

    return baseDurations[type] + Math.floor(this.prng.next() * 30) - 15 // ±15 days variation
  }

  private calculateCompressionFactor(deal: Deal, type: AuctionType): number {
    let base = 1.0
    
    if (type === AuctionType.COMPRESSED_TIMELINE) base = 0.6
    if (deal.public) base *= 0.8 // Public deals often compressed
    if (deal.meters.momentum > 0.8) base *= 0.9 // Hot deals move faster
    
    return Math.max(0.4, base)
  }

  private calculateBreakupFee(dealValue: number): number {
    // Typically 2-4% of deal value
    const percentage = 0.02 + this.prng.next() * 0.02
    return dealValue * percentage
  }

  private createStapledFinancing(deal: Deal): StapledFinancing {
    const leverage = 4.5 + this.prng.next() * 2 // 4.5-6.5x
    const debtAmount = deal.metrics.ebitda * leverage

    return {
      provider: 'Lead Arranger Bank',
      structure: [
        {
          provider: 'Bank Syndicate',
          amount: debtAmount * 0.7,
          type: 'senior',
          commitment: 'highly_confident',
          pricing: { margin: 300 + this.prng.next() * 200, floor: 100 },
          terms: ['covenant-lite', '7-year term', 'SOFR + margin']
        },
        {
          provider: 'Institutional Lenders',
          amount: debtAmount * 0.3,
          type: 'subordinated',
          commitment: 'highly_confident',
          pricing: { margin: 600 + this.prng.next() * 300, floor: 100 },
          terms: ['8-year term', 'PIK toggle', 'call protection']
        }
      ],
      commitment: this.prng.next() < 0.7 ? 'highly_confident' : 'firm',
      terms: {
        leverage,
        pricing: { margin: 300 + this.prng.next() * 200, floor: 100 },
        covenants: this.prng.next() < 0.8 ? 'covenant_lite' : 'maintenance',
        call_protection: 1 + Math.floor(this.prng.next() * 2),
        amortization: this.prng.next() * 0.05
      },
      competitiveProcess: this.prng.next() < 0.3
    }
  }

  // Advance auction through phases
  advanceAuctionPhase(auctionId: string): void {
    const auction = this.auctions.get(auctionId)
    if (!auction) return

    const phaseOrder = [
      AuctionPhase.TEASER,
      AuctionPhase.FIRST_ROUND,
      AuctionPhase.MANAGEMENT_PRESENTATION,
      AuctionPhase.SECOND_ROUND,
      AuctionPhase.FINAL_ROUND,
      AuctionPhase.BEST_AND_FINAL,
      AuctionPhase.NEGOTIATION,
      AuctionPhase.SIGNING
    ]

    const currentIndex = phaseOrder.indexOf(auction.phase)
    if (currentIndex < phaseOrder.length - 1) {
      auction.phase = phaseOrder[currentIndex + 1]
      
      // Update participant qualification for next round
      this.qualifyParticipantsForNextRound(auction)
      
      // Update competition intensity
      this.updateCompetitionIntensity(auction)
    }
  }

  private qualifyParticipantsForNextRound(auction: AdvancedAuction): void {
    // Eliminate participants based on phase and performance
    const eliminationRates: Record<AuctionPhase, number> = {
      [AuctionPhase.TEASER]: 0.1,
      [AuctionPhase.FIRST_ROUND]: 0.4,
      [AuctionPhase.MANAGEMENT_PRESENTATION]: 0.2,
      [AuctionPhase.SECOND_ROUND]: 0.3,
      [AuctionPhase.FINAL_ROUND]: 0.5,
      [AuctionPhase.BEST_AND_FINAL]: 0.7,
      [AuctionPhase.NEGOTIATION]: 0.0,
      [AuctionPhase.SIGNING]: 0.0
    }

    const eliminationRate = eliminationRates[auction.phase] || 0
    
    auction.participantList.forEach(participant => {
      if (participant.qualifiedForNextRound && this.prng.next() < eliminationRate) {
        participant.qualifiedForNextRound = false
        participant.eliminationReason = this.getEliminationReason(auction.phase)
      }
    })
  }

  private getEliminationReason(phase: AuctionPhase): string {
    const reasons: Record<AuctionPhase, string[]> = {
      [AuctionPhase.TEASER]: ['No interest expressed', 'Capacity constraints'],
      [AuctionPhase.FIRST_ROUND]: ['Non-competitive bid', 'Financing concerns', 'Strategic misfit'],
      [AuctionPhase.MANAGEMENT_PRESENTATION]: ['Due diligence findings', 'Management concerns'],
      [AuctionPhase.SECOND_ROUND]: ['Price expectations gap', 'Execution risk'],
      [AuctionPhase.FINAL_ROUND]: ['Final bid not competitive', 'Terms not acceptable'],
      [AuctionPhase.BEST_AND_FINAL]: ['Selected other bidder', 'Final negotiation'],
      [AuctionPhase.NEGOTIATION]: [''],
      [AuctionPhase.SIGNING]: ['']
    }

    const phaseReasons = reasons[phase] || ['Process elimination']
    return phaseReasons[Math.floor(this.prng.next() * phaseReasons.length)]
  }

  private updateCompetitionIntensity(auction: AdvancedAuction): void {
    const qualifiedCount = auction.participantList.filter(p => p.qualifiedForNextRound).length
    const totalCount = auction.participantList.length
    
    auction.competitionIntensity = qualifiedCount / Math.max(1, totalCount)
    
    // Adjust for auction type
    switch (auction.type) {
      case AuctionType.BROAD_AUCTION:
        auction.competitionIntensity *= 1.2
        break
      case AuctionType.LIMITED_AUCTION:
        auction.competitionIntensity *= 1.0
        break
      case AuctionType.NEGOTIATED_SALE:
        auction.competitionIntensity *= 0.5
        break
    }
    
    auction.competitionIntensity = Math.min(1.0, auction.competitionIntensity)
  }

  // Generate bid based on bidder characteristics
  generateBid(
    auctionId: string,
    bidderId: string,
    deal: Deal
  ): BidSubmission | null {
    const auction = this.auctions.get(auctionId)
    const bidder = this.bidderDatabase.get(bidderId)
    
    if (!auction || !bidder || !bidder.qualifiedForNextRound) {
      return null
    }

    const baseValue = deal.entryMultiple * deal.metrics.ebitda
    const bidValue = this.calculateBidValue(bidder, baseValue, auction.competitionIntensity)

    const bid: BidSubmission = {
      id: `BID_${auctionId}_${bidderId}_${Date.now()}`,
      bidderId,
      submissionDate: new Date(),
      phase: auction.phase,
      
      enterpriseValue: bidValue,
      equityValue: bidValue, // Simplified
      cashFree: true,
      debtFree: true,
      workingCapitalPeg: baseValue * 0.1,
      
      considerationMix: this.generateConsiderationMix(bidder),
      financingStructure: this.generateFinancingStructure(bidder, bidValue),
      closingDate: new Date(Date.now() + (60 + this.prng.next() * 30) * 24 * 60 * 60 * 1000),
      
      representations: this.generateRepresentationScope(bidder),
      indemnification: this.generateIndemnificationStructure(bidValue),
      escrow: this.generateEscrowStructure(bidValue),
      
      financingCondition: this.generateFinancingCondition(bidder),
      diligenceCondition: this.generateDiligenceCondition(bidder),
      regulatoryApprovals: this.generateRegulatoryApprovals(bidder, deal),
      materialAdverseChange: this.generateMACDefinition(bidder),
      
      certaintyScore: this.calculateCertaintyScore(bidder, auction),
      riskFactors: this.generateRiskFactors(bidder, deal),
      mitigants: this.generateMitigants(bidder),
      
      competitiveAdvantages: this.generateCompetitiveAdvantages(bidder),
      differentiators: this.generateDifferentiators(bidder),
      processComments: 'Committed to executing on announced timeline'
    }

    auction.currentBids.push(bid)
    
    // Update leading bid
    if (!auction.leadingBid || bid.enterpriseValue > auction.leadingBid.enterpriseValue) {
      auction.leadingBid = bid
    }

    return bid
  }

  private calculateBidValue(
    bidder: AuctionParticipant,
    baseValue: number,
    competitionIntensity: number
  ): number {
    let bidMultiplier = 0.9 + this.prng.next() * 0.3 // 0.9-1.2x base
    
    // Adjust for bidder characteristics
    bidMultiplier += bidder.biddingAggression * 0.2
    bidMultiplier += competitionIntensity * 0.15
    
    // Strategic buyers can bid higher due to synergies
    if (bidder.type === BidderType.STRATEGIC_BUYER && bidder.synergies) {
      const synergyValue = bidder.synergies.totalValue * bidder.synergies.realizationProbability
      bidMultiplier += (synergyValue / baseValue) * 0.5
    }
    
    // Tier 1 bidders more aggressive
    if (bidder.tier === 'tier_1') {
      bidMultiplier += 0.05
    }
    
    return Math.max(baseValue * 0.8, baseValue * bidMultiplier)
  }

  private generateConsiderationMix(bidder: AuctionParticipant): ConsiderationMix {
    if (bidder.type === BidderType.STRATEGIC_BUYER) {
      return {
        cash: 0.7 + this.prng.next() * 0.25,
        stock: this.prng.next() * 0.2,
        earnout: this.prng.next() < 0.4 ? this.generateEarnout() : null,
        otherConsideration: 0
      }
    } else {
      return {
        cash: 0.95 + this.prng.next() * 0.05,
        stock: 0,
        earnout: this.prng.next() < 0.1 ? this.generateEarnout() : null,
        otherConsideration: 0
      }
    }
  }

  private generateEarnout(): EarnoutStructure {
    return {
      amount: 10 + this.prng.next() * 40, // $10-50M
      period: 2 + Math.floor(this.prng.next() * 3), // 2-4 years
      metric: this.prng.next() < 0.7 ? 'ebitda' : 'revenue',
      threshold: 100 + this.prng.next() * 100, // $100-200M threshold
      cap: 50 + this.prng.next() * 100, // $50-150M cap
      protections: ['no adverse changes', 'maintain operations', 'earnest efforts']
    }
  }

  private generateFinancingStructure(bidder: AuctionParticipant, bidValue: number): BidFinancing {
    const equityNeeded = bidValue * 0.4 // Assume 40% equity
    const debtNeeded = bidValue * 0.6 // 60% debt

    return {
      equityCommitment: Math.min(equityNeeded, bidder.equityCapacity),
      debtFinancing: [
        {
          provider: 'Lead Bank',
          amount: debtNeeded * 0.7,
          type: 'senior',
          commitment: bidder.tier === 'tier_1' ? 'firm' : 'highly_confident',
          pricing: { margin: 250 + this.prng.next() * 300, floor: 100 },
          terms: ['7-year term', 'covenant-lite']
        }
      ],
      contingency: 0.05,
      backstop: bidder.tier === 'tier_1' && this.prng.next() < 0.3,
      marketFlex: []
    }
  }

  private generateRepresentationScope(bidder: AuctionParticipant): RepresentationScope {
    return {
      fundamental: true,
      businessSpecific: true,
      financial: true,
      survivalPeriod: bidder.type === BidderType.STRATEGIC_BUYER ? 
        12 + Math.floor(this.prng.next() * 24) : 18 + Math.floor(this.prng.next() * 18),
      basketThreshold: 0.5 + this.prng.next() * 1.5, // 0.5-2% of enterprise value
      capAmount: 10 + this.prng.next() * 15 // 10-25% of enterprise value
    }
  }

  private generateIndemnificationStructure(bidValue: number): IndemnificationStructure {
    return {
      generalCap: bidValue * (0.10 + this.prng.next() * 0.15), // 10-25%
      fundamentalCap: bidValue, // 100% for fundamental reps
      survivalPeriod: 18 + Math.floor(this.prng.next() * 24), // 18-42 months
      basketAmount: bidValue * (0.005 + this.prng.next() * 0.015), // 0.5-2%
      deductible: bidValue * this.prng.next() * 0.005 // 0-0.5%
    }
  }

  private generateEscrowStructure(bidValue: number): EscrowStructure {
    return {
      generalEscrow: { 
        amount: bidValue * (0.05 + this.prng.next() * 0.10), 
        period: 12 + Math.floor(this.prng.next() * 24) 
      },
      representationEscrow: { 
        amount: bidValue * (0.02 + this.prng.next() * 0.05), 
        period: 18 + Math.floor(this.prng.next() * 18) 
      },
      adjustmentEscrow: { 
        amount: bidValue * (0.01 + this.prng.next() * 0.02), 
        period: 6 + Math.floor(this.prng.next() * 6) 
      }
    }
  }

  private generateFinancingCondition(bidder: AuctionParticipant): FinancingCondition {
    const conditionType = bidder.tier === 'tier_1' && this.prng.next() < 0.3 ? 'none' :
                         bidder.tier === 'tier_1' ? 'limited' : 'full'
    
    return {
      type: conditionType,
      exceptions: conditionType === 'limited' ? ['material adverse change', 'accuracy of reps'] : [],
      drops: [],
      flexibilityProvisions: conditionType !== 'none' ? ['best efforts', 'alternative financing'] : []
    }
  }

  private generateDiligenceCondition(bidder: AuctionParticipant): DiligenceCondition {
    return {
      scope: bidder.dueDiligenceApproach.depth,
      timeframe: bidder.dueDiligenceApproach.speed === 'fast' ? 15 : 
                bidder.dueDiligenceApproach.speed === 'normal' ? 25 : 35,
      materialityThreshold: 0.02 + this.prng.next() * 0.03, // 2-5%
      exceptions: ['general business risks', 'known issues']
    }
  }

  private generateRegulatoryApprovals(bidder: AuctionParticipant, deal: Deal): RegulatoryApproval[] {
    const approvals: RegulatoryApproval[] = []
    
    if (bidder.type === BidderType.STRATEGIC_BUYER) {
      approvals.push({
        jurisdiction: 'US',
        agency: 'DOJ/FTC',
        timeframe: 30 + Math.floor(this.prng.next() * 60),
        probability: 0.8 + this.prng.next() * 0.19,
        risk: this.prng.next() < 0.7 ? 'low' : this.prng.next() < 0.9 ? 'medium' : 'high'
      })
    }
    
    return approvals
  }

  private generateMACDefinition(bidder: AuctionParticipant): MACDefinition {
    return {
      scope: bidder.type === BidderType.STRATEGIC_BUYER ? 'broad' : 'narrow',
      carveouts: ['general economic conditions', 'industry conditions', 'regulatory changes'],
      quantitativeThresholds: this.prng.next() < 0.3,
      durations: this.prng.next() < 0.5
    }
  }

  private calculateCertaintyScore(bidder: AuctionParticipant, auction: AdvancedAuction): number {
    let score = bidder.executionCertainty
    
    // Adjust for financing condition
    if (bidder.tier === 'tier_1') score += 0.1
    if (auction.stapledFinancing && this.prng.next() < 0.5) score += 0.05
    
    // Strategic buyers face integration risk
    if (bidder.type === BidderType.STRATEGIC_BUYER) {
      score -= bidder.integrationRisk * 0.1
    }
    
    return Math.max(0.1, Math.min(1.0, score))
  }

  private generateRiskFactors(bidder: AuctionParticipant, deal: Deal): RiskFactor[] {
    const factors: RiskFactor[] = []
    
    if (bidder.type === BidderType.STRATEGIC_BUYER) {
      factors.push({
        category: 'Integration',
        description: 'Risk of integration challenges',
        probability: bidder.integrationRisk,
        impact: 0.3 + this.prng.next() * 0.4,
        mitigation: 'Dedicated integration team'
      })
    }
    
    factors.push({
      category: 'Financing',
      description: 'Market financing risk',
      probability: 0.1 + this.prng.next() * 0.2,
      impact: 0.8 + this.prng.next() * 0.2,
      mitigation: 'Committed facilities and backstop'
    })
    
    return factors
  }

  private generateMitigants(bidder: AuctionParticipant): string[] {
    const mitigants = [
      'Strong balance sheet and liquidity',
      'Experienced deal team',
      'Committed financing sources'
    ]
    
    if (bidder.tier === 'tier_1') {
      mitigants.push('Track record of successful transactions')
    }
    
    if (bidder.type === BidderType.STRATEGIC_BUYER) {
      mitigants.push('Strategic rationale and synergies')
    }
    
    return mitigants
  }

  private generateCompetitiveAdvantages(bidder: AuctionParticipant): string[] {
    const advantages: string[] = []
    
    if (bidder.type === BidderType.STRATEGIC_BUYER) {
      advantages.push('Revenue and cost synergies')
      advantages.push('Strategic fit and market position')
    } else {
      advantages.push('Proven value creation track record')
      advantages.push('Industry expertise and relationships')
    }
    
    if (bidder.tier === 'tier_1') {
      advantages.push('Blue-chip reputation and execution certainty')
    }
    
    return advantages
  }

  private generateDifferentiators(bidder: AuctionParticipant): string[] {
    const differentiators: string[] = []
    
    if (bidder.biddingAggression > 0.7) {
      differentiators.push('Aggressive valuation approach')
    }
    
    if (bidder.executionCertainty > 0.8) {
      differentiators.push('High execution certainty')
    }
    
    if (bidder.type === BidderType.STRATEGIC_BUYER) {
      differentiators.push('Long-term strategic ownership')
    }
    
    return differentiators
  }

  // Public accessors and utilities
  getAuction(auctionId: string): AdvancedAuction | undefined {
    return this.auctions.get(auctionId)
  }

  getActiveAuctions(): AdvancedAuction[] {
    return Array.from(this.auctions.values()).filter(auction => 
      auction.phase !== AuctionPhase.SIGNING
    )
  }

  getBidsForAuction(auctionId: string): BidSubmission[] {
    const auction = this.auctions.get(auctionId)
    return auction ? [...auction.currentBids] : []
  }

  getLeadingBid(auctionId: string): BidSubmission | null {
    const auction = this.auctions.get(auctionId)
    return auction ? auction.leadingBid : null
  }

  analyzeCompetitivePosition(auctionId: string, bidderId: string): any {
    const auction = this.auctions.get(auctionId)
    if (!auction) return null

    const bidderBid = auction.currentBids.find(bid => bid.bidderId === bidderId)
    if (!bidderBid) return null

    const allBids = auction.currentBids.sort((a, b) => b.enterpriseValue - a.enterpriseValue)
    const bidRank = allBids.findIndex(bid => bid.id === bidderBid.id) + 1
    const valueGap = auction.leadingBid ? auction.leadingBid.enterpriseValue - bidderBid.enterpriseValue : 0

    return {
      rank: bidRank,
      totalBidders: allBids.length,
      valueGap,
      competitivePosition: bidRank === 1 ? 'leading' : bidRank <= 3 ? 'competitive' : 'trailing',
      recommendedActions: this.generateRecommendedActions(bidRank, valueGap, auction.phase)
    }
  }

  private generateRecommendedActions(rank: number, valueGap: number, phase: AuctionPhase): string[] {
    const actions: string[] = []
    
    if (rank > 1 && valueGap > 0) {
      actions.push(`Consider increasing bid by $${(valueGap / 1000000).toFixed(0)}M to match leading bid`)
    }
    
    if (phase === AuctionPhase.FINAL_ROUND) {
      actions.push('Focus on execution certainty and deal terms')
      actions.push('Highlight competitive advantages and differentiators')
    }
    
    if (rank > 3) {
      actions.push('Reassess strategic rationale and walk-away price')
    }
    
    return actions
  }
}