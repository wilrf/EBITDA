import { PRNG } from './prng'
import type { Deal, Firm } from './types'

export interface PortfolioCompany extends Deal {
  ownershipPct: number
  boardSeats: number
  holdingPeriod: number // months
  valueCreationPlan: ValueCreationPlan
  performanceMetrics: CompanyPerformance
  managementTeam: ManagementTeam
  initiatives: OperationalInitiative[]
  monthlyBoard: BoardMeeting[]
}

export interface ValueCreationPlan {
  id: string
  horizonMonths: number
  revenueGrowthTarget: number // annual %
  marginImprovementTarget: number // bps
  multipleExpansionTarget: number // turns
  initiatives: string[]
  milestones: Milestone[]
  investmentRequired: number
  irrTarget: number
}

export interface Milestone {
  description: string
  targetMonth: number
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'failed'
  impact: number // EBITDA impact
  completionPct: number
}

export interface CompanyPerformance {
  currentRevenue: number
  currentEBITDA: number
  currentMultiple: number
  ltmRevenueGrowth: number
  ltmEBITDAGrowth: number
  budgetVariance: number // % vs budget
  cashFlow: number
  debtPaydown: number
  workingCapitalDays: number
}

export interface ManagementTeam {
  ceo: Executive
  cfo: Executive
  keyExecutives: Executive[]
  openPositions: string[]
  teamScore: number // 0-100
  turnover: number // annual %
}

export interface Executive {
  name: string
  role: string
  tenure: number // months
  performance: number // 0-100
  equity: number // %
  retained: boolean
  replacementRisk: number // 0-1
}

export interface OperationalInitiative {
  id: string
  name: string
  category: InitiativeCategory
  status: InitiativeStatus
  owner: string
  startMonth: number
  durationMonths: number
  investmentRequired: number
  expectedReturn: number // EBITDA impact
  actualReturn?: number
  risk: 'low' | 'medium' | 'high'
  dependencies: string[]
}

export enum InitiativeCategory {
  REVENUE_GROWTH = 'revenue_growth',
  COST_REDUCTION = 'cost_reduction',
  WORKING_CAPITAL = 'working_capital',
  DIGITAL_TRANSFORMATION = 'digital_transformation',
  M_AND_A = 'm_and_a',
  ORGANIZATIONAL = 'organizational',
  COMMERCIAL_EXCELLENCE = 'commercial_excellence',
  OPERATIONAL_EXCELLENCE = 'operational_excellence'
}

export enum InitiativeStatus {
  IDENTIFIED = 'identified',
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled'
}

export interface BoardMeeting {
  month: number
  agenda: string[]
  decisions: string[]
  actions: string[]
  concerns: string[]
  performanceRating: number // 0-100
}

export interface OperationalMetrics {
  revenue: {
    organic: number
    acquisition: number
    total: number
    growthRate: number
  }
  profitability: {
    grossMargin: number
    ebitdaMargin: number
    ebitda: number
    capex: number
    fcf: number
  }
  efficiency: {
    revenuePerEmployee: number
    sgaPercent: number
    dso: number
    dio: number
    dpo: number
    cashConversion: number
  }
  commercial: {
    customerCount: number
    churnRate: number
    nps: number
    marketShare: number
    pipelineValue: number
    winRate: number
  }
}

export class PortfolioOperationsEngine {
  private prng: PRNG

  constructor(prng: PRNG) {
    this.prng = prng
  }

  createPortfolioCompany(
    deal: Deal,
    ownershipPct: number,
    boardSeats: number
  ): PortfolioCompany {
    const valueCreationPlan = this.generateValueCreationPlan(deal)
    const managementTeam = this.assessManagementTeam(deal)
    const initiatives = this.identifyInitiatives(deal, valueCreationPlan)
    
    return {
      ...deal,
      ownershipPct,
      boardSeats,
      holdingPeriod: 0,
      valueCreationPlan,
      performanceMetrics: this.initializePerformance(deal),
      managementTeam,
      initiatives,
      monthlyBoard: []
    }
  }

