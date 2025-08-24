"""Data models for EBITDA game engine."""
from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional, Literal
from enum import Enum


# Type aliases
Mode = Literal['easy', 'medium', 'hard']
Rarity = Literal['common', 'uncommon', 'rare', 'legendary']


@dataclass
class DifficultyGates:
    """Feature gates controlled by difficulty level."""
    enable_mezz: bool = False
    enable_2L: bool = False
    enable_covlite: bool = False
    enable_hedging: bool = False
    enable_antitrust: bool = False
    enable_hostile: bool = False
    enable_greenmail: bool = False
    enable_club_deals: bool = False
    enable_pacman: bool = False
    enable_continuation: bool = False
    enable_cyber: bool = False
    enable_labor: bool = False


@dataclass
class DifficultyMultipliers:
    """Multipliers that scale with difficulty."""
    macro_vol: float = 1.0
    rivals_count: int = 3
    snipe_odds: float = 0.1
    spread_adders_bps: int = 100
    leverage_cap: float = 5.0
    covenant_headroom_pct: float = 10.0
    info_noise: float = 0.1
    crisis_timer_scale: float = 1.0
    trust_decay_scale: float = 1.0
    score_mult: float = 1.0


@dataclass
class DifficultyPack:
    """Complete difficulty configuration."""
    id: str
    version: str
    gates: DifficultyGates
    multipliers: DifficultyMultipliers


@dataclass
class Scenario:
    """Macro economic scenario configuration."""
    scenario_id: str
    start_date: str
    frequency: Literal['weekly', 'monthly', 'quarterly']
    duration_steps: int
    dates: Optional[List[str]] = None
    series: Dict[str, Any] = field(default_factory=dict)


@dataclass
class MacroManifest:
    """Collection of macro scenarios."""
    version: str
    scenarios: List[Scenario]


@dataclass
class EconomyCoeffs:
    """Economic coefficients mapping."""
    version: str
    macro_to_game: Dict[str, Any] = field(default_factory=dict)
    pricing: Dict[str, Any] = field(default_factory=dict)
    defaults: Dict[str, Any] = field(default_factory=dict)


@dataclass
class SnipeOdds:
    """Rival sniping probability configuration."""
    base: float
    hot_sector_bonus: float


@dataclass
class RivalArchetype:
    """AI rival behavior configuration."""
    id: str
    snipe_odds: SnipeOdds
    hostile_pref: float
    leak_rate: float
    discipline: float
    legal_aggressiveness: float


@dataclass
class FlexBands:
    """Lender flexibility bands."""
    base: float = 0.0
    reputation_adj: float = 0.0
    trust_adj: float = 0.0


@dataclass
class CovDefaults:
    """Default covenant levels."""
    Lmax: float
    Imin: float


@dataclass
class LenderPolicy:
    """Lender behavior and pricing policy."""
    version: str
    trust_memory: Dict[str, Any] = field(default_factory=dict)
    flex_bands: Dict[str, FlexBands] = field(default_factory=dict)
    amend_fee_schedule: Dict[str, Any] = field(default_factory=dict)
    cov_defaults: CovDefaults = field(default_factory=lambda: CovDefaults(Lmax=5.0, Imin=1.25))


@dataclass
class LPPersona:
    """Limited Partner investor persona."""
    id: str
    patience: float
    fee_sensitivity: float
    esg_strictness: float
    side_letters: Dict[str, Any] = field(default_factory=dict)


@dataclass
class EventChoice:
    """Player choice in an event card."""
    id: str
    label: str
    reqs: Optional[Dict[str, Any]] = None
    effects: Optional[Dict[str, Any]] = None
    spawn_event: Optional[str] = None


@dataclass
class EventCard:
    """Event card configuration."""
    id: str
    rarity: Rarity
    trigger: Dict[str, Any]
    timer_days: int
    text: str
    choices: List[EventChoice]
    touches: Optional[List[str]] = None


@dataclass
class EventDeck:
    """Collection of event cards."""
    version: str
    events: List[EventCard]


@dataclass
class Covenants:
    """Deal covenant levels."""
    Lmax: float  # Maximum leverage ratio
    Imin: float  # Minimum interest coverage ratio


@dataclass
class DealMetrics:
    """Deal financial metrics."""
    ebitda: float
    revenue: float


@dataclass
class DealMeters:
    """Deal risk/performance meters."""
    fragility: float
    execution: float
    momentum: float


@dataclass
class Deal:
    """Investment deal representation."""
    id: str
    name: str
    sector: str
    base_multiple: float
    entry_multiple: float
    leverage: float
    covenants: Covenants
    public: bool
    metrics: DealMetrics
    meters: DealMeters


@dataclass
class Fund:
    """Private equity fund representation."""
    id: str
    vintage: int
    size: float
    cash: float
    undrawn: float
    dpi: float  # Distributions to Paid-in capital
    rvpi: float  # Residual Value to Paid-in capital
    tvpi: float  # Total Value to Paid-in capital
    net_irr: float


@dataclass
class Firm:
    """PE firm capabilities and reputation."""
    reputation: float
    lender_trust: float
    lp_trust: float
    audit_comfort: float
    board_gov: float
    ops_capacity: float
    culture: float


@dataclass
class ActiveEvent:
    """Currently active event in game."""
    id: str
    card: EventCard
    ends_on_day: int
    deal_id: Optional[str] = None


@dataclass
class GameState:
    """Complete game state representation."""
    mode: Mode
    day: int
    week: int
    quarter: int
    seed: int
    firm: Firm
    fund: Fund
    deals: List[Deal]
    active_events: List[ActiveEvent]
    pipeline: List[Deal]
    kpis: Dict[str, float] = field(default_factory=dict)