import { PRNG } from './prng'
import type { Deal, Fund, Firm } from './types'

export interface LBOModel {
  dealId: string
  entryDate: Date
  entryValuation: number
  equityContribution: number
  debtFinancing: DebtStructure
  sourcesAndUses: SourcesAndUses
  projectedReturns: ReturnProjections
  sensitivityAnalysis: SensitivityAnalysis
  covenantStructure: CovenantPackage
}

export interface DebtStructure {
  totalDebt: number
  seniorDebt: {
    amount: number
    margin: number // over base rate
    term: number // years
    amortization: number // % per year
    covenants: string[]
  }
  mezzanineDebt?: {
    amount: number
    coupon: number // cash + PIK
    cashCoupon: number
    pikCoupon: number
    term: number
    covenants: string[]
  }
  secondLien?: {
    amount: number
    margin: number
    term: number
    covenants: string[]
  }
}

export interface SourcesAndUses {
  sources: {
    equity: number
    seniorDebt: number
    mezzanineDebt: number
    secondLien: number
    managementRollover: number
    total: number
  }
  uses: {
    purchasePrice: number
    refinancingDebt: number
    transactionFees: number
    financingFees: number
    workingCapitalAdjustment: number
    total: number
  }
}

export interface ReturnProjections {
  baseCase: ReturnScenario
  optimisticCase: ReturnScenario
  pessimisticCase: ReturnScenario
  stressCase: ReturnScenario
}

export interface ReturnScenario {
  scenarioName: string
  exitMultiple: number
  exitYear: number
  exitValue: number
  totalReturn: number
  grossIRR: number
  netIRR: number
  grossMoM: number
  netMoM: number
  cashflows: YearlyCashflow[]
}

export interface YearlyCashflow {
  year: number
  ebitda: number
  capex: number
  workingCapitalChange: number
  debtPaydown: number
  freeCashFlow: number
  distributions: number
}

export interface SensitivityAnalysis {
  ebitdaGrowthImpact: SensitivityTable
  exitMultipleImpact: SensitivityTable
  leverageImpact: SensitivityTable
  holdingPeriodImpact: SensitivityTable
}

export interface SensitivityTable {
  parameter: string
  scenarios: { value: number; irr: number; moM: number }[]
  baseCase: { value: number; irr: number; moM: number }
  tornadoChart: { downside: number; upside: number }
}

export interface CovenantPackage {
  maintenanceCovenants: MaintenanceCovenant[]
  incurrenceCovenants: IncurrenceCovenant[]
  reportingRequirements: string[]
  defaultRisk: number // probability
}

export interface MaintenanceCovenant {
  name: string
  type: 'leverage' | 'coverage' | 'capex' | 'liquidity'
  threshold: number
  currentValue: number
  headroom: number
  testingFrequency: 'quarterly' | 'monthly'
}

export interface IncurrenceCovenant {
  name: string
  description: string
  threshold: number
  triggered: boolean
}

export interface ReturnsWaterfall {
  fundId: string
  totalProceeds: number
  distribution: WaterfallDistribution[]
  lpDistribution: number
  gpDistribution: number
  carriedInterest: number
  managementFeeRecapture: number
}

export interface WaterfallDistribution {
  tier: number
  description: string
  threshold: number
  splitLP: number
  splitGP: number
  amount: number
  cumulative: number
}

export interface PortfolioConstruction {
  diversificationScore: number
  sectorAllocation: Map<string, number>
  vintageSpread: Map<number, number>
  checkSizeDistribution: Map<string, number> // small, medium, large
  geographicSpread: Map<string, number>
  riskProfile: RiskMetrics
  expectedReturns: PortfolioReturns
}

export interface RiskMetrics {
  portfolioVolatility: number
  correlationMatrix: Map<string, Map<string, number>>
  varAtRisk: number // Value at Risk
  expectedShortfall: number
  maximumDrawdown: number
  sharpeRatio: number
  downDeviationRisk: number
}