  private generateValueCreationPlan(deal: Deal): ValueCreationPlan {
    const horizonMonths = 36 + Math.floor(this.prng.range(0, 24))
    
    // Base targets on deal quality
    const qualityFactor = (100 - deal.meters.fragility) / 100
    
    return {
      id: `VCP_${deal.id}`,
      horizonMonths,
      revenueGrowthTarget: 5 + this.prng.range(0, 15) * qualityFactor,
      marginImprovementTarget: 100 + this.prng.range(0, 400) * qualityFactor,
      multipleExpansionTarget: 0.5 + this.prng.range(0, 2) * qualityFactor,
      initiatives: this.generateInitiativeList(deal),
      milestones: this.generateMilestones(horizonMonths),
      investmentRequired: deal.metrics.ebitda * this.prng.range(0.5, 2),
      irrTarget: 20 + this.prng.range(0, 15)
    }
  }

  private generateInitiativeList(deal: Deal): string[] {
    const initiatives: string[] = []
    const sector = deal.sector.toLowerCase()
    
    // Universal initiatives
    initiatives.push('Implement KPI dashboards and reporting')
    initiatives.push('Optimize pricing strategy')
    initiatives.push('Enhance sales force effectiveness')
    
    // Sector-specific initiatives
    if (sector.includes('tech') || sector.includes('software')) {
      initiatives.push('Accelerate product development')
      initiatives.push('Expand into adjacent markets')
      initiatives.push('Improve customer retention and upsell')
    } else if (sector.includes('healthcare')) {
      initiatives.push('Expand service lines')
      initiatives.push('Improve reimbursement rates')
      initiatives.push('Enhance clinical outcomes')
    } else if (sector.includes('consumer')) {
      initiatives.push('Expand distribution channels')
      initiatives.push('Launch new product lines')
      initiatives.push('Enhance brand positioning')
    } else if (sector.includes('industrial')) {
      initiatives.push('Implement lean manufacturing')
      initiatives.push('Optimize supply chain')
      initiatives.push('Expand aftermarket services')
    }
    
    // Conditional initiatives based on metrics
    if (deal.meters.execution < 50) {
      initiatives.push('Upgrade management team')
      initiatives.push('Implement operational excellence program')
    }
    
    if (deal.meters.fragility > 60) {
      initiatives.push('Strengthen balance sheet')
      initiatives.push('Diversify customer base')
    }
    
    return initiatives
  }

  private generateMilestones(horizonMonths: number): Milestone[] {
    const milestones: Milestone[] = []
    
    // 100-day plan milestones
    milestones.push({
      description: 'Complete 100-day plan',
      targetMonth: 3,
      status: 'pending',
      impact: 0,
      completionPct: 0
    })
    
    milestones.push({
      description: 'Install KPI reporting',
      targetMonth: 2,
      status: 'pending',
      impact: 0,
      completionPct: 0
    })
    
    // Year 1 milestones
    milestones.push({
      description: 'Achieve first wave cost savings',
      targetMonth: 6,
      status: 'pending',
      impact: this.prng.range(500000, 2000000),
      completionPct: 0
    })
    
    milestones.push({
      description: 'Complete pricing optimization',
      targetMonth: 9,
      status: 'pending',
      impact: this.prng.range(1000000, 3000000),
      completionPct: 0
    })
    
    // Year 2+ milestones
    if (horizonMonths >= 24) {
      milestones.push({
        description: 'Complete first bolt-on acquisition',
        targetMonth: 18,
        status: 'pending',
        impact: this.prng.range(2000000, 5000000),
        completionPct: 0
      })
      
      milestones.push({
        description: 'Launch new product/market',
        targetMonth: 24,
        status: 'pending',
        impact: this.prng.range(1500000, 4000000),
        completionPct: 0
      })
    }
    
    return milestones
  }

  private initializePerformance(deal: Deal): CompanyPerformance {
    return {
      currentRevenue: deal.metrics.revenue,
      currentEBITDA: deal.metrics.ebitda,
      currentMultiple: deal.entryMultiple,
      ltmRevenueGrowth: this.prng.range(3, 15),
      ltmEBITDAGrowth: this.prng.range(0, 20),
      budgetVariance: this.prng.range(-5, 5),
      cashFlow: deal.metrics.ebitda * this.prng.range(0.5, 0.8),
      debtPaydown: 0,
      workingCapitalDays: this.prng.range(30, 90)
    }
  }

