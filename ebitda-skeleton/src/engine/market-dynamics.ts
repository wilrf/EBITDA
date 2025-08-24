import { PRNG } from './prng'
import type { Deal, Firm } from './types'

export enum EconomicCycle {
  EXPANSION = 'expansion',
  PEAK = 'peak',
  CONTRACTION = 'contraction',
  TROUGH = 'trough'
}

export enum MarketWindow {
  WIDE_OPEN = 'wide_open',
  OPEN = 'open',
  SELECTIVE = 'selective',
  DIFFICULT = 'difficult',
  CLOSED = 'closed'
}

export interface EconomicEnvironment {
  cycle: EconomicCycle
  gdpGrowth: number
  inflationRate: number
  unemploymentRate: number
  consumerConfidence: number
  businessInvestment: number
  tradeBalance: number
  cyclePosition: number // 0-1, position within current cycle
  cycleDuration: number // months in current phase
  nextPhaseTransition: number // probability of phase change
}

export interface MarketConditions {
  debtMarkets: DebtMarketConditions
  equityMarkets: EquityMarketConditions
  creditSpreads: CreditSpreads
  liquidityConditions: LiquidityConditions
  regulatoryEnvironment: RegulatoryEnvironment
  marketWindow: MarketWindow
}

export interface DebtMarketConditions {
  leverageAvailability: number // max leverage multiples
  pricingTightness: number // spread compression/expansion
  termFlexibility: number // covenant-lite availability
  institutionalAppetite: number
  bankAppetite: number
  directLendingGrowth: number
  cloIssuance: number
}

export interface EquityMarketConditions {
  publicMarketMultiples: Map<string, number> // by sector
  ipoActivity: number
  maActivity: number
  strategicPremiums: number
  volatilityIndex: number
  correlations: number
}

export interface CreditSpreads {
  riskFreeRate: number
  investmentGrade: number
  highYield: number
  leveragedLoans: number
  mezzanine: number
  distressed: number
}

export interface LiquidityConditions {
  dryPowder: number // uninvested PE capital
  competitionIntensity: number
  averageHoldingPeriod: number
  exitEnvironment: number
  fundraisingActivity: number
}

export interface RegulatoryEnvironment {
  antitrustScrutiny: number
  taxPolicy: TaxPolicy
  financialRegulation: number
  laborRegulation: number
  environmentalRegulation: number
  dataPrivacyRegulation: number
}

export interface TaxPolicy {
  corporateRate: number
  capitalGainsRate: number
  interestDeductibility: number
  carriedInterestTreatment: number
}

export interface SectorDynamics {
  sector: string
  growthRate: number
  profitabilityTrends: number
  competitiveIntensity: number
  consolidationActivity: number
  disruptionRisk: number
  regulatoryPressure: number
  valuationMultiples: MultiplesRange
  cyclicality: number
  defensiveness: number
  esgFactors: ESGFactors
}

export interface MultiplesRange {
  revenue: { min: number; median: number; max: number }
  ebitda: { min: number; median: number; max: number }
  ebit: { min: number; median: number; max: number }
}

export interface ESGFactors {
  environmentalRisk: number
  socialLicense: number
  governanceStandards: number
  climateTransition: number
  diversityRequirements: number
}

export interface CompetitiveLandscape {
  megaFunds: CompetitorProfile[]
  upperMiddle: CompetitorProfile[]
  middleMarket: CompetitorProfile[]
  lowerMiddle: CompetitorProfile[]
  strategics: StrategicBuyer[]
  newEntrants: number
  marketConcentration: number
  averageFundSize: Map<string, number> // by strategy
}

export interface CompetitorProfile {
  id: string
  aum: number // assets under management
  dryPowder: number
  strategy: string[]
  sectorFocus: string[]
  checkSize: { min: number; max: number }
  reputation: number
  dealFlow: number
  executionSpeed: number
  pricingAggression: number
  relationshipStrength: number
}

export interface StrategicBuyer {
  id: string
  sector: string
  acquisitionBudget: number
  strategicRationale: string[]
  synergies: number
  paymentMethods: string[]
  integrationCapability: number
  cultureMatch: number
}

export interface MarketTiming {
  entryTiming: TimingFactors
  exitTiming: TimingFactors
  holdingPeriodOptimal: number
  marketWindows: MarketWindowForecast[]
}

export interface TimingFactors {
  marketCycle: number
  sectorCycle: number
  companySpecific: number
  competitivePosition: number
  liquidityEnvironment: number
  valuationLevels: number
}

export interface MarketWindowForecast {
  windowType: 'debt' | 'equity' | 'ipo' | 'strategic'
  openProbability: number
  duration: number // expected months
  optimalTiming: number // months from now
  riskFactors: string[]
}

export interface DisruptionRisk {
  technology: TechnologyDisruption[]
  regulatory: RegulatoryDisruption[]
  consumer: ConsumerDisruption[]
  competitive: CompetitiveDisruption[]
}

