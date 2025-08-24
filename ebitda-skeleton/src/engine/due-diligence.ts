import { PRNG } from './prng'
import type { Deal, Firm } from './types'

export enum DiligenceStream {
  COMMERCIAL = 'commercial',
  FINANCIAL = 'financial',
  LEGAL = 'legal',
  OPERATIONAL = 'operational',
  ENVIRONMENTAL = 'environmental',
  TAX = 'tax',
  IT = 'it',
  INSURANCE = 'insurance'
}

export enum DiligenceIssue {
  CRITICAL = 'critical',
  MAJOR = 'major',
  MINOR = 'minor',
  NONE = 'none'
}

export interface DiligenceFinding {
  stream: DiligenceStream
  severity: DiligenceIssue
  description: string
  impactOnValuation: number // percentage impact
  remediationCost?: number
  remediationTime?: number // days
  walkAwayRisk: number // 0-1 probability
  negotiationLeverage: number // 0-100
}

export interface QualityOfEarnings {
  reportedEBITDA: number
  normalizedEBITDA: number
  adjustments: EBITDAAdjustment[]
  sustainableEBITDA: number
  marginTrend: 'improving' | 'stable' | 'declining'
  revenueQuality: 'recurring' | 'repeat' | 'transactional'
  customerConcentration: number // top 10 customers as % of revenue
}

export interface EBITDAAdjustment {
  category: string
  amount: number
  recurring: boolean
  accepted: boolean
  description: string
}

export interface WorkingCapitalAnalysis {
  targetNWC: number // normalized working capital
  actualNWC: number
  adjustment: number // price adjustment
  seasonality: boolean
  cashConversionCycle: number // days
  dsoTrend: 'improving' | 'stable' | 'deteriorating'
  dpoTrend: 'extending' | 'stable' | 'shortening'
}

export interface ManagementAssessment {
  ceoScore: number // 0-100
  cfoScore: number // 0-100
  teamDepth: number // 0-100
  successionRisk: boolean
  retentionRequired: string[] // key people to retain
  cultureFit: number // 0-100
  incentiveAlignment: number // 0-100
}

export interface DiligenceReport {
  overallScore: number // 0-100
  findings: DiligenceFinding[]
  qofE: QualityOfEarnings
  workingCapital: WorkingCapitalAnalysis
  management: ManagementAssessment
  redFlags: string[]
  dealBreakers: string[]
  valueCreationOpportunities: string[]
  synergyPotential: number // in dollars
  integrationComplexity: 'low' | 'medium' | 'high'
  recommendedPrice: number
  recommendedStructure: string
}

export class DueDiligenceEngine {
  private prng: PRNG
  
  constructor(prng: PRNG) {
    this.prng = prng
  }

  conductDueDiligence(
    deal: Deal, 
    firm: Firm,
    budget: number,
    timeAvailable: number
  ): DiligenceReport {
    const findings = this.generateFindings(deal, firm, budget)
    const qofE = this.conductQofE(deal)
    const workingCapital = this.analyzeWorkingCapital(deal)
    const management = this.assessManagement(deal, firm)
    
    const redFlags = this.identifyRedFlags(findings, qofE, management)
    const dealBreakers = this.identifyDealBreakers(findings, redFlags)
    const opportunities = this.identifyValueCreation(deal, findings)
    
    const overallScore = this.calculateOverallScore(
      findings, qofE, workingCapital, management
    )
    
    return {
      overallScore,
      findings,
      qofE,
      workingCapital,
      management,
      redFlags,
      dealBreakers,
      valueCreationOpportunities: opportunities,
      synergyPotential: this.calculateSynergyPotential(deal, firm),
      integrationComplexity: this.assessIntegrationComplexity(deal, findings),
      recommendedPrice: this.calculateRecommendedPrice(
        deal, qofE, workingCapital, findings
      ),
      recommendedStructure: this.recommendStructure(findings, management)
    }
  }