  private assessManagementTeam(deal: Deal): ManagementTeam {
    const ceo = this.generateExecutive('CEO', deal)
    const cfo = this.generateExecutive('CFO', deal)
    
    const keyRoles = ['COO', 'CTO', 'VP Sales', 'VP Marketing', 'VP Operations']
    const keyExecutives = keyRoles.slice(0, 3 + Math.floor(this.prng.range(0, 3)))
      .map(role => this.generateExecutive(role, deal))
    
    const teamScore = (ceo.performance + cfo.performance + 
      keyExecutives.reduce((sum, exec) => sum + exec.performance, 0)) / 
      (2 + keyExecutives.length)
    
    return {
      ceo,
      cfo,
      keyExecutives,
      openPositions: this.prng.next() > 0.7 ? ['VP Strategy'] : [],
      teamScore,
      turnover: this.prng.range(5, 25)
    }
  }

  private generateExecutive(role: string, deal: Deal): Executive {
    const performance = 30 + deal.meters.execution * 0.7 + this.prng.range(0, 20)
    
    return {
      name: `${role} Name`,
      role,
      tenure: Math.floor(this.prng.range(6, 60)),
      performance: Math.min(100, Math.max(0, performance)),
      equity: role === 'CEO' ? this.prng.range(3, 8) : this.prng.range(0.5, 3),
      retained: this.prng.next() > 0.2,
      replacementRisk: this.prng.range(0.1, 0.4)
    }
  }

  private identifyInitiatives(
    deal: Deal,
    plan: ValueCreationPlan
  ): OperationalInitiative[] {
    const initiatives: OperationalInitiative[] = []
    
    // Revenue growth initiatives
    initiatives.push({
      id: 'INIT_001',
      name: 'Sales force expansion',
      category: InitiativeCategory.REVENUE_GROWTH,
      status: InitiativeStatus.IDENTIFIED,
      owner: 'VP Sales',
      startMonth: 3,
      durationMonths: 12,
      investmentRequired: this.prng.range(500000, 2000000),
      expectedReturn: deal.metrics.ebitda * this.prng.range(0.05, 0.15),
      risk: 'medium',
      dependencies: []
    })
    
    initiatives.push({
      id: 'INIT_002',
      name: 'Pricing optimization',
      category: InitiativeCategory.COMMERCIAL_EXCELLENCE,
      status: InitiativeStatus.IDENTIFIED,
      owner: 'CFO',
      startMonth: 2,
      durationMonths: 6,
      investmentRequired: this.prng.range(100000, 500000),
      expectedReturn: deal.metrics.ebitda * this.prng.range(0.03, 0.10),
      risk: 'low',
      dependencies: []
    })
    
    // Cost reduction initiatives
    initiatives.push({
      id: 'INIT_003',
      name: 'Procurement optimization',
      category: InitiativeCategory.COST_REDUCTION,
      status: InitiativeStatus.IDENTIFIED,
      owner: 'COO',
      startMonth: 1,
      durationMonths: 9,
      investmentRequired: this.prng.range(200000, 800000),
      expectedReturn: deal.metrics.ebitda * this.prng.range(0.02, 0.08),
      risk: 'low',
      dependencies: []
    })
    
    // Digital transformation
    if (deal.meters.execution < 60) {
      initiatives.push({
        id: 'INIT_004',
        name: 'ERP implementation',
        category: InitiativeCategory.DIGITAL_TRANSFORMATION,
        status: InitiativeStatus.IDENTIFIED,
        owner: 'CTO',
        startMonth: 6,
        durationMonths: 18,
        investmentRequired: this.prng.range(2000000, 5000000),
        expectedReturn: deal.metrics.ebitda * this.prng.range(0.05, 0.12),
        risk: 'high',
        dependencies: []
      })
    }
    
    // M&A initiatives
    if (deal.metrics.revenue > 50000000) {
      initiatives.push({
        id: 'INIT_005',
        name: 'Bolt-on acquisition program',
        category: InitiativeCategory.M_AND_A,
        status: InitiativeStatus.IDENTIFIED,
        owner: 'CEO',
        startMonth: 12,
        durationMonths: 24,
        investmentRequired: this.prng.range(10000000, 50000000),
        expectedReturn: deal.metrics.ebitda * this.prng.range(0.20, 0.50),
        risk: 'high',
        dependencies: ['INIT_004']
      })
    }
    
    return initiatives
  }