export interface TechnologyDisruption {
  type: string
  impactedSectors: string[]
  timeHorizon: number // years
  disruptionProbability: number
  impactSeverity: number
  adaptationCost: number
}

export interface RegulatoryDisruption {
  type: string
  impactedSectors: string[]
  implementation: number // years
  complianceCost: number
  competitiveImpact: number
}

export interface ConsumerDisruption {
  trend: string
  demographic: string
  adoptionRate: number
  revenueImpact: number
  timeframe: number
}

export interface CompetitiveDisruption {
  source: 'new_entrant' | 'adjacent_industry' | 'business_model'
  marketShare: number
  pricingPressure: number
  moatErosion: number
}

export class MarketDynamicsEngine {
  private prng: PRNG
  private currentEnvironment: EconomicEnvironment
  private marketConditions: MarketConditions
  private sectorDynamics: Map<string, SectorDynamics>
  private competitiveLandscape: CompetitiveLandscape

  constructor(prng: PRNG) {
    this.prng = prng
    this.currentEnvironment = this.initializeEconomicEnvironment()
    this.marketConditions = this.initializeMarketConditions()
    this.sectorDynamics = this.initializeSectorDynamics()
    this.competitiveLandscape = this.initializeCompetitiveLandscape()
  }

  private initializeEconomicEnvironment(): EconomicEnvironment {
    return {
      cycle: EconomicCycle.EXPANSION,
      gdpGrowth: 0.025 + this.prng.next() * 0.02,
      inflationRate: 0.02 + this.prng.next() * 0.03,
      unemploymentRate: 0.04 + this.prng.next() * 0.03,
      consumerConfidence: 50 + this.prng.next() * 50,
      businessInvestment: 0.8 + this.prng.next() * 0.4,
      tradeBalance: -0.02 + this.prng.next() * 0.04,
      cyclePosition: this.prng.next(),
      cycleDuration: 12 + this.prng.next() * 36,
      nextPhaseTransition: 0.1
    }
  }

  private initializeMarketConditions(): MarketConditions {
    return {
      debtMarkets: {
        leverageAvailability: 5.5 + this.prng.next() * 2,
        pricingTightness: 0.7 + this.prng.next() * 0.6,
        termFlexibility: 0.6 + this.prng.next() * 0.4,
        institutionalAppetite: 0.8 + this.prng.next() * 0.4,
        bankAppetite: 0.5 + this.prng.next() * 0.5,
        directLendingGrowth: 0.15 + this.prng.next() * 0.1,
        cloIssuance: 800 + this.prng.next() * 400 // billions
      },
      equityMarkets: {
        publicMarketMultiples: this.generateSectorMultiples(),
        ipoActivity: 150 + this.prng.next() * 100,
        maActivity: 0.8 + this.prng.next() * 0.4,
        strategicPremiums: 0.25 + this.prng.next() * 0.15,
        volatilityIndex: 15 + this.prng.next() * 20,
        correlations: 0.6 + this.prng.next() * 0.3
      },
      creditSpreads: {
        riskFreeRate: 0.02 + this.prng.next() * 0.04,
        investmentGrade: 0.01 + this.prng.next() * 0.02,
        highYield: 0.04 + this.prng.next() * 0.04,
        leveragedLoans: 0.03 + this.prng.next() * 0.03,
        mezzanine: 0.08 + this.prng.next() * 0.04,
        distressed: 0.15 + this.prng.next() * 0.1
      },
      liquidityConditions: {
        dryPowder: 3200 + this.prng.next() * 800, // billions
        competitionIntensity: 0.7 + this.prng.next() * 0.3,
        averageHoldingPeriod: 4.5 + this.prng.next() * 2,
        exitEnvironment: 0.6 + this.prng.next() * 0.4,
        fundraisingActivity: 0.8 + this.prng.next() * 0.4
      },
      regulatoryEnvironment: {
        antitrustScrutiny: 0.3 + this.prng.next() * 0.4,
        taxPolicy: {
          corporateRate: 0.21 + this.prng.next() * 0.14,
          capitalGainsRate: 0.20 + this.prng.next() * 0.15,
          interestDeductibility: 1.0 - this.prng.next() * 0.3,
          carriedInterestTreatment: 0.7 + this.prng.next() * 0.3
        },
        financialRegulation: 0.5 + this.prng.next() * 0.3,
        laborRegulation: 0.4 + this.prng.next() * 0.4,
        environmentalRegulation: 0.6 + this.prng.next() * 0.4,
        dataPrivacyRegulation: 0.7 + this.prng.next() * 0.3
      },
      marketWindow: this.determineMarketWindow()
    }
  }

  private generateSectorMultiples(): Map<string, number> {
    const sectors = [
      'Technology', 'Healthcare', 'Consumer', 'Industrials', 'Financial Services',
      'Energy', 'Real Estate', 'Telecommunications', 'Utilities', 'Materials'
    ]
    
    const multiples = new Map<string, number>()
    sectors.forEach(sector => {
      const baseMultiple = 12 + this.prng.next() * 8
      multiples.set(sector, baseMultiple)
    })
    
    return multiples
  }