export interface PortfolioReturns {
  grossIRR: number
  netIRR: number
  dpi: number // Distributions to Paid-in capital
  rvpi: number // Residual Value to Paid-in capital
  tvpi: number // Total Value to Paid-in capital
  jCurve: JCurveAnalysis
}

export interface JCurveAnalysis {
  nadir: { year: number; value: number }
  breakeven: { year: number; value: number }
  maturity: { year: number; value: number }
  callSchedule: { year: number; percentage: number }[]
  distributionSchedule: { year: number; percentage: number }[]
}

export interface ScenarioPlanning {
  macroScenarios: MacroScenario[]
  stressTests: StressTest[]
  monteCarloSimulation: MonteCarloResults
}

export interface MacroScenario {
  name: string
  probability: number
  gdpGrowth: number
  interestRates: number
  creditSpreads: number
  equityMultiples: number
  impactOnPortfolio: number
}

export interface StressTest {
  name: string
  description: string
  severity: 'mild' | 'moderate' | 'severe'
  impactFactors: Map<string, number>
  portfolioImpact: {
    valuationHit: number
    defaultRate: number
    timeToRecovery: number
    irr: number
  }
}

export interface MonteCarloResults {
  iterations: number
  irrDistribution: {
    p10: number
    p25: number
    p50: number
    p75: number
    p90: number
    mean: number
    stdDev: number
  }
  probabilityOfLoss: number
  valueAtRisk: { _95: number; _99: number }
}

export class FinancialModelingEngine {
  private prng: PRNG
  private interestRateEnvironment: number
  private creditSpread: number

  constructor(prng: PRNG) {
    this.prng = prng
    this.interestRateEnvironment = 0.05 // base rate
    this.creditSpread = 0.04 // credit spread
  }

  buildLBOModel(
    deal: Deal,
    equityContribution: number,
    debtMultiple: number,
    holdingPeriod: number
  ): LBOModel {
    const entryValuation = deal.entryMultiple * deal.metrics.ebitda
    const totalDebt = Math.min(debtMultiple * deal.metrics.ebitda, entryValuation * 0.8)
    
    // Build debt structure
    const debtStructure = this.buildDebtStructure(totalDebt, deal.metrics.ebitda)
    
    // Sources and uses
    const sourcesAndUses = this.buildSourcesAndUses(
      entryValuation,
      equityContribution,
      debtStructure,
      deal.metrics.ebitda
    )

    // Project returns
    const projectedReturns = this.projectReturns(
      deal,
      equityContribution,
      totalDebt,
      holdingPeriod
    )

    // Sensitivity analysis
    const sensitivityAnalysis = this.performSensitivityAnalysis(
      deal,
      equityContribution,
      totalDebt,
      holdingPeriod
    )

    // Covenant structure
    const covenantStructure = this.buildCovenantStructure(deal, totalDebt)

    return {
      dealId: deal.id,
      entryDate: new Date(),
      entryValuation,
      equityContribution,
      debtFinancing: debtStructure,
      sourcesAndUses,
      projectedReturns,
      sensitivityAnalysis,
      covenantStructure
    }
  }

  private buildDebtStructure(totalDebt: number, ebitda: number): DebtStructure {
    const seniorDebtRatio = 0.7
    const mezzDebtRatio = 0.25
    const secondLienRatio = 0.05

    const seniorAmount = totalDebt * seniorDebtRatio
    const mezzAmount = totalDebt * mezzDebtRatio
    const secondLienAmount = totalDebt * secondLienRatio

    return {
      totalDebt,
      seniorDebt: {
        amount: seniorAmount,
        margin: this.creditSpread + 0.02,
        term: 7,
        amortization: 0.05,
        covenants: ['leverage_covenant', 'coverage_covenant', 'capex_covenant']
      },
      mezzanineDebt: mezzAmount > 0 ? {
        amount: mezzAmount,
        coupon: 0.12,
        cashCoupon: 0.08,
        pikCoupon: 0.04,
        term: 8,
        covenants: ['leverage_covenant']
      } : undefined,
      secondLien: secondLienAmount > 0 ? {
        amount: secondLienAmount,
        margin: this.creditSpread + 0.06,
        term: 8,
        covenants: ['leverage_covenant']
      } : undefined
    }
  }

