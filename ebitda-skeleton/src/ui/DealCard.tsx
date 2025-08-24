import React, { useState } from 'react'
import type { Deal } from '../engine/types'
import { useGame } from '../store/gameStore'

const tabs = ['Thesis','Financing','Ops','Board','Events','Exit'] as const
type Tab = typeof tabs[number]

export const DealCard: React.FC<{deal: Deal}> = ({deal}) => {
  const [tab, setTab] = useState<Tab>('Thesis')
  const priceDebtPreview = useGame(s=>s.priceDebtPreview)

  return <div style={{border:'1px solid #eee', borderRadius:8, padding:8, margin:'8px 0'}}>
    <header style={{display:'flex', justifyContent:'space-between'}}>
      <strong>{deal.name}</strong>
      <span>{deal.sector} • {deal.entryMultiple.toFixed(1)}× • Lev {deal.leverage.toFixed(1)}×</span>
    </header>
    <nav style={{display:'flex', gap:8, marginTop:8}}>
      {tabs.map(t => <button key={t} onClick={()=>setTab(t)} style={{fontWeight: t===tab ? 700 : 400}}>{t}</button>)}
    </nav>
    <section style={{marginTop:8}}>
      {tab === 'Thesis' && <p>Platform thesis & KPIs go here. (skeleton)</p>}
      {tab === 'Financing' && <FinancingTab deal={deal} preview={priceDebtPreview}/>}
      {tab === 'Ops' && <p>100-day plan, bolt-ons, working capital sliders. (skeleton)</p>}
      {tab === 'Board' && <p>Board governance & key approvals. (skeleton)</p>}
      {tab === 'Events' && <p>Event chains (hostiles, TSA, labor). (skeleton)</p>}
      {tab === 'Exit' && <p>Choose Strategic/SBO/IPO; earn-outs, R&W. (skeleton)</p>}
    </section>
  </div>
}

const FinancingTab: React.FC<{deal: Deal, preview: any}> = ({deal, preview}) => {
  const [lev, setLev] = useState(deal.leverage)
  const [covlite, setCovlite] = useState(false)
  const ts = preview ? preview(lev, covlite) : undefined
  return <div>
    <div style={{display:'flex', gap:12, alignItems:'center'}}>
      <label>Leverage: <input type="range" min={2} max={7} step={0.1} value={lev} onChange={e=>setLev(parseFloat(e.target.value))}/></label>
      <span>{lev.toFixed(1)}×</span>
      <label><input type="checkbox" checked={covlite} onChange={e=>setCovlite(e.target.checked)} /> Cov-lite</label>
    </div>
    {ts && <div style={{marginTop:8}}>
      <div>Coupon ≈ {(ts.couponPct*100).toFixed(1)} bps ({(ts.couponPct).toFixed(2)}%)</div>
      <div>Spread ≈ {ts.spreadBps.toFixed(0)} bps</div>
      <div>OID ≈ {ts.feesOidPct.toFixed(2)}%</div>
    </div>}
  </div>
}