  private initializeSectorDynamics(): Map<string, SectorDynamics> {
    const sectors = [
      'Technology', 'Healthcare', 'Consumer', 'Industrials', 'Financial Services',
      'Energy', 'Real Estate', 'Telecommunications', 'Utilities', 'Materials'
    ]
    
    const dynamics = new Map<string, SectorDynamics>()
    
    sectors.forEach(sector => {
      dynamics.set(sector, {
        sector,
        growthRate: this.getSectorGrowthRate(sector),
        profitabilityTrends: 0.5 + this.prng.next() * 0.5,
        competitiveIntensity: 0.3 + this.prng.next() * 0.7,
        consolidationActivity: 0.2 + this.prng.next() * 0.6,
        disruptionRisk: this.getSectorDisruptionRisk(sector),
        regulatoryPressure: this.getSectorRegulatoryPressure(sector),
        valuationMultiples: this.getSectorMultiples(sector),
        cyclicality: this.getSectorCyclicality(sector),
        defensiveness: this.getSectorDefensiveness(sector),
        esgFactors: {
          environmentalRisk: this.getSectorEnvironmentalRisk(sector),
          socialLicense: 0.4 + this.prng.next() * 0.6,
          governanceStandards: 0.6 + this.prng.next() * 0.4,
          climateTransition: this.getSectorClimateRisk(sector),
          diversityRequirements: 0.5 + this.prng.next() * 0.5
        }
      })
    })
    
    return dynamics
  }

  private getSectorGrowthRate(sector: string): number {
    const growthMap: Record<string, number> = {
      'Technology': 0.12 + this.prng.next() * 0.08,
      'Healthcare': 0.08 + this.prng.next() * 0.06,
      'Consumer': 0.04 + this.prng.next() * 0.06,
      'Industrials': 0.03 + this.prng.next() * 0.05,
      'Financial Services': 0.02 + this.prng.next() * 0.06,
      'Energy': -0.02 + this.prng.next() * 0.08,
      'Real Estate': 0.03 + this.prng.next() * 0.05,
      'Telecommunications': 0.01 + this.prng.next() * 0.04,
      'Utilities': 0.02 + this.prng.next() * 0.03,
      'Materials': 0.02 + this.prng.next() * 0.06
    }
    return growthMap[sector] || 0.04 + this.prng.next() * 0.04
  }

  private getSectorDisruptionRisk(sector: string): number {
    const riskMap: Record<string, number> = {
      'Technology': 0.8 + this.prng.next() * 0.2,
      'Healthcare': 0.4 + this.prng.next() * 0.3,
      'Consumer': 0.6 + this.prng.next() * 0.3,
      'Industrials': 0.3 + this.prng.next() * 0.4,
      'Financial Services': 0.7 + this.prng.next() * 0.3,
      'Energy': 0.6 + this.prng.next() * 0.4,
      'Real Estate': 0.2 + this.prng.next() * 0.3,
      'Telecommunications': 0.5 + this.prng.next() * 0.4,
      'Utilities': 0.3 + this.prng.next() * 0.3,
      'Materials': 0.3 + this.prng.next() * 0.3
    }
    return riskMap[sector] || 0.4 + this.prng.next() * 0.3
  }

  private getSectorRegulatoryPressure(sector: string): number {
    const pressureMap: Record<string, number> = {
      'Technology': 0.7 + this.prng.next() * 0.3,
      'Healthcare': 0.8 + this.prng.next() * 0.2,
      'Consumer': 0.4 + this.prng.next() * 0.3,
      'Industrials': 0.5 + this.prng.next() * 0.3,
      'Financial Services': 0.9 + this.prng.next() * 0.1,
      'Energy': 0.8 + this.prng.next() * 0.2,
      'Real Estate': 0.4 + this.prng.next() * 0.3,
      'Telecommunications': 0.6 + this.prng.next() * 0.3,
      'Utilities': 0.9 + this.prng.next() * 0.1,
      'Materials': 0.6 + this.prng.next() * 0.3
    }
    return pressureMap[sector] || 0.5 + this.prng.next() * 0.3
  }

  private getSectorMultiples(sector: string): MultiplesRange {
    const baseRevenue = this.getSectorBaseMultiple(sector, 'revenue')
    const baseEbitda = this.getSectorBaseMultiple(sector, 'ebitda')
    const baseEbit = this.getSectorBaseMultiple(sector, 'ebit')

    return {
      revenue: {
        min: baseRevenue * 0.6,
        median: baseRevenue,
        max: baseRevenue * 1.8
      },
      ebitda: {
        min: baseEbitda * 0.7,
        median: baseEbitda,
        max: baseEbitda * 1.6
      },
      ebit: {
        min: baseEbit * 0.7,
        median: baseEbit,
        max: baseEbit * 1.6
      }
    }
  }

