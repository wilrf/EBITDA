import { create } from 'zustand'
import type { GameState, Mode } from '../engine/types'
import { GameEngine, type EngineConfig } from '../engine/state'

interface GameStore {
  engine?: GameEngine
  state?: GameState
  start: (cfg: EngineConfig) => void
  nextDay: () => void
  weeklyReport?: () => ReturnType<GameEngine['weeklyReport']>
  startAuction: (i: number) => any
  priceDebtPreview: (lev: number, covLite: boolean) => any
}

export const useGame = create<GameStore>((set, get) => ({
  start: (cfg) => {
    const engine = new GameEngine(cfg)
    set({ engine, state: engine.state, weeklyReport: engine.weeklyReport.bind(engine), priceDebtPreview: engine.priceDebtPreview.bind(engine) })
  },
  nextDay: () => {
    const { engine } = get()
    if (!engine) return
    engine.tickDay()
    set({ state: engine.state })
  },
  startAuction: (i: number) => {
    const { engine } = get()
    if (!engine) return
    const res = engine.startAuctionForPipeline(i)
    set({ state: engine.state })
    return res
  },
}))
