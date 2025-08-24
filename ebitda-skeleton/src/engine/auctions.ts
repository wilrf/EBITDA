import { PRNG } from './prng'
import type { Deal, RivalArchetype } from './types'

export interface AuctionResult {
  winner: 'player' | 'rival' | 'walk'
  clearingMultiple: number
  rivalId?: string
}

export function runAuction(prng: PRNG, deal: Deal, rivals: RivalArchetype[], heat: number): AuctionResult {
  // Extremely simplified: player's bid is entryMultiple; rivals bid around base with heat
  const playerBid = deal.entryMultiple
  const rivalBids = rivals.map(r => {
    const discipline = r.discipline
    const noise = (1 - discipline) * (0.4 + 0.6*heat) * prng.range(-1, 1)
    return Math.max(3, deal.baseMultiple + noise + prng.range(0, 1))
  })
  const maxRivalBid = Math.max(...rivalBids)
  if (playerBid >= maxRivalBid * (1 + 0.01 * prng.range(0, 1))) {
    return { winner: 'player', clearingMultiple: playerBid }
  } else if (playerBid < maxRivalBid * 0.92) {
    return { winner: 'walk', clearingMultiple: maxRivalBid }
  } else {
    const i = rivalBids.indexOf(maxRivalBid)
    return { winner: 'rival', clearingMultiple: maxRivalBid, rivalId: rivals[i]?.id }
  }
}