  private generateFindings(
    deal: Deal, 
    firm: Firm,
    budget: number
  ): DiligenceFinding[] {
    const findings: DiligenceFinding[] = []
    const streams = Object.values(DiligenceStream)
    
    for (const stream of streams) {
      const finding = this.generateStreamFinding(stream, deal, firm, budget)
      if (finding) findings.push(finding)
    }
    
    return findings
  }

  private generateStreamFinding(
    stream: DiligenceStream,
    deal: Deal,
    firm: Firm,
    budget: number
  ): DiligenceFinding | null {
    // Higher budget and reputation improve finding quality
    const thoroughness = Math.min(1, (budget / 5000000) * (firm.reputation / 100))
    
    // Fragility increases chance of issues
    const issueChance = (deal.meters.fragility / 100) * 0.7 + 0.1
    
    if (this.prng.next() > issueChance * thoroughness) {
      return null // No significant finding
    }
    
    const severity = this.determineSeverity(stream, deal)
    if (severity === DiligenceIssue.NONE) return null
    
    return {
      stream,
      severity,
      description: this.generateFindingDescription(stream, severity),
      impactOnValuation: this.calculateValuationImpact(severity),
      remediationCost: severity === DiligenceIssue.CRITICAL ? 
        this.prng.range(1000000, 10000000) : 
        this.prng.range(100000, 1000000),
      remediationTime: severity === DiligenceIssue.CRITICAL ? 
        this.prng.range(90, 365) : 
        this.prng.range(30, 90),
      walkAwayRisk: this.calculateWalkAwayRisk(severity),
      negotiationLeverage: this.calculateNegotiationLeverage(severity)
    }
  }

  private determineSeverity(stream: DiligenceStream, deal: Deal): DiligenceIssue {
    const rand = this.prng.next()
    const fragilityFactor = deal.meters.fragility / 100
    
    // Critical issues more likely with high fragility
    if (rand < 0.05 * (1 + fragilityFactor)) {
      return DiligenceIssue.CRITICAL
    } else if (rand < 0.15 * (1 + fragilityFactor * 0.5)) {
      return DiligenceIssue.MAJOR
    } else if (rand < 0.4) {
      return DiligenceIssue.MINOR
    }
    
    return DiligenceIssue.NONE
  }

