import type { DifficultyPack, MacroManifest, EconomyCoeffs, EventDeck, RivalArchetype, LenderPolicy, LPPersona } from '../engine/types'

export async function loadAllConfigs() {
  const [difficulty, macro, economy, takeovers, ops, rivals, lender, lps] = await Promise.all([
    fetch('/config/difficulty.json').then(r=>r.json()) as Promise<DifficultyPack>,
    fetch('/config/macro_scenarios.json').then(r=>r.json()) as Promise<MacroManifest>,
    fetch('/config/economy_coeffs.json').then(r=>r.json()) as Promise<EconomyCoeffs>,
    fetch('/config/events_takeovers.json').then(r=>r.json()) as Promise<EventDeck>,
    fetch('/config/events_ops.json').then(r=>r.json()) as Promise<EventDeck>,
    fetch('/config/rival_archetypes.json').then(r=>r.json()) as Promise<{version:string; archetypes:RivalArchetype[]}>,
    fetch('/config/lender_policy.json').then(r=>r.json()) as Promise<LenderPolicy>,
    fetch('/config/lp_personas.json').then(r=>r.json()) as Promise<{version:string; personas:LPPersona[]}>,
  ])
  return { difficulty, macro, economy, takeovers, ops, rivals: rivals.archetypes, lender, lps: lps.personas }
}