  updatePortfolioPerformance(
    company: PortfolioCompany,
    month: number,
    marketConditions: { M: number; R: number }
  ): PortfolioCompany {
    // Update holding period
    company.holdingPeriod = month
    
    // Update performance metrics
    company.performanceMetrics = this.calculateNewPerformance(
      company,
      marketConditions
    )
    
    // Update initiatives
    company.initiatives = this.progressInitiatives(company.initiatives, month)
    
    // Update milestones
    company.valueCreationPlan.milestones = this.updateMilestones(
      company.valueCreationPlan.milestones,
      month
    )
    
    // Generate board meeting if quarterly
    if (month % 3 === 0) {
      company.monthlyBoard.push(this.generateBoardMeeting(company, month))
    }
    
    // Update management team
    company.managementTeam = this.updateManagementTeam(
      company.managementTeam,
      company.performanceMetrics
    )
    
    return company
  }

  private calculateNewPerformance(
    company: PortfolioCompany,
    market: { M: number; R: number }
  ): CompanyPerformance {
    const current = company.performanceMetrics
    
    // Base growth affected by market conditions and execution
    const marketEffect = 1 + market.M * 0.02 - market.R * 0.01
    const executionEffect = company.meters.execution / 100
    
    // Calculate initiative impact
    const initiativeImpact = company.initiatives
      .filter(i => i.status === InitiativeStatus.COMPLETED)
      .reduce((sum, i) => sum + (i.actualReturn || 0), 0)
    
    // Update metrics
    const revenueGrowth = (0.05 + this.prng.range(-0.02, 0.08)) * 
      marketEffect * executionEffect
    const ebitdaGrowth = revenueGrowth + 
      (initiativeImpact / current.currentEBITDA)
    
    return {
      currentRevenue: current.currentRevenue * (1 + revenueGrowth / 12),
      currentEBITDA: current.currentEBITDA * (1 + ebitdaGrowth / 12),
      currentMultiple: this.calculateCurrentMultiple(
        company.entryMultiple,
        market,
        company.holdingPeriod
      ),
      ltmRevenueGrowth: revenueGrowth,
      ltmEBITDAGrowth: ebitdaGrowth,
      budgetVariance: this.prng.range(-10, 10) * (2 - executionEffect),
      cashFlow: current.currentEBITDA * 0.7 * (1 + ebitdaGrowth / 12),
      debtPaydown: current.cashFlow * 0.5,
      workingCapitalDays: current.workingCapitalDays + this.prng.range(-2, 2)
    }
  }

  private calculateCurrentMultiple(
    entryMultiple: number,
    market: { M: number; R: number },
    holdingPeriod: number
  ): number {
    // Market impact on multiples
    const marketImpact = market.M * 0.3 - market.R * 0.2
    
    // Time impact (multiples tend to increase with operational improvements)
    const timeImpact = Math.min(holdingPeriod / 60, 1) * 0.5
    
    return entryMultiple * (1 + marketImpact + timeImpact + 
      this.prng.range(-0.1, 0.1))
  }

  private progressInitiatives(
    initiatives: OperationalInitiative[],
    currentMonth: number
  ): OperationalInitiative[] {
    return initiatives.map(initiative => {
      // Check if should start
      if (initiative.status === InitiativeStatus.IDENTIFIED && 
          currentMonth >= initiative.startMonth) {
        initiative.status = InitiativeStatus.IN_PROGRESS
      }
      
      // Check if should complete
      if (initiative.status === InitiativeStatus.IN_PROGRESS && 
          currentMonth >= initiative.startMonth + initiative.durationMonths) {
        initiative.status = InitiativeStatus.COMPLETED
        initiative.actualReturn = initiative.expectedReturn * 
          this.prng.range(0.7, 1.3)
      }
      
      // Random delays/issues
      if (initiative.status === InitiativeStatus.IN_PROGRESS && 
          initiative.risk === 'high' && this.prng.next() < 0.05) {
        initiative.status = InitiativeStatus.ON_HOLD
        initiative.durationMonths += 6
      }
      
      return initiative
    })
  }

  private updateMilestones(
    milestones: Milestone[],
    currentMonth: number
  ): Milestone[] {
    return milestones.map(milestone => {
      if (currentMonth >= milestone.targetMonth) {
        if (milestone.status === 'pending') {
          milestone.status = 'completed'
          milestone.completionPct = 100
        }
      } else if (currentMonth >= milestone.targetMonth - 3) {
        milestone.status = 'in_progress'
        milestone.completionPct = ((currentMonth - (milestone.targetMonth - 3)) / 3) * 100
      }
      
      return milestone
    })
  }

