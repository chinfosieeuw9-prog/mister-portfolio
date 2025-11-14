import React from "react";

export default function JobApplyCard() {
  return (
    <aside className="job-apply-card">
      <div className="job-apply-salary">€2.700–€3.400</div>
      <div className="job-apply-meta">24–32 u | Vast | Dag/Avond | Breda</div>
      <button className="btn-primary">1‑klik solliciteren</button>
      <div className="job-apply-prescreen">
        <label>BIG-registratie</label>
        <select><option>Ja</option><option>Nee</option></select>
        <label>Beschikbaarheid</label>
        <input type="text" placeholder="Bijv. per direct" />
        <label>Rijbewijs</label>
        <select><option>Ja</option><option>Nee</option></select>
      </div>
      <a href="#" className="job-apply-contact">Vraag stellen</a>
    </aside>
  );
}