  private generateFindingDescription(
    stream: DiligenceStream, 
    severity: DiligenceIssue
  ): string {
    const descriptions: Record<DiligenceStream, Record<DiligenceIssue, string[]>> = {
      [DiligenceStream.COMMERCIAL]: {
        [DiligenceIssue.CRITICAL]: [
          'Major customer representing 40% of revenue at risk',
          'Core product facing imminent obsolescence',
          'Regulatory change will eliminate key revenue stream'
        ],
        [DiligenceIssue.MAJOR]: [
          'Customer concentration with top 3 clients at 60%',
          'Declining market share in core segment',
          'New competitor with superior technology entering'
        ],
        [DiligenceIssue.MINOR]: [
          'Some pricing pressure in commodity products',
          'Minor market share loss in non-core segment',
          'Need for sales force restructuring'
        ],
        [DiligenceIssue.NONE]: []
      },
      [DiligenceStream.FINANCIAL]: {
        [DiligenceIssue.CRITICAL]: [
          'Significant accounting irregularities discovered',
          'Undisclosed off-balance sheet liabilities',
          'Major working capital hole of $50M+'
        ],
        [DiligenceIssue.MAJOR]: [
          'EBITDA adjustments reduce valuation by 20%',
          'Aggressive revenue recognition practices',
          'Significant one-time gains inflating margins'
        ],
        [DiligenceIssue.MINOR]: [
          'Minor EBITDA normalization adjustments needed',
          'Some questionable expense capitalizations',
          'Inventory write-down risk identified'
        ],
        [DiligenceIssue.NONE]: []
      },
      [DiligenceStream.LEGAL]: {
        [DiligenceIssue.CRITICAL]: [
          'Pending litigation with potential $100M+ exposure',
          'Major regulatory investigation ongoing',
          'Key patents expiring with no protection'
        ],
        [DiligenceIssue.MAJOR]: [
          'Multiple employment lawsuits pending',
          'Environmental compliance issues at main facility',
          'Key customer contracts up for renewal'
        ],
        [DiligenceIssue.MINOR]: [
          'Minor compliance issues identified',
          'Some contracts need renegotiation',
          'IP portfolio needs strengthening'
        ],
        [DiligenceIssue.NONE]: []
      },
      [DiligenceStream.OPERATIONAL]: {
        [DiligenceIssue.CRITICAL]: [
          'Manufacturing facility operating at 110% capacity',
          'Critical IT systems end-of-life with no upgrade path',
          'Supply chain single point of failure identified'
        ],
        [DiligenceIssue.MAJOR]: [
          'Significant capex required for equipment refresh',
          'ERP system needs major upgrade',
          'Key supplier relationships deteriorating'
        ],
        [DiligenceIssue.MINOR]: [
          'Some operational inefficiencies identified',
          'Minor automation opportunities',
          'Inventory management improvements needed'
        ],
        [DiligenceIssue.NONE]: []
      },
      [DiligenceStream.ENVIRONMENTAL]: {
        [DiligenceIssue.CRITICAL]: [
          'Contaminated site with $50M+ remediation cost',
          'Major ESG violations affecting financing',
          'Carbon transition risk threatens business model'
        ],
        [DiligenceIssue.MAJOR]: [
          'Significant environmental remediation required',
          'Poor ESG scores affecting customer relationships',
          'Major sustainability investments needed'
        ],
        [DiligenceIssue.MINOR]: [
          'Minor environmental compliance issues',
          'ESG reporting needs improvement',
          'Some energy efficiency opportunities'
        ],
        [DiligenceIssue.NONE]: []
      },
      [DiligenceStream.TAX]: {
        [DiligenceIssue.CRITICAL]: [
          'Major tax audit with $20M+ exposure',
          'Transfer pricing structure under challenge',
          'Tax attributes not transferable in deal'
        ],
        [DiligenceIssue.MAJOR]: [
          'Uncertain tax positions totaling $10M',
          'State tax nexus issues identified',
          'International tax structure needs restructuring'
        ],
        [DiligenceIssue.MINOR]: [
          'Some tax planning opportunities identified',
          'Minor compliance issues to address',
          'R&D tax credit opportunities unexplored'
        ],
        [DiligenceIssue.NONE]: []
      },
      [DiligenceStream.IT]: {
        [DiligenceIssue.CRITICAL]: [
          'Major cybersecurity breach discovered',
          'Core systems have no disaster recovery',
          'Critical data integrity issues found'
        ],
        [DiligenceIssue.MAJOR]: [
          'Significant technical debt accumulated',
          'Major systems integration required',
          'Cybersecurity posture inadequate'
        ],
        [DiligenceIssue.MINOR]: [
          'Some legacy systems need updating',
          'Minor security patches required',
          'Documentation needs improvement'
        ],
        [DiligenceIssue.NONE]: []
      },
      [DiligenceStream.INSURANCE]: {
        [DiligenceIssue.CRITICAL]: [
          'Uninsured liability exposure discovered',
          'D&O insurance inadequate for transaction',
          'Major coverage gaps in cyber insurance'
        ],
        [DiligenceIssue.MAJOR]: [
          'Significant premium increases expected',
          'Some coverage gaps identified',
          'Claims history shows concerning pattern'
        ],
        [DiligenceIssue.MINOR]: [
          'Minor coverage enhancements recommended',
          'Some premium optimization opportunities',
          'Deductibles could be restructured'
        ],
        [DiligenceIssue.NONE]: []
      }
    }
    
    const options = descriptions[stream][severity]
    if (options.length === 0) return 'No significant issues identified'
    
    return options[Math.floor(this.prng.next() * options.length)]
  }

