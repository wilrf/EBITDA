import type { GameState, Deal, Fund, Firm, Mode, Scenario, EconomyCoeffs, DifficultyPack, EventDeck, RivalArchetype, LenderPolicy, LPPersona } from './types'
import { PRNG } from './prng'
import { computeMacroStep } from './macro'
import { runAuction } from './auctions'
import { priceDebt } from './capitalStack'
import { checkCovenants } from './covenants'
import { spawnEventFromDeck, advanceEvents } from './events'

export interface EngineConfig {
  mode: Mode
  seed: number
  scenario: Scenario
  economy: EconomyCoeffs
  difficulty: DifficultyPack
  decks: { takeovers: EventDeck; ops: EventDeck }
  rivals: RivalArchetype[]
  lenderPolicy: LenderPolicy
  lpPersonas: LPPersona[]
}

export class GameEngine {
  public state: GameState
  private prng: PRNG
  private cfg: EngineConfig

  constructor(cfg: EngineConfig) {
    this.cfg = cfg
    this.prng = new PRNG(cfg.seed)
    const firm: Firm = { reputation: 50, lenderTrust: 50, lpTrust: 50, auditComfort: 60, boardGov: 55, opsCapacity: 3, culture: 50 }
    const fund: Fund = { id: 'Fund I', vintage: 1, size: 100_000_000, cash: 20_000_000, undrawn: 80_000_000, dpi: 0, rvpi: 1, tvpi: 1, netIRR: 0 }
    const pipeline = this.generateInitialPipeline()
    this.state = {
      mode: cfg.mode, day: 1, week: 1, quarter: 1, seed: cfg.seed,
      firm, fund, deals: [], activeEvents: [], pipeline, kpis: {}
    }
  }

  private generateInitialPipeline(): Deal[] {
    const macro = computeMacroStep(this.cfg.scenario, this.cfg.economy, 0)
    const sectors = Object.keys(macro.baseSectorMultiple)
    const picks = sectors.slice(0, 3)
    return picks.map((s, i) => ({
      id: `P${i+1}`,
      name: `${s.toUpperCase()} Co`,
      sector: s,
      baseMultiple: macro.baseSectorMultiple[s] ?? 7.5,
      entryMultiple: (macro.baseSectorMultiple[s] ?? 7.5) * (1 + 0.02 * (this.state?.firm?.reputation ?? 50 - 50)/10),
      leverage: 4.5,
      covenants: { Lmax: this.cfg.lenderPolicy.cov_defaults.Lmax, Imin: this.cfg.lenderPolicy.cov_defaults.Imin },
      public: false,
      metrics: { ebitda: 10_000_000, revenue: 100_000_000 },
      meters: { fragility: 40, execution: 55, momentum: 50 }
    }))
  }

  tickDay() {
    const step = Math.floor((this.state.week-1)/ (this.cfg.scenario.frequency === 'quarterly' ? 13 : 1))
    const macro = computeMacroStep(this.cfg.scenario, this.cfg.economy, step)
    this.state.kpis['M'] = macro.M
    this.state.kpis['R'] = macro.R

    // progress timers & events
    advanceEvents(this.state)

    // light random drift on reputation/momentum (placeholder)
    this.state.firm.reputation = clamp(this.state.firm.reputation + (this.prng.range(-0.3, 0.4)), 0, 100)
    this.state.day += 1

    // week gate every 7 days
    if (this.state.day % 7 === 0) {
      this.state.week += 1
    }
    // quarter gate every 13 weeks (approx skeleton)
    if (this.state.week % 13 === 0 && this.state.day % 7 === 0) {
      this.state.quarter += 1
      // trust drift
      this.state.firm.lenderTrust = clamp(this.state.firm.lenderTrust + 1, 0, 100)
    }
  }

  startAuctionForPipeline(i: number) {
    const deal = this.state.pipeline[i]
    if (!deal) return { ok: false }
    // Initialize rivals subset
    const rivalSet = this.cfg.rivals.slice(0, Math.max(2, Math.min(this.cfg.difficulty.multipliers.rivals_count, this.cfg.rivals.length)))
    const heat = clamp(this.state.kpis['M'] ?? 0, -2, 2) / 2 + 0.5
    const res = runAuction(this.prng, deal, rivalSet, heat)
    if (res.winner === 'player') {
      this.state.deals.push(deal)
      this.state.pipeline.splice(i,1)
      return { ok: true, won: true, multiple: res.clearingMultiple }
    } else if (res.winner === 'rival') {
      this.state.pipeline.splice(i,1)
      return { ok: true, won: false, rival: res.rivalId, multiple: res.clearingMultiple }
    } else {
      return { ok: true, won: false, walk: true, multiple: res.clearingMultiple }
    }
  }

  priceDebtPreview(leverage: number, covLite: boolean) {
    const step = Math.floor((this.state.week-1)/ (this.cfg.scenario.frequency === 'quarterly' ? 13 : 1))
    const macro = computeMacroStep(this.cfg.scenario, this.cfg.economy, step)
    const baseRate = (this.cfg.scenario.series.fed_funds_rate_pct?.[step] ?? 2.0)
    const ts = priceDebt(baseRate, leverage, 5.0, covLite, this.state.firm.lenderTrust, macro.R, Math.floor(this.state.firm.reputation/20), this.cfg.lenderPolicy)
    return ts
  }

  weeklyReport() {
    // Compose a lightweight report
    return {
      week: this.state.week,
      fundCash: this.state.fund.cash,
      reputation: this.state.firm.reputation,
      lenderTrust: this.state.firm.lenderTrust,
      pipeline: this.state.pipeline.map(d => ({ id: d.id, name: d.name, sector: d.sector, multiple: d.entryMultiple })),
      deals: this.state.deals.map(d => ({ id: d.id, name: d.name, lev: d.leverage, cov: d.covenants })),
      risks: this.state.deals.map(d => ({ id: d.id, breach: checkCovenants(d, this.state.kpis['R'] ?? 0) })),
      suggestions: this.suggestActions()
    }
  }

  private suggestActions(): string[] {
    const s: string[] = []
    if (this.state.pipeline.length) s.push('Consider running an auction on a pipeline target.')
    if (this.state.deals.some(d => d.meters.fragility > 60)) s.push('Reduce fragility: lower leverage or improve execution.')
    if ((this.state.kpis['R'] ?? 0) > 1.5) s.push('Risk stress high: avoid cov-lite this week.')
    return s
  }
}

function clamp(x: number, a: number, b: number) { return Math.max(a, Math.min(b, x)) }
