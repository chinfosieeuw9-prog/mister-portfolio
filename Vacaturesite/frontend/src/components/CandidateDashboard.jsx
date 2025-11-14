import React from "react";

export default function CandidateDashboard() {
  return (
    <div className="candidate-dashboard">
      <div className="welcome-card">
        <h2>Fijn dat je er bent.</h2>
        <p>Vul je profiel aan en vergroot je kans op een snelle match.</p>
      </div>
      <div className="next-steps">
        <h3>Je volgende stap</h3>
        <ul>
          <li>Profiel aanvullen</li>
          <li>Documenten uploaden</li>
          <li>Openstaande acties afronden</li>
        </ul>
      </div>
      <div className="kpi-teasers">
        <div>2 openstaande acties</div>
        <div>1 document verloopt binnenkort</div>
        <div>1 interview gepland</div>
      </div>
      <div className="recent-applications">
        <h3>Meest recente sollicitaties</h3>
        <ul>
          <li>Verpleegkundige bij Zorggroep West – In beoordeling</li>
          <li>Begeleider bij Thuiszorg Brabant – Interview gepland</li>
        </ul>
      </div>
    </div>
  );
}