  private buildSourcesAndUses(
    entryValuation: number,
    equityContribution: number,
    debtStructure: DebtStructure,
    ebitda: number
  ): SourcesAndUses {
    const managementRollover = entryValuation * 0.05
    const transactionFees = entryValuation * 0.015
    const financingFees = debtStructure.totalDebt * 0.02

    return {
      sources: {
        equity: equityContribution,
        seniorDebt: debtStructure.seniorDebt.amount,
        mezzanineDebt: debtStructure.mezzanineDebt?.amount || 0,
        secondLien: debtStructure.secondLien?.amount || 0,
        managementRollover,
        total: equityContribution + debtStructure.totalDebt + managementRollover
      },
      uses: {
        purchasePrice: entryValuation,
        refinancingDebt: ebitda * 2, // assume some existing debt
        transactionFees,
        financingFees,
        workingCapitalAdjustment: ebitda * 0.1,
        total: entryValuation + ebitda * 2 + transactionFees + financingFees + ebitda * 0.1
      }
    }
  }

  private projectReturns(
    deal: Deal,
    equityContribution: number,
    totalDebt: number,
    holdingPeriod: number
  ): ReturnProjections {
    const baseCase = this.calculateReturnScenario(
      deal,
      equityContribution,
      totalDebt,
      holdingPeriod,
      'Base Case',
      0.08, // EBITDA growth
      deal.baseMultiple * 1.1 // exit multiple expansion
    )

    const optimisticCase = this.calculateReturnScenario(
      deal,
      equityContribution,
      totalDebt,
      holdingPeriod,
      'Optimistic',
      0.15,
      deal.baseMultiple * 1.3
    )

    const pessimisticCase = this.calculateReturnScenario(
      deal,
      equityContribution,
      totalDebt,
      holdingPeriod,
      'Pessimistic',
      0.03,
      deal.baseMultiple * 0.9
    )

    const stressCase = this.calculateReturnScenario(
      deal,
      equityContribution,
      totalDebt,
      holdingPeriod,
      'Stress',
      -0.02,
      deal.baseMultiple * 0.7
    )

    return { baseCase, optimisticCase, pessimisticCase, stressCase }
  }

  private calculateReturnScenario(
    deal: Deal,
    equityContribution: number,
    totalDebt: number,
    holdingPeriod: number,
    scenarioName: string,
    ebitdaGrowth: number,
    exitMultiple: number
  ): ReturnScenario {
    const cashflows: YearlyCashflow[] = []
    let currentEbitda = deal.metrics.ebitda
    let remainingDebt = totalDebt

    // Project cashflows year by year
    for (let year = 1; year <= holdingPeriod; year++) {
      currentEbitda *= (1 + ebitdaGrowth)
      const capex = currentEbitda * 0.04 // 4% of EBITDA
      const workingCapitalChange = deal.metrics.revenue * 0.01 // 1% of revenue
      const debtPaydown = Math.min(remainingDebt * 0.1, currentEbitda * 0.2)
      const freeCashFlow = currentEbitda - capex - workingCapitalChange - debtPaydown * 1.05 // include interest
      
      remainingDebt -= debtPaydown
      
      cashflows.push({
        year,
        ebitda: currentEbitda,
        capex,
        workingCapitalChange,
        debtPaydown,
        freeCashFlow,
        distributions: year === holdingPeriod ? freeCashFlow : Math.max(0, freeCashFlow * 0.3)
      })
    }

    const finalEbitda = cashflows[cashflows.length - 1].ebitda
    const exitValue = finalEbitda * exitMultiple
    const netProceeds = exitValue - remainingDebt
    const totalReturn = netProceeds / equityContribution

    // Calculate IRR (simplified)
    const grossIRR = Math.pow(totalReturn, 1 / holdingPeriod) - 1
    const netIRR = grossIRR * 0.8 // assume 20% fees/carry impact

    return {
      scenarioName,
      exitMultiple,
      exitYear: holdingPeriod,
      exitValue,
      totalReturn,
      grossIRR,
      netIRR,
      grossMoM: totalReturn,
      netMoM: totalReturn * 0.8,
      cashflows
    }
  }