  private getSectorBaseMultiple(sector: string, metric: string): number {
    const multipleMap: Record<string, Record<string, number>> = {
      'Technology': { revenue: 6, ebitda: 18, ebit: 22 },
      'Healthcare': { revenue: 4, ebitda: 15, ebit: 18 },
      'Consumer': { revenue: 2, ebitda: 12, ebit: 15 },
      'Industrials': { revenue: 1.5, ebitda: 10, ebit: 13 },
      'Financial Services': { revenue: 3, ebitda: 11, ebit: 14 },
      'Energy': { revenue: 1.2, ebitda: 8, ebit: 10 },
      'Real Estate': { revenue: 8, ebitda: 16, ebit: 20 },
      'Telecommunications': { revenue: 2, ebitda: 9, ebit: 11 },
      'Utilities': { revenue: 2, ebitda: 10, ebit: 12 },
      'Materials': { revenue: 1.8, ebitda: 9, ebit: 11 }
    }
    return multipleMap[sector]?.[metric] || 10
  }

  private getSectorCyclicality(sector: string): number {
    const cyclicalityMap: Record<string, number> = {
      'Technology': 0.6 + this.prng.next() * 0.3,
      'Healthcare': 0.2 + this.prng.next() * 0.3,
      'Consumer': 0.7 + this.prng.next() * 0.3,
      'Industrials': 0.8 + this.prng.next() * 0.2,
      'Financial Services': 0.9 + this.prng.next() * 0.1,
      'Energy': 0.9 + this.prng.next() * 0.1,
      'Real Estate': 0.8 + this.prng.next() * 0.2,
      'Telecommunications': 0.3 + this.prng.next() * 0.3,
      'Utilities': 0.2 + this.prng.next() * 0.2,
      'Materials': 0.8 + this.prng.next() * 0.2
    }
    return cyclicalityMap[sector] || 0.5 + this.prng.next() * 0.3
  }

  private getSectorDefensiveness(sector: string): number {
    const defensivenessMap: Record<string, number> = {
      'Technology': 0.3 + this.prng.next() * 0.3,
      'Healthcare': 0.8 + this.prng.next() * 0.2,
      'Consumer': 0.4 + this.prng.next() * 0.4,
      'Industrials': 0.3 + this.prng.next() * 0.3,
      'Financial Services': 0.2 + this.prng.next() * 0.3,
      'Energy': 0.2 + this.prng.next() * 0.3,
      'Real Estate': 0.5 + this.prng.next() * 0.3,
      'Telecommunications': 0.7 + this.prng.next() * 0.3,
      'Utilities': 0.9 + this.prng.next() * 0.1,
      'Materials': 0.3 + this.prng.next() * 0.3
    }
    return defensivenessMap[sector] || 0.5 + this.prng.next() * 0.3
  }

  private getSectorEnvironmentalRisk(sector: string): number {
    const envRiskMap: Record<string, number> = {
      'Technology': 0.3 + this.prng.next() * 0.3,
      'Healthcare': 0.4 + this.prng.next() * 0.3,
      'Consumer': 0.5 + this.prng.next() * 0.3,
      'Industrials': 0.7 + this.prng.next() * 0.3,
      'Financial Services': 0.2 + this.prng.next() * 0.2,
      'Energy': 0.9 + this.prng.next() * 0.1,
      'Real Estate': 0.4 + this.prng.next() * 0.3,
      'Telecommunications': 0.3 + this.prng.next() * 0.3,
      'Utilities': 0.8 + this.prng.next() * 0.2,
      'Materials': 0.8 + this.prng.next() * 0.2
    }
    return envRiskMap[sector] || 0.5 + this.prng.next() * 0.3
  }

  private getSectorClimateRisk(sector: string): number {
    const climateRiskMap: Record<string, number> = {
      'Technology': 0.2 + this.prng.next() * 0.2,
      'Healthcare': 0.2 + this.prng.next() * 0.2,
      'Consumer': 0.4 + this.prng.next() * 0.3,
      'Industrials': 0.7 + this.prng.next() * 0.3,
      'Financial Services': 0.3 + this.prng.next() * 0.3,
      'Energy': 0.9 + this.prng.next() * 0.1,
      'Real Estate': 0.6 + this.prng.next() * 0.3,
      'Telecommunications': 0.2 + this.prng.next() * 0.2,
      'Utilities': 0.8 + this.prng.next() * 0.2,
      'Materials': 0.7 + this.prng.next() * 0.3
    }
    return climateRiskMap[sector] || 0.4 + this.prng.next() * 0.3
  }

  private initializeCompetitiveLandscape(): CompetitiveLandscape {
    return {
      megaFunds: this.generateCompetitorProfiles('mega', 8),
      upperMiddle: this.generateCompetitorProfiles('upper_middle', 15),
      middleMarket: this.generateCompetitorProfiles('middle_market', 25),
      lowerMiddle: this.generateCompetitorProfiles('lower_middle', 40),
      strategics: this.generateStrategicBuyers(20),
      newEntrants: 12 + this.prng.next() * 8,
      marketConcentration: 0.3 + this.prng.next() * 0.3,
      averageFundSize: new Map([
        ['mega', 15000 + this.prng.next() * 10000],
        ['upper_middle', 3000 + this.prng.next() * 2000],
        ['middle_market', 800 + this.prng.next() * 700],
        ['lower_middle', 200 + this.prng.next() * 300]
      ])
    }
  }

