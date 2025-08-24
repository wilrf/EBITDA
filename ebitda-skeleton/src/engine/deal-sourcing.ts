import { PRNG } from './prng'
import type { Deal, Firm, RivalArchetype } from './types'

export enum DealSourceType {
  PROPRIETARY = 'proprietary',
  BROAD_AUCTION = 'broad_auction',
  LIMITED_AUCTION = 'limited_auction',
  NEGOTIATED = 'negotiated',
  DISTRESSED = 'distressed',
  PUBLIC_TO_PRIVATE = 'public_to_private'
}

export enum IntermediaryType {
  BULGE_BRACKET = 'bulge_bracket',
  MIDDLE_MARKET_BANK = 'middle_market_bank',
  BOUTIQUE = 'boutique',
  BUSINESS_BROKER = 'business_broker',
  NONE = 'none'
}

export interface DealSource {
  type: DealSourceType
  intermediary: IntermediaryType
  relationshipStrength: number // 0-100
  exclusivityPeriod?: number // days
  breakupFee?: number
  confidentialityLevel: number // 0-100
}

export interface RelationshipNetwork {
  corporateExecutives: Map<string, number> // CEO/CFO relationships
  advisors: Map<string, number> // Banker/lawyer relationships
  industrySources: Map<string, number> // Consultants/experts
  coinvestors: Map<string, number> // Other PE firms
  portfolioCompanies: Map<string, number> // Existing portfolio CEOs
}

export interface DealOriginationMetrics {
  proprietaryRatio: number
  winRate: number
  averageTimeToClose: number
  sourcingCost: number
  conversionRate: number
}

export class DealSourcingEngine {
  private prng: PRNG
  private relationships: RelationshipNetwork

  constructor(prng: PRNG) {
    this.prng = prng
    this.relationships = this.initializeRelationships()
  }

  private initializeRelationships(): RelationshipNetwork {
    return {
      corporateExecutives: new Map([
        ['tech_ceo_network', 30],
        ['healthcare_exec_network', 25],
        ['industrial_leaders', 20],
        ['consumer_executives', 35],
        ['financial_services_network', 15]
      ]),
      advisors: new Map([
        ['goldman_sachs', 40],
        ['morgan_stanley', 35],
        ['evercore', 45],
        ['lazard', 30],
        ['jefferies', 25],
        ['houlihan_lokey', 50],
        ['william_blair', 35],
        ['baird', 30]
      ]),
      industrySources: new Map([
        ['mckinsey', 25],
        ['bain', 30],
        ['bcg', 20],
        ['deloitte', 35],
        ['ey_parthenon', 30],
        ['kearney', 25],
        ['oliver_wyman', 20]
      ]),
      coinvestors: new Map([
        ['mega_fund_1', 15],
        ['mega_fund_2', 10],
        ['mid_market_1', 35],
        ['mid_market_2', 40],
        ['sector_specialist_1', 45]
      ]),
      portfolioCompanies: new Map([
        ['portfolio_ceo_1', 60],
        ['portfolio_ceo_2', 55],
        ['portfolio_cfo_1', 45],
        ['former_exec_1', 50]
      ])
    }
  }

  generateDealSource(firm: Firm, sector: string): DealSource {
    const proprietaryChance = this.calculateProprietaryChance(firm, sector)
    
    if (this.prng.next() < proprietaryChance) {
      return this.generateProprietaryDeal(firm, sector)
    } else {
      return this.generateAuctionDeal(firm, sector)
    }
  }

  private calculateProprietaryChance(firm: Firm, sector: string): number {
    let baseChance = 0.15 // 15% base chance
    
    // Reputation bonus
    baseChance += (firm.reputation - 50) * 0.002
    
    // Relationship bonus
    const avgRelationship = this.getAverageRelationshipStrength(sector)
    baseChance += avgRelationship * 0.003
    
    // Culture/operational focus bonus
    if (firm.culture > 60) baseChance += 0.05
    
    return Math.min(0.4, Math.max(0.05, baseChance))
  }

  private getAverageRelationshipStrength(sector: string): number {
    let totalStrength = 0
    let count = 0
    
    this.relationships.corporateExecutives.forEach((strength, network) => {
      if (network.includes(sector.toLowerCase())) {
        totalStrength += strength
        count++
      }
    })
    
    this.relationships.portfolioCompanies.forEach((strength) => {
      totalStrength += strength * 0.5 // Portfolio companies less sector-specific
      count++
    })
    
    return count > 0 ? totalStrength / count : 20
  }

  private generateProprietaryDeal(firm: Firm, sector: string): DealSource {
    const relationshipStrength = 60 + this.prng.range(0, 40)
    
    return {
      type: DealSourceType.PROPRIETARY,
      intermediary: IntermediaryType.NONE,
      relationshipStrength,
      exclusivityPeriod: 30 + Math.floor(this.prng.range(0, 60)),
      confidentialityLevel: 80 + this.prng.range(0, 20)
    }
  }

  private generateAuctionDeal(firm: Firm, sector: string): DealSource {
    const auctionType = this.selectAuctionType(firm)
    const intermediary = this.selectIntermediary(auctionType)
    const relationshipStrength = this.calculateIntermediaryRelationship(intermediary, firm)
    
    return {
      type: auctionType,
      intermediary,
      relationshipStrength,
      breakupFee: auctionType === DealSourceType.NEGOTIATED ? 
        this.prng.range(1000000, 5000000) : undefined,
      confidentialityLevel: this.getConfidentialityLevel(auctionType)
    }
  }

