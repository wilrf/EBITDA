# EBITDA — Private Equity Firm: The Game (Skeleton)
**Version:** 0.1 • **Date:** 2025-08-24

This is a coded skeleton of the game, using **React + TypeScript + Vite**, with a **deterministic simulation core** and UI stubs:
- Seeded PRNG, day→week→quarter loop
- Macro heat / risk stress → pricing & multiples
- Auctions (rivals), Capital Stack builder (simplified), Covenant checks (simplified)
- Event engine with **Hostile Bid** example
- **Weekly Report** surfacing KPIs + suggested actions
- Difficulty packs & scenario/config files (static)

> Core outcomes are deterministic (no AI). An optional *Aura* adviser can be added later as non-authoritative flavor.

## Quick start
```bash
npm install
npm run dev
# Visit http://localhost:5173
```

## Structure
- `src/engine/` — deterministic sim modules (macro, auctions, capital, events, etc.)
- `src/components/` — UI: WeeklyReport, DealCard, Meters
- `public/config/` — JSON configs (difficulty, scenarios, economy coefficients, events, archetypes, etc.)

## Notes
- Numbers are placeholders for prototyping. Replace configs with real data during content pass.
- The engine is designed to be replayable from a seed; keep outcome logic in `src/engine/*` modules.
