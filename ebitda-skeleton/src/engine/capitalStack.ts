import type { LenderPolicy } from './types'

export interface TermSheet {
  couponPct: number
  spreadBps: number
  feesOidPct: number
}

export function priceDebt(
  baseRatePct: number,
  leverage: number,
  leverageTarget: number,
  covLite: boolean,
  lenderTrust: number,
  R: number,
  repTier: number,
  policy: LenderPolicy
): TermSheet {
  const b0 = policy?.['pricing_b0'] ?? 300
  const b1 = policy?.['pricing_b1'] ?? 80
  const b2 = policy?.['pricing_b2_covlite'] ?? 50
  const b3 = policy?.['pricing_b3_trust'] ?? 20
  const b4 = policy?.['pricing_b4_R'] ?? 30
  const b5 = policy?.['pricing_b5_rep'] ?? 20

  let spread = b0
  spread += b1 * Math.max(0, (leverage - leverageTarget) / 0.5)
  spread += covLite ? b2 : 0
  spread += b3 * Math.max(0, (50 - lenderTrust)/10)
  spread += b4 * R
  spread -= b5 * repTier

  const spreadPct = spread / 100.0
  const couponPct = baseRatePct + spreadPct
  const feesOidPct = 1.0 + 0.3 * R
  return { couponPct, spreadBps: spread, feesOidPct }
}