  private generateCompetitorProfiles(strategy: string, count: number): CompetitorProfile[] {
    const profiles: CompetitorProfile[] = []
    
    for (let i = 0; i < count; i++) {
      const aumRange = this.getAUMRange(strategy)
      const checkSizeRange = this.getCheckSizeRange(strategy)
      
      profiles.push({
        id: `${strategy}_${i + 1}`,
        aum: aumRange.min + this.prng.next() * (aumRange.max - aumRange.min),
        dryPowder: (0.3 + this.prng.next() * 0.4) * aumRange.min,
        strategy: this.getStrategies(strategy),
        sectorFocus: this.generateSectorFocus(),
        checkSize: checkSizeRange,
        reputation: 0.4 + this.prng.next() * 0.6,
        dealFlow: 0.3 + this.prng.next() * 0.7,
        executionSpeed: 0.4 + this.prng.next() * 0.6,
        pricingAggression: 0.3 + this.prng.next() * 0.7,
        relationshipStrength: 0.3 + this.prng.next() * 0.7
      })
    }
    
    return profiles
  }

  private getAUMRange(strategy: string): { min: number; max: number } {
    const ranges: Record<string, { min: number; max: number }> = {
      'mega': { min: 10000, max: 50000 },
      'upper_middle': { min: 2000, max: 8000 },
      'middle_market': { min: 500, max: 2000 },
      'lower_middle': { min: 100, max: 800 }
    }
    return ranges[strategy] || { min: 500, max: 2000 }
  }

  private getCheckSizeRange(strategy: string): { min: number; max: number } {
    const ranges: Record<string, { min: number; max: number }> = {
      'mega': { min: 500, max: 5000 },
      'upper_middle': { min: 100, max: 1000 },
      'middle_market': { min: 25, max: 300 },
      'lower_middle': { min: 5, max: 100 }
    }
    return ranges[strategy] || { min: 25, max: 300 }
  }

  private getStrategies(category: string): string[] {
    const strategiesMap: Record<string, string[]> = {
      'mega': ['buyout', 'growth', 'infrastructure'],
      'upper_middle': ['buyout', 'growth'],
      'middle_market': ['buyout', 'growth', 'special_situations'],
      'lower_middle': ['buyout', 'growth', 'turnaround']
    }
    return strategiesMap[category] || ['buyout']
  }

  private generateSectorFocus(): string[] {
    const allSectors = [
      'Technology', 'Healthcare', 'Consumer', 'Industrials', 'Financial Services',
      'Energy', 'Real Estate', 'Telecommunications', 'Utilities', 'Materials'
    ]
    
    const focusCount = 1 + Math.floor(this.prng.next() * 4)
    const shuffled = [...allSectors].sort(() => 0.5 - this.prng.next())
    return shuffled.slice(0, focusCount)
  }

  private generateStrategicBuyers(count: number): StrategicBuyer[] {
    const buyers: StrategicBuyer[] = []
    const sectors = [
      'Technology', 'Healthcare', 'Consumer', 'Industrials', 'Financial Services'
    ]
    
    for (let i = 0; i < count; i++) {
      const sector = sectors[Math.floor(this.prng.next() * sectors.length)]
      
      buyers.push({
        id: `strategic_${sector.toLowerCase()}_${i + 1}`,
        sector,
        acquisitionBudget: 500 + this.prng.next() * 2000,
        strategicRationale: this.generateStrategicRationale(),
        synergies: 0.15 + this.prng.next() * 0.25,
        paymentMethods: ['cash', 'stock', 'earnout'],
        integrationCapability: 0.4 + this.prng.next() * 0.6,
        cultureMatch: 0.3 + this.prng.next() * 0.7
      })
    }
    
    return buyers
  }

  private generateStrategicRationale(): string[] {
    const rationales = [
      'market_expansion', 'technology_acquisition', 'cost_synergies',
      'revenue_synergies', 'vertical_integration', 'horizontal_integration',
      'talent_acquisition', 'ip_acquisition', 'customer_base'
    ]
    
    const count = 1 + Math.floor(this.prng.next() * 3)
    const shuffled = [...rationales].sort(() => 0.5 - this.prng.next())
    return shuffled.slice(0, count)
  }