  private calculateValuationImpact(severity: DiligenceIssue): number {
    switch (severity) {
      case DiligenceIssue.CRITICAL:
        return this.prng.range(15, 30)
      case DiligenceIssue.MAJOR:
        return this.prng.range(5, 15)
      case DiligenceIssue.MINOR:
        return this.prng.range(1, 5)
      default:
        return 0
    }
  }

  private calculateWalkAwayRisk(severity: DiligenceIssue): number {
    switch (severity) {
      case DiligenceIssue.CRITICAL:
        return this.prng.range(0.3, 0.7)
      case DiligenceIssue.MAJOR:
        return this.prng.range(0.1, 0.3)
      case DiligenceIssue.MINOR:
        return this.prng.range(0, 0.1)
      default:
        return 0
    }
  }

  private calculateNegotiationLeverage(severity: DiligenceIssue): number {
    switch (severity) {
      case DiligenceIssue.CRITICAL:
        return 70 + this.prng.range(0, 30)
      case DiligenceIssue.MAJOR:
        return 40 + this.prng.range(0, 30)
      case DiligenceIssue.MINOR:
        return 10 + this.prng.range(0, 20)
      default:
        return 0
    }
  }

  private conductQofE(deal: Deal): QualityOfEarnings {
    const reportedEBITDA = deal.metrics.ebitda
    const adjustments = this.generateEBITDAAdjustments(reportedEBITDA)
    
    const totalAdjustments = adjustments.reduce(
      (sum, adj) => sum + (adj.accepted ? adj.amount : 0), 0
    )
    
    const normalizedEBITDA = reportedEBITDA + totalAdjustments
    const sustainableEBITDA = normalizedEBITDA * this.prng.range(0.85, 1.0)
    
    return {
      reportedEBITDA,
      normalizedEBITDA,
      adjustments,
      sustainableEBITDA,
      marginTrend: this.determineMarginTrend(deal),
      revenueQuality: this.assessRevenueQuality(deal),
      customerConcentration: this.prng.range(20, 60)
    }
  }

  private generateEBITDAAdjustments(ebitda: number): EBITDAAdjustment[] {
    const adjustments: EBITDAAdjustment[] = []
    
    // Add-backs (positive adjustments)
    if (this.prng.next() > 0.3) {
      adjustments.push({
        category: 'One-time professional fees',
        amount: ebitda * this.prng.range(0.01, 0.03),
        recurring: false,
        accepted: true,
        description: 'Transaction-related advisory fees'
      })
    }
    
    if (this.prng.next() > 0.5) {
      adjustments.push({
        category: 'Owner compensation normalization',
        amount: this.prng.range(200000, 1000000),
        recurring: true,
        accepted: true,
        description: 'Excess owner compensation above market'
      })
    }
    
    // Deductions (negative adjustments)
    if (this.prng.next() > 0.6) {
      adjustments.push({
        category: 'Deferred maintenance',
        amount: -ebitda * this.prng.range(0.02, 0.05),
        recurring: false,
        accepted: true,
        description: 'Catch-up capex requirements'
      })
    }
    
    if (this.prng.next() > 0.7) {
      adjustments.push({
        category: 'Customer loss provision',
        amount: -ebitda * this.prng.range(0.03, 0.08),
        recurring: false,
        accepted: this.prng.next() > 0.3,
        description: 'At-risk customer revenue'
      })
    }
    
    return adjustments
  }

  private determineMarginTrend(deal: Deal): 'improving' | 'stable' | 'declining' {
    const momentum = deal.meters.momentum
    if (momentum > 60) return 'improving'
    if (momentum < 40) return 'declining'
    return 'stable'
  }

