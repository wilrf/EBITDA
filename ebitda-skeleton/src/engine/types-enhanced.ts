export type Mode = 'easy' | 'medium' | 'hard'

export interface DifficultyGates {
  enable_mezz: boolean
  enable_2L: boolean
  enable_covlite: boolean
  enable_hedging: boolean
  enable_antitrust: boolean
  enable_hostile: boolean
  enable_greenmail: boolean
  enable_club_deals: boolean
  enable_pacman: boolean
  enable_continuation: boolean
  enable_cyber: boolean
  enable_labor: boolean
}

export interface DifficultyPack {
  id: string
  version: string
  gates: DifficultyGates
  multipliers: {
    macro_vol: number
    rivals_count: number
    snipe_odds: number
    spread_adders_bps: number
    leverage_cap: number
    covenant_headroom_pct: number
    info_noise: number
    crisis_timer_scale: number
    trust_decay_scale: number
    score_mult: number
  }
}

export interface Scenario {
  scenario_id: string
  start_date: string
  frequency: 'weekly' | 'monthly' | 'quarterly'
  duration_steps: number
  dates?: string[]
  series: Record<string, any>
}

export interface MacroManifest {
  version: string
  scenarios: Scenario[]
}

export interface EconomyCoeffs {
  version: string
  macro_to_game: Record<string, any>
  pricing: Record<string, any>
  defaults: Record<string, any>
}

export interface RivalArchetype {
  id: string
  snipe_odds: { base: number; hot_sector_bonus: number }
  hostile_pref: number
  leak_rate: number
  discipline: number
  legal_aggressiveness: number
}

export interface LenderPolicy {
  version: string
  trust_memory: Record<string, any>
  flex_bands: Record<string, any>
  amend_fee_schedule: Record<string, any>
  cov_defaults: { Lmax: number; Imin: number }
}

export interface LPPersona {
  id: string
  patience: number
  fee_sensitivity: number
  esg_strictness: number
  side_letters: Record<string, any>
}

export interface EventChoice {
  id: string
  label: string
  reqs?: Record<string, any>
  effects?: Record<string, any>
  spawn_event?: string | null
}

export interface EventCard {
  id: string
  rarity: 'common'|'uncommon'|'rare'|'legendary'
  trigger: Record<string, any>
  timer_days: number
  text: string
  choices: EventChoice[]
  touches?: string[]
}

export interface EventDeck { 
  version: string
  events: EventCard[] 
}

// Enhanced Deal interface with performance tracking
export interface Deal {
  id: string
  name: string
  sector: string
  baseMultiple: number
  entryMultiple: number
  leverage: number
  covenants: { Lmax: number; Imin: number }
  public: boolean
  metrics: { ebitda: number; revenue: number }
  meters: { fragility: number; execution: number; momentum: number }
  // Enhanced with performance tracking
  entryDate?: number
  entryValuation?: number
  currentValuation?: number
  holdingPeriod?: number
}

// Enhanced Fund interface with performance tracking
export interface Fund {
  id: string
  vintage: number
  size: number
  cash: number
  undrawn: number
  dpi: number
  rvpi: number
  tvpi: number
  netIRR: number
  // Enhanced with lifecycle tracking
  called?: number
  distributed?: number
  nav?: number
  carriedInterest?: number
  managementFees?: number
}

export interface Firm {
  reputation: number
  lenderTrust: number
  lpTrust: number
  auditComfort: number
  boardGov: number
  opsCapacity: number
  culture: number
}

export interface GameState {
  mode: Mode
  day: number
  week: number
  quarter: number
  seed: number
  firm: Firm
  fund: Fund
  deals: Deal[]
  activeEvents: ActiveEvent[]
  pipeline: Deal[]
  kpis: Record<string, number>
}

export interface ActiveEvent {
  id: string
  card: EventCard
  endsOnDay: number
  dealId?: string
}

// Exit and Performance interfaces
export interface ExitOpportunity {
  id: string
  dealId: string
  type: 'strategic' | 'sponsor' | 'ipo'
  multiple: number
  buyerName: string
  confidenceLevel: number
  timeline: number
  generatedOnDay: number
}

export interface DealPerformance {
  dealId: string
  entryDate: number
  entryValuation: number
  currentValuation: number
  moic: number
  irr: number
  daysHeld: number
}

// Portfolio management interfaces
export interface BoltOnOpportunity {
  id: string
  dealId: string
  targetName: string
  sector: string
  cost: number
  synergies: number
  integrationRisk: number
  expectedReturn: number
  timeline: number
}

export interface WorkingCapitalOptimization {
  id: string
  dealId: string
  type: 'inventory' | 'receivables' | 'payables' | 'cash_conversion'
  cashImpact: number
  implementationCost: number
  riskLevel: number
  timeline: number
}

export interface PortfolioInitiative {
  id: string
  dealId: string
  type: 'operational_improvement' | 'market_expansion' | 'cost_reduction' | 'tech_upgrade' | 'esg_initiative'
  cost: number
  expectedBenefit: number
  timeline: number
  riskLevel: number
  requiredCapacity: number
}

// LP and fundraising interfaces
export type FundPhase = 'fundraising' | 'investing' | 'harvesting' | 'winding_down'

export interface LPCommitment {
  lpId: string
  commitment: number
  called: number
  distributed: number
  satisfaction: number
}

export interface CapitalCall {
  id: string
  amount: number
  purpose: string
  dueDate: number
  issued: boolean
  collected: number
}

export interface Distribution {
  id: string
  amount: number
  type: 'return_of_capital' | 'carried_interest'
  dealId?: string
  distributionDate: number
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