  private selectAuctionType(firm: Firm): DealSourceType {
    const rand = this.prng.next()
    
    if (firm.reputation > 70) {
      // High reputation firms see more limited auctions
      if (rand < 0.3) return DealSourceType.LIMITED_AUCTION
      if (rand < 0.5) return DealSourceType.NEGOTIATED
      if (rand < 0.8) return DealSourceType.BROAD_AUCTION
      return DealSourceType.PUBLIC_TO_PRIVATE
    } else if (firm.reputation > 40) {
      // Mid reputation mostly broad auctions
      if (rand < 0.6) return DealSourceType.BROAD_AUCTION
      if (rand < 0.8) return DealSourceType.LIMITED_AUCTION
      return DealSourceType.NEGOTIATED
    } else {
      // Lower reputation sees more distressed
      if (rand < 0.4) return DealSourceType.BROAD_AUCTION
      if (rand < 0.7) return DealSourceType.DISTRESSED
      return DealSourceType.LIMITED_AUCTION
    }
  }

  private selectIntermediary(auctionType: DealSourceType): IntermediaryType {
    const rand = this.prng.next()
    
    switch (auctionType) {
      case DealSourceType.BROAD_AUCTION:
        if (rand < 0.4) return IntermediaryType.BULGE_BRACKET
        if (rand < 0.7) return IntermediaryType.MIDDLE_MARKET_BANK
        return IntermediaryType.BOUTIQUE
        
      case DealSourceType.LIMITED_AUCTION:
        if (rand < 0.2) return IntermediaryType.BULGE_BRACKET
        if (rand < 0.6) return IntermediaryType.BOUTIQUE
        return IntermediaryType.MIDDLE_MARKET_BANK
        
      case DealSourceType.NEGOTIATED:
        if (rand < 0.3) return IntermediaryType.BOUTIQUE
        if (rand < 0.5) return IntermediaryType.NONE
        return IntermediaryType.MIDDLE_MARKET_BANK
        
      case DealSourceType.DISTRESSED:
        if (rand < 0.5) return IntermediaryType.BOUTIQUE
        return IntermediaryType.MIDDLE_MARKET_BANK
        
      case DealSourceType.PUBLIC_TO_PRIVATE:
        if (rand < 0.7) return IntermediaryType.BULGE_BRACKET
        return IntermediaryType.BOUTIQUE
        
      default:
        return IntermediaryType.MIDDLE_MARKET_BANK
    }
  }

  private calculateIntermediaryRelationship(
    intermediary: IntermediaryType, 
    firm: Firm
  ): number {
    let baseRelationship = 30
    
    // Get specific advisor relationship if exists
    const advisorRelationships = Array.from(this.relationships.advisors.values())
    if (advisorRelationships.length > 0) {
      const index = Math.floor(this.prng.next() * advisorRelationships.length)
      baseRelationship = advisorRelationships[index]
    }
    
    // Adjust based on firm reputation
    baseRelationship += (firm.reputation - 50) * 0.3
    
    // Intermediary type adjustments
    switch (intermediary) {
      case IntermediaryType.BULGE_BRACKET:
        baseRelationship += firm.reputation > 60 ? 10 : -10
        break
      case IntermediaryType.BOUTIQUE:
        baseRelationship += 5 // Boutiques often have stronger relationships
        break
      case IntermediaryType.BUSINESS_BROKER:
        baseRelationship -= 10 // Less sophisticated relationship
        break
    }
    
    return Math.min(100, Math.max(0, baseRelationship + this.prng.range(-10, 10)))
  }

  private getConfidentialityLevel(auctionType: DealSourceType): number {
    switch (auctionType) {
      case DealSourceType.PROPRIETARY:
        return 90 + this.prng.range(0, 10)
      case DealSourceType.LIMITED_AUCTION:
        return 70 + this.prng.range(0, 20)
      case DealSourceType.NEGOTIATED:
        return 75 + this.prng.range(0, 15)
      case DealSourceType.BROAD_AUCTION:
        return 30 + this.prng.range(0, 30)
      case DealSourceType.DISTRESSED:
        return 20 + this.prng.range(0, 30)
      case DealSourceType.PUBLIC_TO_PRIVATE:
        return 10 + this.prng.range(0, 20)
      default:
        return 50
    }
  }

  improveRelationship(
    category: keyof RelationshipNetwork, 
    entity: string, 
    amount: number
  ): void {
    const current = this.relationships[category].get(entity) || 0
    this.relationships[category].set(entity, Math.min(100, current + amount))
  }

  calculateSourcingAdvantage(
    source: DealSource, 
    firm: Firm, 
    rivals: RivalArchetype[]
  ): number {
    let advantage = 0
    
    // Proprietary deals have huge advantage
    if (source.type === DealSourceType.PROPRIETARY) {
      advantage += 0.3
    }
    
    // Relationship strength advantage
    advantage += (source.relationshipStrength - 50) * 0.002
    
    // Limited auction advantage
    if (source.type === DealSourceType.LIMITED_AUCTION) {
      const invitedCount = 3 + Math.floor(this.prng.range(0, 5))
      advantage += (8 - invitedCount) * 0.02
    }
    
    // Negotiated deal advantage
    if (source.type === DealSourceType.NEGOTIATED) {
      advantage += 0.15
    }
    
    // Exclusivity period advantage
    if (source.exclusivityPeriod && source.exclusivityPeriod > 0) {
      advantage += 0.1
    }
    
    return Math.min(0.5, Math.max(-0.2, advantage))
  }

  getOriginationMetrics(deals: Deal[]): DealOriginationMetrics {
    // This would calculate actual metrics from deal history
    // Placeholder implementation
    return {
      proprietaryRatio: 0.2,
      winRate: 0.15,
      averageTimeToClose: 120,
      sourcingCost: 500000,
      conversionRate: 0.05
    }
  }
}