  private assessRevenueQuality(deal: Deal): 'recurring' | 'repeat' | 'transactional' {
    const sector = deal.sector.toLowerCase()
    if (sector.includes('software') || sector.includes('saas')) {
      return 'recurring'
    } else if (sector.includes('consumer') || sector.includes('industrial')) {
      return 'repeat'
    } else {
      return 'transactional'
    }
  }

  private analyzeWorkingCapital(deal: Deal): WorkingCapitalAnalysis {
    const revenue = deal.metrics.revenue
    const targetNWC = revenue * this.prng.range(0.08, 0.15)
    const actualNWC = targetNWC * this.prng.range(0.8, 1.2)
    
    return {
      targetNWC,
      actualNWC,
      adjustment: targetNWC - actualNWC,
      seasonality: this.prng.next() > 0.6,
      cashConversionCycle: this.prng.range(30, 90),
      dsoTrend: this.prng.pick(['improving', 'stable', 'deteriorating']),
      dpoTrend: this.prng.pick(['extending', 'stable', 'shortening'])
    }
  }

  private assessManagement(deal: Deal, firm: Firm): ManagementAssessment {
    const baseScore = 50 + (deal.meters.execution - 50) * 0.5
    
    return {
      ceoScore: Math.min(100, Math.max(0, baseScore + this.prng.range(-20, 20))),
      cfoScore: Math.min(100, Math.max(0, baseScore + this.prng.range(-15, 25))),
      teamDepth: Math.min(100, Math.max(0, baseScore + this.prng.range(-10, 15))),
      successionRisk: this.prng.next() > 0.7,
      retentionRequired: this.generateKeyPeople(),
      cultureFit: Math.min(100, Math.max(0, 
        50 + (firm.culture - 50) * 0.5 + this.prng.range(-15, 15)
      )),
      incentiveAlignment: Math.min(100, Math.max(0, 60 + this.prng.range(-20, 20)))
    }
  }

  private generateKeyPeople(): string[] {
    const people: string[] = []
    const roles = ['CEO', 'CFO', 'COO', 'CTO', 'VP Sales', 'VP Operations']
    
    const count = Math.floor(this.prng.range(2, 5))
    for (let i = 0; i < count && i < roles.length; i++) {
      people.push(roles[i])
    }
    
    return people
  }

  private identifyRedFlags(
    findings: DiligenceFinding[],
    qofE: QualityOfEarnings,
    management: ManagementAssessment
  ): string[] {
    const redFlags: string[] = []
    
    // Finding-based red flags
    const criticalFindings = findings.filter(f => f.severity === DiligenceIssue.CRITICAL)
    if (criticalFindings.length > 0) {
      redFlags.push(`${criticalFindings.length} critical diligence issues identified`)
    }
    
    // QofE red flags
    if (qofE.normalizedEBITDA < qofE.reportedEBITDA * 0.85) {
      redFlags.push('Significant EBITDA quality issues')
    }
    
    if (qofE.customerConcentration > 50) {
      redFlags.push('High customer concentration risk')
    }
    
    // Management red flags
    if (management.ceoScore < 40) {
      redFlags.push('Weak CEO capability')
    }
    
    if (management.successionRisk) {
      redFlags.push('Key person dependency risk')
    }
    
    return redFlags
  }

  private identifyDealBreakers(
    findings: DiligenceFinding[],
    redFlags: string[]
  ): string[] {
    const dealBreakers: string[] = []
    
    const criticalCount = findings.filter(
      f => f.severity === DiligenceIssue.CRITICAL
    ).length
    
    if (criticalCount >= 3) {
      dealBreakers.push('Too many critical issues to remediate')
    }
    
    const totalValuationImpact = findings.reduce(
      (sum, f) => sum + f.impactOnValuation, 0
    )
    
    if (totalValuationImpact > 40) {
      dealBreakers.push('Cumulative valuation impact exceeds 40%')
    }
    
    if (redFlags.length > 5) {
      dealBreakers.push('Too many red flags for comfort')
    }
    
    return dealBreakers
  }

