# EBITDA Private Equity Game - Master Architecture Document
Version 2.0 · 2025-08-24

## 🎯 Executive Summary

EBITDA is a sophisticated private equity simulation game that models the complete PE lifecycle from fundraising through exit. Built with TypeScript/React, it features deterministic simulation, comprehensive financial modeling, and institutional-grade mechanics.

**Core Statistics:**
- 24+ TypeScript modules (~15,000+ lines of production code)
- Deterministic simulation with seed-based reproducibility
- Comprehensive PE mechanics covering deal sourcing, execution, portfolio management, and exits
- Professional-grade financial modeling with LBO, returns analysis, and risk management

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Core Game Mechanics](#core-game-mechanics)
3. [Implementation Status](#implementation-status)
4. [Technical Architecture](#technical-architecture)
5. [Development Roadmap](#development-roadmap)
6. [Multi-Language Support](#multi-language-support)

## 🏗️ System Architecture

### Core Engine Components

#### 1. Deterministic Simulation Core
- **PRNG System** (`prng.ts`): Mulberry32 algorithm for reproducible randomness
- **State Management** (`state.ts`, `state-enhanced.ts`): Immutable state updates with validation
- **Game Loop**: Day → Week → Quarter progression with event processing

#### 2. Financial Modeling Engine
- **LBO Modeling** (`financial-modeling.ts`): Sources & uses, capital structure optimization
- **Returns Analysis**: IRR, MOIC, J-curve modeling
- **Portfolio Analytics**: Diversification metrics, risk assessment
- **Monte Carlo Simulation**: 1000+ iteration risk analysis

#### 3. Deal Mechanics
- **Sourcing System** (`deal-sourcing.ts`): 6 source types, relationship networks
- **Due Diligence** (`due-diligence.ts`): 8 diligence streams, QoE analysis
- **Auction Engine** (`advanced-auctions.ts`): Multi-round process, 95+ bidder database
- **Capital Structure** (`capital-stack.ts`): Senior/mezz/equity structuring

#### 4. Portfolio Management
- **Operations** (`portfolio-operations.ts`): Value creation plans, 100-day plans
- **Board Governance**: Quarterly meetings, performance tracking
- **Exit Planning**: Strategic/sponsor/IPO paths

#### 5. Market Dynamics
- **Economic Cycles** (`market-dynamics.ts`): Expansion/peak/contraction/trough
- **Sector Models**: 10+ sectors with unique characteristics
- **Competitive Landscape**: 50+ financial buyers, 30+ strategic buyers

#### 6. Risk Management
- **Portfolio Risk** (`risk-management.ts`): VaR, correlation matrices
- **Stress Testing**: Crisis scenarios, pandemic simulations
- **ESG Integration**: Environmental, social, governance scoring

## 🎮 Core Game Mechanics

### Deal Lifecycle
```
1. Sourcing → 2. Screening → 3. Diligence → 4. Bidding → 
5. Financing → 6. Closing → 7. Management → 8. Exit
```

### Fund Lifecycle
```
1. Fundraising (Y0) → 2. Investment Period (Y1-5) → 
3. Management Period (Y3-8) → 4. Harvest Period (Y5-10) → 5. Wind-down
```

### Performance Metrics
- **Fund Level**: IRR, TVPI, DPI, RVPI
- **Deal Level**: Gross/Net MOIC, IRR, value creation attribution
- **Firm Level**: Reputation, LP satisfaction, market positioning

### Victory Conditions
- **Success**: >20% net IRR, $1B+ AUM, 80%+ LP satisfaction
- **Failure**: <8% net IRR, <40% LP satisfaction, <20 reputation

## 📊 Implementation Status

### ✅ Completed Components
- Core engine architecture
- Deal sourcing & origination
- Due diligence system
- Advanced auction mechanics
- Portfolio operations framework
- Financial modeling engine
- Market dynamics simulation
- LP management system
- Risk management framework
- Master game engine integration

### 🔧 In Progress
- TypeScript compilation fixes
- UI/UX implementation
- Game balance tuning
- Performance optimization

### 📋 Planned Features
- Multiplayer competitions
- Historical scenario campaigns
- Advanced AI opponents
- Mobile version
- Educational tutorials

## 🔧 Technical Architecture

### Project Structure
```
ebitda/
├── src/
│   ├── engine/          # Core simulation modules
│   │   ├── prng.ts
│   │   ├── state.ts
│   │   ├── macro.ts
│   │   ├── auctions.ts
│   │   ├── deal-sourcing.ts
│   │   ├── due-diligence.ts
│   │   ├── portfolio-operations.ts
│   │   ├── financial-modeling.ts
│   │   ├── market-dynamics.ts
│   │   ├── lp-management.ts
│   │   ├── risk-management.ts
│   │   └── master-engine.ts
│   ├── components/      # React UI components
│   │   ├── DealCard.tsx
│   │   ├── WeeklyReport.tsx
│   │   ├── Dashboard.tsx
│   │   └── PortfolioView.tsx
│   ├── types/          # TypeScript definitions
│   │   ├── types.ts
│   │   └── types-enhanced.ts
│   └── config/         # Game configuration
│       ├── difficulty.json
│       ├── scenarios.json
│       └── events.json
├── public/
│   └── config/         # Static configuration files
└── tests/              # Test suites
```

### Technology Stack
- **Frontend**: React 18, TypeScript 5, Vite
- **State Management**: Custom immutable state system
- **Styling**: CSS Modules / Tailwind CSS
- **Testing**: Jest, React Testing Library
- **Build**: Vite, ESBuild
- **Quality**: ESLint, Prettier, Husky

### Performance Targets
- Initial load: <3 seconds
- User action response: <100ms
- Memory usage: <500MB
- 60 FPS UI animations

## 📅 Development Roadmap

### Phase 1: Foundation (Week 1) ✅
- [x] Core type system
- [x] PRNG implementation
- [x] State management
- [x] Basic game loop

### Phase 2: Deal Mechanics (Week 2) ✅
- [x] Deal sourcing
- [x] Due diligence
- [x] Auction system
- [x] Capital structure

### Phase 3: Portfolio Management (Week 3) ✅
- [x] Portfolio operations
- [x] Value creation tracking
- [x] Board governance
- [x] Exit mechanics

### Phase 4: Market & Risk (Week 4) ✅
- [x] Market dynamics
- [x] Economic cycles
- [x] Risk management
- [x] Stress testing

### Phase 5: LP & Fundraising (Week 5) ✅
- [x] LP management
- [x] Capital calls
- [x] Distribution waterfall
- [x] Fundraising cycles

### Phase 6: UI Implementation (Current)
- [ ] Dashboard design
- [ ] Deal card components
- [ ] Portfolio views
- [ ] Performance charts

### Phase 7: Testing & Balance
- [ ] Unit test coverage
- [ ] Integration testing
- [ ] Game balance tuning
- [ ] Performance optimization

### Phase 8: Launch Preparation
- [ ] Documentation
- [ ] Tutorial system
- [ ] Achievement system
- [ ] Distribution setup

## 🌍 Multi-Language Support

### Planned Implementations
1. **Python Version** (`ebitda-python/`)
   - Data analysis focus
   - API server implementation
   - Machine learning features

2. **C++ Version** (`ebitda-cpp/`)
   - High-performance engine
   - Native desktop client
   - Real-time calculations

3. **Java Version** (`ebitda-java/`)
   - Enterprise features
   - Android support
   - Microservices architecture

### Shared Infrastructure
- Common configuration format (JSON)
- Shared save file format
- Cross-language API specification
- Unified test scenarios

## 📈 Key Innovations

### 1. Realistic Market Simulation
- Dynamic economic cycles
- Sector-specific dynamics
- Competitive AI with distinct strategies

### 2. Comprehensive Financial Modeling
- Institutional-grade LBO models
- Monte Carlo risk analysis
- Detailed returns attribution

### 3. Deep Operational Mechanics
- Value creation planning
- Management team dynamics
- Board governance simulation

### 4. Educational Value
- Learn real PE concepts
- Practice deal evaluation
- Understand risk management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/WILRF/EBITDA.git
cd EBITDA/ebitda-skeleton

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Configuration
Game configuration files are located in `public/config/`:
- `difficulty.json` - Difficulty settings
- `scenarios.json` - Game scenarios
- `events.json` - Event definitions
- `economy.json` - Economic parameters

## 📝 Documentation Index

### Core Documents
- `ARCHITECTURE.md` - This document
- `README.md` - Quick start guide
- `IMPLEMENTATION_ROADMAP.md` - Development timeline

### Archived Planning Documents
- `archive/EBITDA_Complete_Implementation_Summary.md`
- `archive/EBITDA_Detailed_Enhancement_Plan.md`
- `archive/EBITDA_Implementation_Plan.md`
- `archive/EBITDA_Multi_Language_Architecture.md`

### Technical References
- `docs/API.md` - API documentation
- `docs/CONFIG.md` - Configuration guide
- `docs/MODDING.md` - Modding support

## 🤝 Contributing

Contributions are welcome! Please see `CONTRIBUTING.md` for guidelines.

## 📄 License

MIT License - See `LICENSE` file for details.

## 🙏 Acknowledgments

Built with expertise in private equity, financial modeling, and game design.

---

*Last Updated: 2025-08-24*
*Version: 2.0*
*Status: Active Development*