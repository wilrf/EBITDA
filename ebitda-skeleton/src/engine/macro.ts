import type { Scenario, EconomyCoeffs } from './types'

export interface MacroStep {
  ER: number; G: number; VX: number; HY: number; IG: number;
  baseSectorMultiple: Record<string, number>
  M: number; R: number;
}

export function computeMacroStep(scn: Scenario, coeffs: EconomyCoeffs, step: number): MacroStep {
  const ER = valueAt(scn.series.sp500_total_return_pct, step) ?? 0
  const G = valueAt(scn.series.gdp_growth_pct, step) ?? 0
  const VX = valueAt(scn.series.vix_level, step) ?? 20
  const HY = valueAt(scn.series.credit_spread_hy_bps, step) ?? 400
  const IG = valueAt(scn.series.credit_spread_ig_bps, step) ?? 120
  const bm = scn.series.base_sector_multiple ?? {}
  const base: Record<string, number> = {}
  for (const k of Object.keys(bm)) base[k] = valueAt(bm[k], step) ?? 8

  const M = clamp(0.5*ER + 0.3*G - 0.02*VX, -2, 2)
  const R = clamp(0.015*VX + 0.002*(HY-400), 0, 3)

  return { ER, G, VX, HY, IG, baseSectorMultiple: base, M, R }
}

function valueAt(arr: number[] | undefined, i: number): number | undefined {
  if (!arr || i < 0) return undefined
  return arr[Math.min(i, arr.length-1)]
}

function clamp(x: number, a: number, b: number): number { return Math.max(a, Math.min(b, x)) }
