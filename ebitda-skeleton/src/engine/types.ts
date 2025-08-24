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

export interface EventDeck { version: string; events: EventCard[] }

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
  entryDay?: number
  generatedDay?: number
}

export interface ExitOpportunity {
  id: string
  dealId: string
  type: 'strategic' | 'financial' | 'ipo' | 'recap'
  multiple: number
  probability: number
  timing: number
}

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