  private determineMarketWindow(): MarketWindow {
    const environment = this.currentEnvironment
    const conditions = this.marketConditions
    
    let score = 0
    
    // Economic cycle impact
    switch (environment.cycle) {
      case EconomicCycle.EXPANSION:
        score += 2
        break
      case EconomicCycle.PEAK:
        score += 1
        break
      case EconomicCycle.CONTRACTION:
        score -= 2
        break
      case EconomicCycle.TROUGH:
        score -= 1
        break
    }
    
    // Market conditions impact
    score += conditions.liquidityConditions.exitEnvironment * 2
    score += (1 - conditions.liquidityConditions.competitionIntensity) * 2
    score += (1 - conditions.equityMarkets.volatilityIndex / 35) * 2
    score -= conditions.creditSpreads.highYield * 10
    
    if (score >= 4) return MarketWindow.WIDE_OPEN
    if (score >= 2) return MarketWindow.OPEN
    if (score >= 0) return MarketWindow.SELECTIVE
    if (score >= -2) return MarketWindow.DIFFICULT
    return MarketWindow.CLOSED
  }

  // Public methods for accessing market information
  getCurrentEconomicEnvironment(): EconomicEnvironment {
    return { ...this.currentEnvironment }
  }

  getMarketConditions(): MarketConditions {
    return { ...this.marketConditions }
  }

  getSectorDynamics(sector: string): SectorDynamics | undefined {
    return this.sectorDynamics.get(sector)
  }

  getAllSectorDynamics(): Map<string, SectorDynamics> {
    return new Map(this.sectorDynamics)
  }

  getCompetitiveLandscape(): CompetitiveLandscape {
    return { ...this.competitiveLandscape }
  }

  // Update market conditions over time
  updateMarketConditions(timeStep: number): void {
    this.updateEconomicCycle(timeStep)
    this.updateMarketConditions()
    this.updateSectorDynamics(timeStep)
    this.updateCompetitiveLandscape(timeStep)
  }

  private updateEconomicCycle(timeStep: number): void {
    this.currentEnvironment.cycleDuration += timeStep
    
    // Check for cycle transition
    if (this.prng.next() < this.currentEnvironment.nextPhaseTransition) {
      this.transitionEconomicCycle()
    }
    
    // Update economic indicators based on cycle position
    this.updateEconomicIndicators()
  }

  private transitionEconomicCycle(): void {
    switch (this.currentEnvironment.cycle) {
      case EconomicCycle.EXPANSION:
        this.currentEnvironment.cycle = EconomicCycle.PEAK
        break
      case EconomicCycle.PEAK:
        this.currentEnvironment.cycle = EconomicCycle.CONTRACTION
        break
      case EconomicCycle.CONTRACTION:
        this.currentEnvironment.cycle = EconomicCycle.TROUGH
        break
      case EconomicCycle.TROUGH:
        this.currentEnvironment.cycle = EconomicCycle.EXPANSION
        break
    }
    
    this.currentEnvironment.cycleDuration = 0
    this.currentEnvironment.cyclePosition = 0
    this.currentEnvironment.nextPhaseTransition = 0.05 + this.prng.next() * 0.1
  }

  private updateEconomicIndicators(): void {
    const cycle = this.currentEnvironment.cycle
    const position = this.currentEnvironment.cyclePosition
    
    // Update based on cycle and position
    switch (cycle) {
      case EconomicCycle.EXPANSION:
        this.currentEnvironment.gdpGrowth = 0.02 + position * 0.03 + this.prng.normalRandom(0, 0.01)
        this.currentEnvironment.unemploymentRate = Math.max(0.03, 0.08 - position * 0.04)
        this.currentEnvironment.consumerConfidence = 60 + position * 30
        break
        
      case EconomicCycle.PEAK:
        this.currentEnvironment.gdpGrowth = 0.04 - position * 0.02 + this.prng.normalRandom(0, 0.01)
        this.currentEnvironment.inflationRate = 0.03 + position * 0.02
        this.currentEnvironment.consumerConfidence = 85 - position * 10
        break
        
      case EconomicCycle.CONTRACTION:
        this.currentEnvironment.gdpGrowth = 0.01 - position * 0.04 + this.prng.normalRandom(0, 0.02)
        this.currentEnvironment.unemploymentRate = 0.05 + position * 0.05
        this.currentEnvironment.consumerConfidence = 60 - position * 30
        break
        
      case EconomicCycle.TROUGH:
        this.currentEnvironment.gdpGrowth = -0.02 + position * 0.03 + this.prng.normalRandom(0, 0.015)
        this.currentEnvironment.unemploymentRate = Math.min(0.12, 0.09 + position * 0.03)
        this.currentEnvironment.consumerConfidence = 30 + position * 20
        break
    }
    
    this.currentEnvironment.cyclePosition = Math.min(1, this.currentEnvironment.cyclePosition + 0.1)
  }