  private performSensitivityAnalysis(
    deal: Deal,
    equityContribution: number,
    totalDebt: number,
    holdingPeriod: number
  ): SensitivityAnalysis {
    // EBITDA Growth sensitivity
    const ebitdaScenarios = [-0.05, 0, 0.05, 0.1, 0.15, 0.2].map(growth => {
      const scenario = this.calculateReturnScenario(
        deal, equityContribution, totalDebt, holdingPeriod,
        `EBITDA ${growth * 100}%`, growth, deal.baseMultiple
      )
      return { value: growth, irr: scenario.grossIRR, moM: scenario.grossMoM }
    })

    // Exit multiple sensitivity
    const multipleScenarios = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2].map(multiplier => {
      const scenario = this.calculateReturnScenario(
        deal, equityContribution, totalDebt, holdingPeriod,
        `Multiple ${multiplier}x`, 0.08, deal.baseMultiple * multiplier
      )
      return { value: multiplier, irr: scenario.grossIRR, moM: scenario.grossMoM }
    })

    const baseEbitda = ebitdaScenarios.find(s => s.value === 0.08) || ebitdaScenarios[2]
    const baseMultiple = multipleScenarios.find(s => s.value === 1.0) || multipleScenarios[3]

    return {
      ebitdaGrowthImpact: {
        parameter: 'EBITDA Growth',
        scenarios: ebitdaScenarios,
        baseCase: baseEbitda,
        tornadoChart: {
          downside: ebitdaScenarios[0].irr - baseEbitda.irr,
          upside: ebitdaScenarios[ebitdaScenarios.length - 1].irr - baseEbitda.irr
        }
      },
      exitMultipleImpact: {
        parameter: 'Exit Multiple',
        scenarios: multipleScenarios,
        baseCase: baseMultiple,
        tornadoChart: {
          downside: multipleScenarios[0].irr - baseMultiple.irr,
          upside: multipleScenarios[multipleScenarios.length - 1].irr - baseMultiple.irr
        }
      },
      leverageImpact: this.analyzeLeverageImpact(deal, equityContribution, holdingPeriod),
      holdingPeriodImpact: this.analyzeHoldingPeriodImpact(deal, equityContribution, totalDebt)
    }
  }

  private analyzeLeverageImpact(
    deal: Deal,
    equityContribution: number,
    holdingPeriod: number
  ): SensitivityTable {
    const leverageScenarios = [3, 4, 5, 6, 7, 8].map(leverage => {
      const totalDebt = leverage * deal.metrics.ebitda
      const scenario = this.calculateReturnScenario(
        deal, equityContribution, totalDebt, holdingPeriod,
        `${leverage}x Leverage`, 0.08, deal.baseMultiple
      )
      return { value: leverage, irr: scenario.grossIRR, moM: scenario.grossMoM }
    })

    const baseCase = leverageScenarios.find(s => s.value === 5) || leverageScenarios[2]

    return {
      parameter: 'Leverage',
      scenarios: leverageScenarios,
      baseCase,
      tornadoChart: {
        downside: leverageScenarios[0].irr - baseCase.irr,
        upside: leverageScenarios[leverageScenarios.length - 1].irr - baseCase.irr
      }
    }
  }

  private analyzeHoldingPeriodImpact(
    deal: Deal,
    equityContribution: number,
    totalDebt: number
  ): SensitivityTable {
    const holdingPeriods = [3, 4, 5, 6, 7, 8].map(years => {
      const scenario = this.calculateReturnScenario(
        deal, equityContribution, totalDebt, years,
        `${years} Year Hold`, 0.08, deal.baseMultiple
      )
      return { value: years, irr: scenario.grossIRR, moM: scenario.grossMoM }
    })

    const baseCase = holdingPeriods.find(s => s.value === 5) || holdingPeriods[2]

    return {
      parameter: 'Holding Period',
      scenarios: holdingPeriods,
      baseCase,
      tornadoChart: {
        downside: holdingPeriods[0].irr - baseCase.irr,
        upside: holdingPeriods[holdingPeriods.length - 1].irr - baseCase.irr
      }
    }
  }

  private buildCovenantStructure(deal: Deal, totalDebt: number): CovenantPackage {
    const leverageRatio = totalDebt / deal.metrics.ebitda
    const coverageRatio = deal.metrics.ebitda / (totalDebt * 0.06) // interest coverage

    return {
      maintenanceCovenants: [
        {
          name: 'Total Leverage',
          type: 'leverage',
          threshold: 6.5,
          currentValue: leverageRatio,
          headroom: (6.5 - leverageRatio) / 6.5,
          testingFrequency: 'quarterly'
        },
        {
          name: 'Interest Coverage',
          type: 'coverage',
          threshold: 3.0,
          currentValue: coverageRatio,
          headroom: (coverageRatio - 3.0) / 3.0,
          testingFrequency: 'quarterly'
        },
        {
          name: 'CapEx Limit',
          type: 'capex',
          threshold: deal.metrics.ebitda * 0.05,
          currentValue: deal.metrics.ebitda * 0.04,
          headroom: 0.2,
          testingFrequency: 'quarterly'
        }
      ],
      incurrenceCovenants: [
        {
          name: 'Additional Debt',
          description: 'Pro forma leverage must be < 7.0x',
          threshold: 7.0,
          triggered: false
        },
        {
          name: 'Restricted Payments',
          description: 'Leverage must be < 5.5x',
          threshold: 5.5,
          triggered: leverageRatio > 5.5
        }
      ],
      reportingRequirements: [
        'Monthly financial statements',
        'Quarterly compliance certificate',
        'Annual audited financials',
        'Weekly cash reports'
      ],
      defaultRisk: this.calculateDefaultRisk(leverageRatio, coverageRatio, deal.meters.fragility)
    }
  }

  private calculateDefaultRisk(leverage: number, coverage: number, fragility: number): number {
    // Base probability increases with leverage and fragility, decreases with coverage
    let baseProbability = 0.02
    baseProbability *= Math.pow(leverage / 5, 2) // leverage effect
    baseProbability *= Math.pow(3 / coverage, 1.5) // coverage effect
    baseProbability *= (1 + fragility) // fragility effect

    return Math.min(0.5, Math.max(0.001, baseProbability))
  }

  calculateReturnsWaterfall(
    fund: Fund,
    totalProceeds: number,
    managementFees: number,
    hurdleRate: number = 0.08
  ): ReturnsWaterfall {
    const distribution: WaterfallDistribution[] = []
    let remaining = totalProceeds
    let cumulative = 0

    // Tier 1: Return of capital to LPs
    const returnOfCapital = Math.min(remaining, fund.size)
    distribution.push({
      tier: 1,
      description: 'Return of Capital',
      threshold: fund.size,
      splitLP: 1.0,
      splitGP: 0.0,
      amount: returnOfCapital,
      cumulative: returnOfCapital
    })
    remaining -= returnOfCapital
    cumulative += returnOfCapital

    // Tier 2: Preferred return to LPs
    if (remaining > 0) {
      const preferredReturn = Math.min(remaining, fund.size * hurdleRate * (fund.vintage / 4))
      distribution.push({
        tier: 2,
        description: `Preferred Return (${hurdleRate * 100}%)`,
        threshold: fund.size * (1 + hurdleRate),
        splitLP: 1.0,
        splitGP: 0.0,
        amount: preferredReturn,
        cumulative: cumulative + preferredReturn
      })
      remaining -= preferredReturn
      cumulative += preferredReturn
    }

    // Tier 3: Management fee catch-up
    if (remaining > 0) {
      const managementFeeCatchup = Math.min(remaining, managementFees)
      distribution.push({
        tier: 3,
        description: 'Management Fee Catch-up',
        threshold: 0,
        splitLP: 0.0,
        splitGP: 1.0,
        amount: managementFeeCatchup,
        cumulative: cumulative + managementFeeCatchup
      })
      remaining -= managementFeeCatchup
      cumulative += managementFeeCatchup
    }

    // Tier 4: 20% carried interest split
    if (remaining > 0) {
      distribution.push({
        tier: 4,
        description: 'Carried Interest (20%)',
        threshold: 0,
        splitLP: 0.8,
        splitGP: 0.2,
        amount: remaining,
        cumulative: cumulative + remaining
      })
    }

    const lpDistribution = distribution.reduce((sum, tier) => sum + tier.amount * tier.splitLP, 0)
    const gpDistribution = distribution.reduce((sum, tier) => sum + tier.amount * tier.splitGP, 0)

    return {
      fundId: fund.id,
      totalProceeds,
      distribution,
      lpDistribution,
      gpDistribution,
      carriedInterest: gpDistribution - managementFees,
      managementFeeRecapture: Math.min(gpDistribution, managementFees)
    }
  }

  buildPortfolioConstruction(deals: Deal[], fund: Fund): PortfolioConstruction {
    const sectorAllocation = new Map<string, number>()
    const vintageSpread = new Map<number, number>()
    const checkSizeDistribution = new Map<string, number>()
    const geographicSpread = new Map<string, number>()

    // Calculate allocations
    let totalInvested = 0
    deals.forEach(deal => {
      const investment = deal.entryMultiple * deal.metrics.ebitda * 0.3 // assume 30% equity
      totalInvested += investment

      // Sector allocation
      const sectorCurrent = sectorAllocation.get(deal.sector) || 0
      sectorAllocation.set(deal.sector, sectorCurrent + investment)

      // Check size
      let sizeCategory = 'small'
      if (investment > fund.size * 0.1) sizeCategory = 'large'
      else if (investment > fund.size * 0.05) sizeCategory = 'medium'
      
      const sizeCurrent = checkSizeDistribution.get(sizeCategory) || 0
      checkSizeDistribution.set(sizeCategory, sizeCurrent + investment)
    })

    // Convert to percentages
    sectorAllocation.forEach((value, key) => {
      sectorAllocation.set(key, value / totalInvested)
    })
    checkSizeDistribution.forEach((value, key) => {
      checkSizeDistribution.set(key, value / totalInvested)
    })

    const diversificationScore = this.calculateDiversificationScore(sectorAllocation, checkSizeDistribution)
    const riskProfile = this.calculatePortfolioRisk(deals)
    const expectedReturns = this.calculatePortfolioReturns(deals, fund)

    return {
      diversificationScore,
      sectorAllocation,
      vintageSpread,
      checkSizeDistribution,
      geographicSpread,
      riskProfile,
      expectedReturns
    }
  }

  private calculateDiversificationScore(
    sectorAllocation: Map<string, number>,
    checkSizeDistribution: Map<string, number>
  ): number {
    // Herfindahl index for concentration (lower is more diversified)
    let sectorHHI = 0
    sectorAllocation.forEach(percentage => {
      sectorHHI += percentage * percentage
    })

    let sizeHHI = 0
    checkSizeDistribution.forEach(percentage => {
      sizeHHI += percentage * percentage
    })

    // Convert to diversification score (0-100, higher is better)
    const sectorDiversification = (1 - sectorHHI) * 100
    const sizeDiversification = (1 - sizeHHI) * 100

    return (sectorDiversification + sizeDiversification) / 2
  }

  private calculatePortfolioRisk(deals: Deal[]): RiskMetrics {
    // Simplified risk calculations
    const volatilities = deals.map(deal => 0.3 + deal.meters.fragility * 0.2)
    const portfolioVolatility = Math.sqrt(
      volatilities.reduce((sum, vol) => sum + vol * vol, 0) / deals.length
    )

    // Correlation matrix (simplified)
    const correlationMatrix = new Map<string, Map<string, number>>()
    deals.forEach((deal1, i) => {
      const inner = new Map<string, number>()
      deals.forEach((deal2, j) => {
        const correlation = i === j ? 1.0 : 
          deal1.sector === deal2.sector ? 0.6 + this.prng.next() * 0.2 :
          0.2 + this.prng.next() * 0.3
        inner.set(deal2.id, correlation)
      })
      correlationMatrix.set(deal1.id, inner)
    })

    return {
      portfolioVolatility,
      correlationMatrix,
      varAtRisk: portfolioVolatility * 1.65, // 95% confidence
      expectedShortfall: portfolioVolatility * 2.33, // Expected shortfall
      maximumDrawdown: portfolioVolatility * 1.5,
      sharpeRatio: 0.15 / portfolioVolatility, // Assume 15% expected return
      downDeviationRisk: portfolioVolatility * 0.7
    }
  }

  private calculatePortfolioReturns(deals: Deal[], fund: Fund): PortfolioReturns {
    // Simplified portfolio return calculation
    const expectedGrossIRR = 0.18 // 18% gross IRR target
    const expectedNetIRR = 0.14 // 14% net IRR after fees

    // J-curve analysis
    const jCurve: JCurveAnalysis = {
      nadir: { year: 2, value: 0.85 }, // 15% drawdown in year 2
      breakeven: { year: 4, value: 1.0 },
      maturity: { year: 6, value: 2.5 },
      callSchedule: [
        { year: 1, percentage: 0.3 },
        { year: 2, percentage: 0.4 },
        { year: 3, percentage: 0.25 },
        { year: 4, percentage: 0.05 }
      ],
      distributionSchedule: [
        { year: 3, percentage: 0.1 },
        { year: 4, percentage: 0.2 },
        { year: 5, percentage: 0.3 },
        { year: 6, percentage: 0.4 }
      ]
    }

    return {
      grossIRR: expectedGrossIRR,
      netIRR: expectedNetIRR,
      dpi: 1.2, // Current distributions
      rvpi: 1.3, // Current residual value
      tvpi: 2.5, // Total value
      jCurve
    }
  }

  performMonteCarloAnalysis(
    deals: Deal[],
    iterations: number = 1000
  ): MonteCarloResults {
    const irrs: number[] = []

    for (let i = 0; i < iterations; i++) {
      // Monte Carlo simulation of portfolio returns
      let portfolioValue = 0
      let totalInvestment = 0

      deals.forEach(deal => {
        const investment = deal.entryMultiple * deal.metrics.ebitda * 0.3
        totalInvestment += investment

        // Random variables
        const ebitdaGrowth = this.prng.normalRandom(0.08, 0.15)
        const exitMultiple = this.prng.normalRandom(deal.baseMultiple, deal.baseMultiple * 0.3)
        const holdingPeriod = 4 + this.prng.next() * 3 // 4-7 years

        // Calculate deal return
        const exitValue = deal.metrics.ebitda * Math.pow(1 + ebitdaGrowth, holdingPeriod) * exitMultiple
        const netProceeds = exitValue * 0.7 // assume 30% goes to debt/fees
        portfolioValue += netProceeds
      })

      const totalReturn = portfolioValue / totalInvestment
      const avgHoldingPeriod = 5
      const irr = Math.pow(totalReturn, 1 / avgHoldingPeriod) - 1
      irrs.push(irr)
    }

    // Sort for percentile calculations
    irrs.sort((a, b) => a - b)

    const getPercentile = (p: number) => irrs[Math.floor(p * iterations)]
    const mean = irrs.reduce((sum, irr) => sum + irr, 0) / iterations
    const variance = irrs.reduce((sum, irr) => sum + Math.pow(irr - mean, 2), 0) / iterations
    const stdDev = Math.sqrt(variance)

    return {
      iterations,
      irrDistribution: {
        p10: getPercentile(0.1),
        p25: getPercentile(0.25),
        p50: getPercentile(0.5),
        p75: getPercentile(0.75),
        p90: getPercentile(0.9),
        mean,
        stdDev
      },
      probabilityOfLoss: irrs.filter(irr => irr < 0).length / iterations,
      valueAtRisk: {
        _95: getPercentile(0.05),
        _99: getPercentile(0.01)
      }
    }
  }

  // Update interest rate environment
  updateMarketConditions(baseRate: number, creditSpread: number): void {
    this.interestRateEnvironment = baseRate
    this.creditSpread = creditSpread
  }
}