  private identifyValueCreation(
    deal: Deal,
    findings: DiligenceFinding[]
  ): string[] {
    const opportunities: string[] = []
    
    // Operational opportunities
    if (deal.meters.execution < 50) {
      opportunities.push('Operational improvement potential: 20% EBITDA uplift')
    }
    
    // Digital opportunities
    const itFinding = findings.find(f => f.stream === DiligenceStream.IT)
    if (!itFinding || itFinding.severity === DiligenceIssue.MINOR) {
      opportunities.push('Digital transformation opportunity')
    }
    
    // Pricing opportunities
    if (deal.sector.toLowerCase().includes('software')) {
      opportunities.push('Pricing optimization: 10-15% revenue uplift')
    }
    
    // M&A opportunities
    if (deal.metrics.revenue > 50000000) {
      opportunities.push('Platform for bolt-on acquisitions')
    }
    
    return opportunities
  }

  private calculateSynergyPotential(deal: Deal, firm: Firm): number {
    // Higher for existing portfolio companies in same sector
    const baseSynergy = deal.metrics.ebitda * this.prng.range(0.05, 0.15)
    
    // Culture fit increases synergy potential
    const cultureFactor = firm.culture / 100
    
    return baseSynergy * (1 + cultureFactor * 0.5)
  }

  private assessIntegrationComplexity(
    deal: Deal,
    findings: DiligenceFinding[]
  ): 'low' | 'medium' | 'high' {
    const majorIssues = findings.filter(
      f => f.severity === DiligenceIssue.MAJOR || 
           f.severity === DiligenceIssue.CRITICAL
    ).length
    
    if (majorIssues > 3) return 'high'
    if (majorIssues > 1) return 'medium'
    return 'low'
  }

  private calculateRecommendedPrice(
    deal: Deal,
    qofE: QualityOfEarnings,
    workingCapital: WorkingCapitalAnalysis,
    findings: DiligenceFinding[]
  ): number {
    const basePrice = qofE.sustainableEBITDA * deal.entryMultiple
    
    // Adjust for working capital
    let adjustedPrice = basePrice - workingCapital.adjustment
    
    // Adjust for diligence findings
    const totalImpact = findings.reduce(
      (sum, f) => sum + f.impactOnValuation, 0
    )
    adjustedPrice *= (1 - totalImpact / 100)
    
    // Add some negotiation buffer
    adjustedPrice *= this.prng.range(0.92, 0.98)
    
    return Math.max(0, adjustedPrice)
  }

  private recommendStructure(
    findings: DiligenceFinding[],
    management: ManagementAssessment
  ): string {
    const hasSignificantRisk = findings.some(
      f => f.severity === DiligenceIssue.CRITICAL
    )
    
    if (hasSignificantRisk) {
      return 'Earnout structure with 30% deferred based on performance'
    } else if (management.ceoScore > 70 && management.cultureFit > 60) {
      return 'Management rollover of 20% with aligned incentives'
    } else {
      return 'Standard structure with 10% escrow for 18 months'
    }
  }

  private calculateOverallScore(
    findings: DiligenceFinding[],
    qofE: QualityOfEarnings,
    workingCapital: WorkingCapitalAnalysis,
    management: ManagementAssessment
  ): number {
    let score = 70 // Base score
    
    // Deduct for findings
    findings.forEach(f => {
      if (f.severity === DiligenceIssue.CRITICAL) score -= 15
      else if (f.severity === DiligenceIssue.MAJOR) score -= 7
      else if (f.severity === DiligenceIssue.MINOR) score -= 2
    })
    
    // Adjust for QofE
    const ebitdaQuality = qofE.normalizedEBITDA / qofE.reportedEBITDA
    score += (ebitdaQuality - 1) * 50
    
    // Adjust for management
    score += (management.ceoScore - 50) * 0.2
    score += (management.teamDepth - 50) * 0.1
    
    return Math.min(100, Math.max(0, score))
  }
}