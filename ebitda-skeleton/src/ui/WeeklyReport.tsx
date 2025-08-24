import React from 'react'

export const WeeklyReport: React.FC<{report:any}> = ({report}) => {
  if (!report) return <div>—</div>
  return <div>
    <h3>Weekly Report — Week {report.week}</h3>
    <p>Fund Cash: ${report.fundCash?.toLocaleString?.() ?? 0}</p>
    <h4>Risks</h4>
    <ul>
      {report.risks?.map((r:any)=> <li key={r.id}>
        Deal {r.id}: {r.breach.breached ? `Breach risk (${r.breach.which})` : 'OK'}
      </li>)}
    </ul>
    <h4>Suggestions</h4>
    <ul>
      {report.suggestions?.map((s:string, i:number)=> <li key={i}>{s}</li>)}
    </ul>
  </div>
}