  private updateMarketConditions(): void {
    // Update debt markets based on economic conditions
    const econ = this.currentEnvironment
    
    if (econ.cycle === EconomicCycle.EXPANSION || econ.cycle === EconomicCycle.PEAK) {
      this.marketConditions.debtMarkets.leverageAvailability += this.prng.normalRandom(0.1, 0.2)
      this.marketConditions.debtMarkets.pricingTightness += this.prng.normalRandom(0.05, 0.1)
      this.marketConditions.debtMarkets.termFlexibility += this.prng.normalRandom(0.02, 0.05)
    } else {
      this.marketConditions.debtMarkets.leverageAvailability -= this.prng.normalRandom(0.2, 0.3)
      this.marketConditions.debtMarkets.pricingTightness -= this.prng.normalRandom(0.1, 0.2)
      this.marketConditions.debtMarkets.termFlexibility -= this.prng.normalRandom(0.05, 0.1)
    }
    
    // Clamp values to reasonable ranges
    this.marketConditions.debtMarkets.leverageAvailability = Math.max(3, Math.min(8, this.marketConditions.debtMarkets.leverageAvailability))
    this.marketConditions.debtMarkets.pricingTightness = Math.max(0.3, Math.min(1.5, this.marketConditions.debtMarkets.pricingTightness))
    this.marketConditions.debtMarkets.termFlexibility = Math.max(0.2, Math.min(1, this.marketConditions.debtMarkets.termFlexibility))
    
    // Update market window
    this.marketConditions.marketWindow = this.determineMarketWindow()
  }

  private updateSectorDynamics(timeStep: number): void {
    this.sectorDynamics.forEach((dynamics, sector) => {
      // Update growth rates based on economic cycle
      const cycleImpact = this.getCycleImpactOnSector(sector)
      dynamics.growthRate = Math.max(-0.1, dynamics.growthRate + cycleImpact * timeStep / 12)
      
      // Update competitive intensity
      dynamics.competitiveIntensity += this.prng.normalRandom(0, 0.05)
      dynamics.competitiveIntensity = Math.max(0.1, Math.min(1, dynamics.competitiveIntensity))
      
      // Update consolidation activity
      if (this.prng.next() < 0.1) {
        dynamics.consolidationActivity += this.prng.normalRandom(0.1, 0.2)
        dynamics.consolidationActivity = Math.max(0, Math.min(1, dynamics.consolidationActivity))
      }
    })
  }

  private getCycleImpactOnSector(sector: string): number {
    const sectorDynamics = this.sectorDynamics.get(sector)
    if (!sectorDynamics) return 0
    
    const cyclicality = sectorDynamics.cyclicality
    const defensiveness = sectorDynamics.defensiveness
    
    let impact = 0
    switch (this.currentEnvironment.cycle) {
      case EconomicCycle.EXPANSION:
        impact = cyclicality * 0.02 - defensiveness * 0.01
        break
      case EconomicCycle.PEAK:
        impact = cyclicality * 0.01 - defensiveness * 0.005
        break
      case EconomicCycle.CONTRACTION:
        impact = -cyclicality * 0.03 + defensiveness * 0.02
        break
      case EconomicCycle.TROUGH:
        impact = -cyclicality * 0.02 + defensiveness * 0.015
        break
    }
    
    return impact
  }

  private updateCompetitiveLandscape(timeStep: number): void {
    // Update dry powder levels
    this.competitiveLandscape.megaFunds.forEach(fund => {
      fund.dryPowder *= (1 - 0.02 * timeStep / 12) // assume 2% deployment per month
      if (this.prng.next() < 0.05) { // 5% chance of fundraising
        fund.aum += fund.aum * (0.3 + this.prng.next() * 0.5)
        fund.dryPowder = fund.aum * 0.7
      }
    })
    
    // Update new entrants
    if (this.marketConditions.marketWindow === MarketWindow.WIDE_OPEN || 
        this.marketConditions.marketWindow === MarketWindow.OPEN) {
      this.competitiveLandscape.newEntrants += this.prng.next() * 2
    }
    
    // Update market concentration
    this.competitiveLandscape.marketConcentration += this.prng.normalRandom(0, 0.02)
    this.competitiveLandscape.marketConcentration = Math.max(0.2, Math.min(0.7, this.competitiveLandscape.marketConcentration))
  }

  // Calculate optimal timing for market entry/exit
  calculateMarketTiming(deal: Deal): MarketTiming {
    const sectorDynamics = this.sectorDynamics.get(deal.sector)
    const conditions = this.marketConditions
    const environment = this.currentEnvironment
    
    // Entry timing factors
    const entryTiming: TimingFactors = {
      marketCycle: this.getMarketCycleScore(),
      sectorCycle: sectorDynamics ? this.getSectorCycleScore(sectorDynamics) : 0.5,
      companySpecific: this.getCompanySpecificScore(deal),
      competitivePosition: this.getCompetitivePositionScore(deal),
      liquidityEnvironment: conditions.liquidityConditions.exitEnvironment,
      valuationLevels: this.getValuationScore(deal)
    }
    
    // Exit timing factors (similar calculation for different phase)
    const exitTiming: TimingFactors = {
      marketCycle: this.getExitMarketCycleScore(),
      sectorCycle: sectorDynamics ? this.getExitSectorCycleScore(sectorDynamics) : 0.5,
      companySpecific: this.getCompanyExitScore(deal),
      competitivePosition: entryTiming.competitivePosition,
      liquidityEnvironment: conditions.liquidityConditions.exitEnvironment,
      valuationLevels: this.getExitValuationScore(deal)
    }
    
    // Calculate optimal holding period
    const holdingPeriodOptimal = this.calculateOptimalHoldingPeriod(deal, sectorDynamics)
    
    // Generate market window forecasts
    const marketWindows = this.generateMarketWindowForecasts()
    
    return {
      entryTiming,
      exitTiming,
      holdingPeriodOptimal,
      marketWindows
    }
  }

