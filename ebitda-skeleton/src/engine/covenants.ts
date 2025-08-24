import type { Deal } from './types'

export interface BreachCheck {
  breached: boolean
  which: 'leverage' | 'coverage' | null
}

export function checkCovenants(deal: Deal, R: number): BreachCheck {
  // Simplified: fragility + R raise breach odds
  const lev = deal.leverage
  const Lmax = deal.covenants.Lmax
  const coverage = 2.2 - 0.2 * R - 0.1 * (deal.meters.fragility/20)
  const Imin = deal.covenants.Imin

  if (lev > Lmax) return { breached: true, which: 'leverage' }
  if (coverage < Imin) return { breached: true, which: 'coverage' }
  return { breached: false, which: null }
}
