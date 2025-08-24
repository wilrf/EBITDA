"""Covenant monitoring and breach detection."""
from .models import Deal


def check_covenants(deal: Deal, risk_factor: float) -> bool:
    """Check if deal covenants are in breach.
    
    Args:
        deal: Deal to check covenants for
        risk_factor: Current risk environment factor
        
    Returns:
        True if covenants are breached, False otherwise
    """
    # Simplified covenant breach logic
    # In reality, this would check actual financial metrics
    
    # Risk-adjusted breach probability
    breach_threshold = 0.2 + (risk_factor * 0.3)
    
    # Higher leverage increases breach probability
    leverage_penalty = max(0, (deal.leverage - 4.0) * 0.1)
    
    # Fragility meter affects breach probability
    fragility_penalty = deal.meters.fragility / 1000
    
    total_breach_prob = breach_threshold + leverage_penalty + fragility_penalty
    
    # For now, return breach if total probability exceeds threshold
    return total_breach_prob > 0.4


def calculate_covenant_headroom(deal: Deal, risk_factor: float) -> float:
    """Calculate covenant headroom percentage.
    
    Args:
        deal: Deal to calculate headroom for
        risk_factor: Current risk environment factor
        
    Returns:
        Covenant headroom as percentage
    """
    # Base headroom calculation
    base_headroom = 20.0  # 20% base headroom
    
    # Adjust for leverage
    leverage_adj = (5.0 - deal.leverage) * 5.0  # 5% per turn below 5x
    
    # Adjust for execution quality
    execution_adj = (deal.meters.execution - 50) / 10  # Adjust based on execution meter
    
    # Risk environment adjustment
    risk_adj = -risk_factor * 10  # Reduce headroom in high-risk environment
    
    total_headroom = base_headroom + leverage_adj + execution_adj + risk_adj
    
    # Clamp between 0 and 50%
    return max(0.0, min(50.0, total_headroom))