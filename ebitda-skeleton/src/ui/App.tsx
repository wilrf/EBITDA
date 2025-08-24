import React, { useEffect, useMemo, useState } from 'react'
import { useGame } from '../store/gameStore'
import { loadAllConfigs } from '../data/loadConfig'
import type { Mode } from '../engine/types'
import { WeeklyReport } from './WeeklyReport'
import { DealCard } from './DealCard'

export const App: React.FC = () => {
  const start = useGame(s=>s.start)
  const state = useGame(s=>s.state)
  const nextDay = useGame(s=>s.nextDay)
  const weekly = useGame(s=>s.weeklyReport)
  const startAuction = useGame(s=>s.startAuction)

  const [ready, setReady] = useState(false)
  const [mode, setMode] = useState<Mode>('medium')
  const [report, setReport] = useState<any>(null)

  useEffect(()=>{
    (async () => {
      const cfg = await loadAllConfigs()
      const scenario = cfg.macro.scenarios[0]
      start({
        mode, seed: 1337,
        scenario, economy: cfg.economy,
        difficulty: cfg.difficulty,
        decks: { takeovers: cfg.takeovers, ops: cfg.ops },
        rivals: cfg.rivals, lenderPolicy: cfg.lender, lpPersonas: cfg.lps
      })
      setReady(true)
    })()
  }, [mode])

  useEffect(()=>{
    if (!weekly) return
    setReport(weekly())
  }, [state, weekly])

  if (!ready || !state) return <div style={{padding:20}}>Loading…</div>

  return <div style={{fontFamily:'Inter, system-ui, sans-serif', padding:16}}>
    <header style={{display:'flex', gap:16, alignItems:'center'}}>
      <h1 style={{margin:0}}>EBITDA — PE Firm (Skeleton)</h1>
      <span>Mode:</span>
      <select value={mode} onChange={e=>setMode(e.target.value as Mode)}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <div style={{marginLeft:'auto', display:'flex', gap:12}}>
        <button onClick={()=>nextDay()}>Next Day ▶</button>
        <button onClick={()=>{ for(let i=0;i<7;i++) nextDay(); }}>Next Week ▶▶</button>
      </div>
    </header>

    <section style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:16}}>
      <div style={{border:'1px solid #ddd', borderRadius:8, padding:12}}>
        <h3>HQ</h3>
        <p>Day {state.day} • Week {state.week} • Quarter {state.quarter}</p>
        <p>
          Rep {state.firm.reputation.toFixed(1)} • Lender Trust {state.firm.lenderTrust.toFixed(1)} • LP Trust {state.firm.lpTrust.toFixed(1)}
        </p>
        <p>Macro: M {Number(state.kpis['M'] ?? 0).toFixed(2)} • R {Number(state.kpis['R'] ?? 0).toFixed(2)}</p>
      </div>

      <div style={{border:'1px solid #ddd', borderRadius:8, padding:12}}>
        <h3>Pipeline</h3>
        {state.pipeline.length === 0 && <p>No active pipeline. Advance time to refresh (skeleton).</p>}
        {state.pipeline.map((d, i)=>(
          <div key={d.id} style={{display:'flex', justifyContent:'space-between', border:'1px solid #eee', borderRadius:6, padding:8, marginBottom:8}}>
            <div>
              <strong>{d.name}</strong> <small>({d.sector})</small>
              <div>Base mult: {d.baseMultiple.toFixed(1)}× • Ask: {d.entryMultiple.toFixed(1)}×</div>
            </div>
            <div style={{display:'flex', gap:8}}>
              <button onClick={()=>{
                const res = startAuction(i)
                alert(JSON.stringify(res, null, 2))
              }}>Run Auction</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{border:'1px solid #ddd', borderRadius:8, padding:12}}>
        <WeeklyReport report={report}/>
      </div>

      <div style={{border:'1px solid #ddd', borderRadius:8, padding:12}}>
        <h3>Portfolio</h3>
        {state.deals.length===0 && <p>No active deals yet.</p>}
        {state.deals.map(d => <DealCard key={d.id} deal={d} />)}
      </div>
    </section>
  </div>
}