  private generateBoardMeeting(
    company: PortfolioCompany,
    month: number
  ): BoardMeeting {
    const performance = company.performanceMetrics
    const budgetVariance = performance.budgetVariance
    
    const agenda: string[] = [
      'Financial performance review',
      'Initiative progress update',
      'Market conditions discussion',
      'Risk assessment'
    ]
    
    const decisions: string[] = []
    const actions: string[] = []
    const concerns: string[] = []
    
    // Performance-based items
    if (budgetVariance < -5) {
      concerns.push('Underperformance vs budget')
      actions.push('Develop recovery plan')
    }
    
    if (performance.ltmEBITDAGrowth < 5) {
      concerns.push('Slow EBITDA growth')
      actions.push('Accelerate cost initiatives')
    }
    
    // Initiative-based items
    const delayedInitiatives = company.initiatives.filter(
      i => i.status === InitiativeStatus.ON_HOLD
    )
    if (delayedInitiatives.length > 0) {
      concerns.push(`${delayedInitiatives.length} initiatives delayed`)
      actions.push('Review initiative roadmap')
    }
    
    // Positive items
    if (performance.ltmRevenueGrowth > 10) {
      decisions.push('Approve growth investments')
    }
    
    const performanceRating = 50 + 
      Math.min(20, performance.ltmEBITDAGrowth) +
      Math.min(10, performance.ltmRevenueGrowth) +
      Math.max(-20, Math.min(0, budgetVariance))
    
    return {
      month,
      agenda,
      decisions,
      actions,
      concerns,
      performanceRating: Math.min(100, Math.max(0, performanceRating))
    }
  }

  private updateManagementTeam(
    team: ManagementTeam,
    performance: CompanyPerformance
  ): ManagementTeam {
    // Update executive performance based on company performance
    const performanceAdjustment = performance.budgetVariance > 0 ? 2 : -2
    
    team.ceo.performance = Math.min(100, Math.max(0, 
      team.ceo.performance + performanceAdjustment + this.prng.range(-5, 5)
    ))
    
    team.cfo.performance = Math.min(100, Math.max(0,
      team.cfo.performance + performanceAdjustment + this.prng.range(-5, 5)
    ))
    
    // Check for turnover
    if (this.prng.next() < 0.02) {
      // Random executive departure
      const index = Math.floor(this.prng.next() * team.keyExecutives.length)
      if (index < team.keyExecutives.length) {
        team.openPositions.push(team.keyExecutives[index].role)
        team.keyExecutives.splice(index, 1)
      }
    }
    
    // Update team score
    team.teamScore = (team.ceo.performance + team.cfo.performance + 
      team.keyExecutives.reduce((sum, exec) => sum + exec.performance, 0)) / 
      (2 + team.keyExecutives.length)
    
    return team
  }

  calculateOperationalMetrics(company: PortfolioCompany): OperationalMetrics {
    const perf = company.performanceMetrics
    const revenue = perf.currentRevenue
    const ebitda = perf.currentEBITDA
    
    return {
      revenue: {
        organic: revenue * 0.9,
        acquisition: revenue * 0.1,
        total: revenue,
        growthRate: perf.ltmRevenueGrowth
      },
      profitability: {
        grossMargin: 30 + this.prng.range(0, 30),
        ebitdaMargin: (ebitda / revenue) * 100,
        ebitda: ebitda,
        capex: ebitda * this.prng.range(0.1, 0.3),
        fcf: perf.cashFlow
      },
      efficiency: {
        revenuePerEmployee: this.prng.range(150000, 500000),
        sgaPercent: 15 + this.prng.range(0, 15),
        dso: 45 + this.prng.range(-15, 30),
        dio: 60 + this.prng.range(-20, 40),
        dpo: 45 + this.prng.range(-15, 30),
        cashConversion: 0.7 + this.prng.range(0, 0.3)
      },
      commercial: {
        customerCount: Math.floor(100 + this.prng.range(0, 1000)),
        churnRate: 5 + this.prng.range(0, 15),
        nps: 20 + this.prng.range(0, 60),
        marketShare: 5 + this.prng.range(0, 25),
        pipelineValue: revenue * this.prng.range(0.5, 2),
        winRate: 15 + this.prng.range(0, 35)
      }
    }
  }
}