  private getMarketCycleScore(): number {
    switch (this.currentEnvironment.cycle) {
      case EconomicCycle.TROUGH:
        return 0.9 // Best time to buy
      case EconomicCycle.EXPANSION:
        return 0.7
      case EconomicCycle.PEAK:
        return 0.3
      case EconomicCycle.CONTRACTION:
        return 0.5
      default:
        return 0.5
    }
  }

  private getExitMarketCycleScore(): number {
    switch (this.currentEnvironment.cycle) {
      case EconomicCycle.PEAK:
        return 0.9 // Best time to sell
      case EconomicCycle.EXPANSION:
        return 0.7
      case EconomicCycle.TROUGH:
        return 0.3
      case EconomicCycle.CONTRACTION:
        return 0.4
      default:
        return 0.5
    }
  }

  private getSectorCycleScore(dynamics: SectorDynamics): number {
    return Math.max(0, Math.min(1, dynamics.growthRate / 0.15 + 0.5))
  }

  private getExitSectorCycleScore(dynamics: SectorDynamics): number {
    return Math.max(0, Math.min(1, dynamics.growthRate / 0.1 + 0.5))
  }

  private getCompanySpecificScore(deal: Deal): number {
    return (deal.meters.momentum + deal.meters.execution + (1 - deal.meters.fragility)) / 3
  }

  private getCompanyExitScore(deal: Deal): number {
    // Assuming company has improved over holding period
    return Math.min(1, this.getCompanySpecificScore(deal) * 1.2)
  }

  private getCompetitivePositionScore(deal: Deal): number {
    return 1 - this.marketConditions.liquidityConditions.competitionIntensity
  }

  private getValuationScore(deal: Deal): number {
    const sectorMultiples = this.marketConditions.equityMarkets.publicMarketMultiples.get(deal.sector) || 12
    const dealMultiple = deal.entryMultiple
    
    return Math.max(0, Math.min(1, 1 - (dealMultiple / sectorMultiples - 0.8) / 0.4))
  }

  private getExitValuationScore(deal: Deal): number {
    // Higher valuation levels make exits more attractive
    return 1 - this.getValuationScore(deal)
  }

  private calculateOptimalHoldingPeriod(deal: Deal, sectorDynamics?: SectorDynamics): number {
    let baseHolding = 5 // years
    
    // Adjust for sector growth
    if (sectorDynamics) {
      baseHolding += sectorDynamics.growthRate * 10 // Higher growth = longer holding
      baseHolding -= sectorDynamics.disruptionRisk * 2 // Higher disruption risk = shorter holding
    }
    
    // Adjust for company characteristics
    baseHolding += deal.meters.momentum * 2 // Good momentum = longer holding
    baseHolding -= deal.meters.fragility * 2 // Fragile companies = shorter holding
    
    // Adjust for market conditions
    if (this.marketConditions.marketWindow === MarketWindow.WIDE_OPEN) {
      baseHolding -= 1 // Exit sooner when markets are hot
    } else if (this.marketConditions.marketWindow === MarketWindow.CLOSED) {
      baseHolding += 1 // Hold longer when exit markets are poor
    }
    
    return Math.max(3, Math.min(8, baseHolding))
  }

  private generateMarketWindowForecasts(): MarketWindowForecast[] {
    return [
      {
        windowType: 'debt',
        openProbability: this.marketConditions.debtMarkets.institutionalAppetite,
        duration: 6 + this.prng.next() * 12,
        optimalTiming: 3 + this.prng.next() * 6,
        riskFactors: ['interest_rate_rise', 'credit_event', 'regulatory_change']
      },
      {
        windowType: 'equity',
        openProbability: this.marketConditions.equityMarkets.maActivity,
        duration: 8 + this.prng.next() * 16,
        optimalTiming: 6 + this.prng.next() * 12,
        riskFactors: ['market_volatility', 'geopolitical_risk', 'sector_rotation']
      },
      {
        windowType: 'ipo',
        openProbability: Math.max(0.1, this.marketConditions.equityMarkets.ipoActivity / 300),
        duration: 4 + this.prng.next() * 8,
        optimalTiming: 2 + this.prng.next() * 6,
        riskFactors: ['market_volatility', 'regulatory_scrutiny', 'investor_appetite']
      },
      {
        windowType: 'strategic',
        openProbability: 0.6 + this.prng.next() * 0.3,
        duration: 12 + this.prng.next() * 24,
        optimalTiming: 6 + this.prng.next() * 18,
        riskFactors: ['antitrust_scrutiny', 'strategic_priorities', 'integration_risk']
      }
    ]
  }
}