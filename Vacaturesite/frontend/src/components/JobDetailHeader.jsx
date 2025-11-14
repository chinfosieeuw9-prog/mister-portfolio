import React from "react";

export default function JobDetailHeader() {
  return (
    <header className="job-detail-header">
      <h1>Thuisbegeleider – West‑Brabant (24–32 u)</h1>
      <div className="job-detail-meta">
        <span>Zorg aan Huis West-Brabant</span> | <span>Breda</span> | <span>24–32 u</span> | <span>CAO VVT</span> | <span>Dag/Avond</span>
      </div>
      <div className="job-detail-labels">
        <span className="job-label">BIG vereist</span>
        <span className="job-label">Direct starten</span>
      </div>
      <div className="job-detail-actions">
        <button className="btn-primary">1‑klik solliciteren</button>
        <button className="btn-secondary">Bewaar</button>
        <button className="btn-secondary">Deel</button>
      </div>
      <div className="job-detail-micro">
        <span>Gepubliceerd: 14 nov 2025</span> | <span>Ref.nr: 2025-001</span>
      </div>
    </header>
  );
}
