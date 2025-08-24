"""Auction system for deal acquisition."""
from dataclasses import dataclass
from typing import List, Optional
from .prng import PRNG
from .models import Deal, RivalArchetype


@dataclass
class AuctionResult:
    """Result of an auction process."""
    winner: str  # 'player', 'rival', or 'walk'
    clearing_multiple: float
    rival_id: Optional[str] = None


def run_auction(prng: PRNG, deal: Deal, rivals: List[RivalArchetype], heat: float) -> AuctionResult:
    """Run auction process for a deal.
    
    Args:
        prng: Random number generator
        deal: Deal being auctioned
        rivals: List of rival bidders
        heat: Market heat level (0-1)
        
    Returns:
        AuctionResult with winner and pricing info
    """
    # Player's bid is the entry multiple
    player_bid = deal.entry_multiple
    
    # Generate rival bids based on discipline and market heat
    rival_bids = []
    for rival in rivals:
        discipline = rival.discipline
        noise = (1 - discipline) * (0.4 + 0.6 * heat) * prng.range(-1, 1)
        bid = max(3.0, deal.base_multiple + noise + prng.range(0, 1))
        rival_bids.append(bid)
    
    if not rival_bids:
        return AuctionResult(winner='player', clearing_multiple=player_bid)
    
    max_rival_bid = max(rival_bids)
    
    # Determine auction outcome
    if player_bid >= max_rival_bid * (1 + 0.01 * prng.range(0, 1)):
        return AuctionResult(winner='player', clearing_multiple=player_bid)
    elif player_bid < max_rival_bid * 0.92:
        return AuctionResult(winner='walk', clearing_multiple=max_rival_bid)
    else:
        # Find winning rival
        winning_rival_idx = rival_bids.index(max_rival_bid)
        rival_id = rivals[winning_rival_idx].id if winning_rival_idx < len(rivals) else None
        return AuctionResult(winner='rival', clearing_multiple=max_rival_bid, rival_id=rival_id)