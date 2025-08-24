# EBITDA Private Equity Game - Python Implementation

A comprehensive Python implementation of the EBITDA Private Equity simulation game, featuring a complete game engine, REST API, and CLI interface.

## Features

- **Game Engine**: Complete implementation of the EBITDA game mechanics
- **REST API**: FastAPI-based web service
- **CLI Interface**: Command-line game interface
- **Deterministic PRNG**: Mulberry32 algorithm for reproducible gameplay
- **Configuration System**: JSON-based game configuration
- **Type Safety**: Full type hints with Pydantic models

## Architecture

```
ebitda-python/
├── src/
│   ├── engine/          # Core game engine
│   │   ├── models.py    # Data models and types
│   │   ├── prng.py      # Deterministic random number generator
│   │   ├── state.py     # Game state management
│   │   ├── auctions.py  # Deal auction system
│   │   ├── macro.py     # Macro economic simulation
│   │   ├── capital_stack.py  # Debt pricing and capital structure
│   │   ├── covenants.py # Covenant monitoring
│   │   ├── events.py    # Event system
│   │   └── difficulty.py # Difficulty scaling
│   ├── data/           # Data layer
│   │   ├── config_loader.py  # Configuration loading
│   │   ├── models.py    # Data models
│   │   └── validators.py # Data validation
│   ├── api/            # REST API layer
│   │   └── rest_api.py  # FastAPI endpoints
│   └── ui/             # User interfaces
│       └── cli.py       # Command-line interface
├── config/             # Configuration files
├── tests/              # Unit and integration tests
├── requirements.txt    # Python dependencies
├── setup.py           # Package setup
└── README.md          # This file
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ebitda-python
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Install in development mode**:
   ```bash
   pip install -e .
   ```

## Usage

### CLI Interface
```bash
# Start a new game
python -m src.ui.cli --mode easy --seed 12345

# Resume a game
python -m src.ui.cli --load savegame.json
```

### REST API
```bash
# Start the API server
uvicorn src.api.rest_api:app --reload

# API will be available at http://localhost:8000
# Interactive docs at http://localhost:8000/docs
```

### Python API
```python
from src.engine.state import GameEngine, EngineConfig
from src.data.config_loader import load_game_config

# Load configuration
config = load_game_config()

# Create game engine
engine_config = EngineConfig(
    mode='medium',
    seed=12345,
    **config
)
engine = GameEngine(engine_config)

# Simulate game steps
for day in range(100):
    engine.tick_day()
    if day % 7 == 0:
        report = engine.weekly_report()
        print(f"Week {engine.state.week}: {report}")
```

## Configuration

The game uses JSON configuration files in the `config/` directory:

- `difficulty.json` - Difficulty settings and multipliers
- `economy_coeffs.json` - Economic modeling coefficients
- `macro_scenarios.json` - Macro economic scenarios
- `events_ops.json` - Operational event cards
- `events_takeovers.json` - Takeover event cards
- `lender_policy.json` - Lender behavior configuration
- `lp_personas.json` - Limited Partner personas
- `rival_archetypes.json` - AI rival behavior

## Game Engine Features

### Core Systems
- **Deterministic Simulation**: Reproducible gameplay with seed-based PRNG
- **Macro Economic Engine**: Dynamic market conditions and sector multiples
- **Deal Auction System**: Competitive bidding with AI rivals
- **Capital Structure**: Dynamic debt pricing and covenant monitoring
- **Event System**: Random events affecting portfolio companies
- **Difficulty Scaling**: Configurable difficulty with feature gates

### Key Components
- **PRNG**: Mulberry32 implementation for consistent randomization
- **State Management**: Complete game state tracking and persistence
- **Macro Engine**: Economic indicator simulation and sector impact
- **Auction Engine**: Multi-party bidding simulation
- **Debt Pricing**: Spread calculation based on multiple factors
- **Covenant Monitoring**: Automated breach detection and headroom calculation

## API Endpoints

The REST API provides the following endpoints:

- `POST /api/game/new` - Start a new game
- `GET /api/game/{game_id}` - Get game state
- `POST /api/game/{game_id}/tick` - Advance game by one day
- `POST /api/game/{game_id}/auction/{deal_index}` - Start auction for pipeline deal
- `GET /api/game/{game_id}/report` - Get weekly report
- `GET /api/config/{config_type}` - Get configuration data

## Development

### Running Tests
```bash
pytest tests/
```

### Code Style
```bash
# Format code
black src/ tests/

# Type checking
mypy src/
```

### Adding New Features
1. Implement core logic in the `engine/` module
2. Add data models to `models.py`
3. Create API endpoints in `rest_api.py`
4. Add CLI commands to `cli.py`
5. Write tests for new functionality

## Extension Points

The architecture supports easy extension:

- **New Event Types**: Add to event deck configurations
- **Custom Scenarios**: Create new macro economic scenarios
- **Additional Metrics**: Extend KPI tracking in game state
- **New Difficulty Modes**: Add custom difficulty configurations
- **Integration**: Use as a library in larger applications

## Performance

- **Deterministic**: All randomization is seeded and reproducible
- **Efficient**: Optimized algorithms for large-scale simulation
- **Scalable**: Stateless API design for horizontal scaling
- **Memory Efficient**: Minimal state storage with on-demand calculations

This Python implementation provides a solid foundation for the EBITDA game that can be easily extended and integrated into larger systems.