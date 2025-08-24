"""Macro economic simulation engine."""
from typing import Dict, Any
from .models import Scenario, EconomyCoeffs


def compute_macro_step(scenario: Scenario, economy: EconomyCoeffs, step: int) -> Dict[str, Any]:
    """Compute macro economic state for a given step.
    
    Args:
        scenario: Macro scenario configuration
        economy: Economic coefficients
        step: Time step to compute
        
    Returns:
        Dictionary with macro economic indicators
    """
    # Get base values from scenario series
    fed_rate = scenario.series.get('fed_funds_rate_pct', [2.0])
    gdp_growth = scenario.series.get('gdp_growth_pct', [2.5])
    credit_spread = scenario.series.get('credit_spread_bps', [200])
    
    # Use step index, clamping to available data
    max_step = min(step, len(fed_rate) - 1) if fed_rate else 0
    
    current_fed_rate = fed_rate[max_step] if fed_rate else 2.0
    current_gdp = gdp_growth[max_step] if gdp_growth else 2.5
    current_spread = credit_spread[max_step] if credit_spread else 200
    
    # Calculate derived indicators
    # M: Market sentiment (-2 to 2 scale)
    market_sentiment = (current_gdp - 1.0) / 3.0  # GDP growth to sentiment
    market_sentiment = max(-2.0, min(2.0, market_sentiment))
    
    # R: Risk level (0 to 3 scale)
    risk_level = current_spread / 300.0  # Spread to risk conversion
    risk_level = max(0.0, min(3.0, risk_level))
    
    # Base sector multiples (example values)
    base_sector_multiples = {
        'technology': 8.5 + market_sentiment * 0.5,
        'healthcare': 7.0 + market_sentiment * 0.3,
        'industrials': 6.5 + market_sentiment * 0.4,
        'consumer': 7.5 + market_sentiment * 0.3,
        'financial': 5.5 + market_sentiment * 0.6,
        'energy': 6.0 + market_sentiment * 0.7,
        'materials': 5.8 + market_sentiment * 0.5,
        'real_estate': 6.2 + market_sentiment * 0.4,
        'utilities': 5.0 + market_sentiment * 0.2
    }
    
    return {
        'M': market_sentiment,
        'R': risk_level,
        'fed_funds_rate': current_fed_rate,
        'gdp_growth': current_gdp,
        'credit_spread': current_spread,
        'baseSectorMultiple': base_sector_multiples
    }