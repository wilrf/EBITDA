"""Capital structure and debt pricing."""
from typing import Dict, Any
from .models import LenderPolicy


def price_debt(
    base_rate: float,
    leverage: float,
    size_mm: float,
    cov_lite: bool,
    lender_trust: float,
    risk_level: float,
    reputation_tier: int,
    lender_policy: LenderPolicy
) -> Dict[str, Any]:
    """Price debt for a deal.
    
    Args:
        base_rate: Base interest rate (e.g., Fed funds rate)
        leverage: Leverage ratio for the deal
        size_mm: Deal size in millions
        cov_lite: Whether covenant-lite terms are requested
        lender_trust: Lender trust level in firm
        risk_level: Current risk environment level
        reputation_tier: Firm reputation tier (0-5)
        lender_policy: Lender policy configuration
        
    Returns:
        Dictionary with pricing terms
    """
    # Base spread calculation
    base_spread = 300  # 3% base spread in basis points
    
    # Leverage adjustment
    leverage_adj = max(0, (leverage - 4.0) * 100)  # 1% per turn over 4x
    
    # Size adjustment (smaller deals get higher spreads)
    size_adj = max(0, (50 - size_mm) * 2) if size_mm < 50 else 0
    
    # Covenant-lite premium
    cov_lite_premium = 75 if cov_lite else 0
    
    # Trust adjustment (better trust = lower spread)
    trust_adj = (50 - lender_trust) * 2  # -2bps per point below 50
    
    # Risk environment adjustment
    risk_adj = risk_level * 100  # 1% per risk level point
    
    # Reputation discount
    reputation_discount = reputation_tier * 25  # 25bps per tier
    
    # Total spread calculation
    total_spread = (
        base_spread + 
        leverage_adj + 
        size_adj + 
        cov_lite_premium + 
        trust_adj + 
        risk_adj - 
        reputation_discount
    )
    
    # Ensure minimum spread
    total_spread = max(150, total_spread)  # Minimum 1.5%
    
    # Convert to rate
    coupon_rate = base_rate + (total_spread / 10000)
    
    return {
        "coupon_rate": coupon_rate,
        "spread_bps": total_spread,
        "base_rate": base_rate,
        "components": {
            "base_spread": base_spread,
            "leverage_adj": leverage_adj,
            "size_adj": size_adj,
            "cov_lite_premium": cov_lite_premium,
            "trust_adj": trust_adj,
            "risk_adj": risk_adj,
            "reputation_discount": reputation_discount
        }
    }