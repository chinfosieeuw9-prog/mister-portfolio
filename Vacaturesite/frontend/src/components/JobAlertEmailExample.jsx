import React from "react";

export default function JobAlertEmailExample() {
  return (
    <div className="job-alert-email-example">
      <h2>E‑mailvoorbeeld</h2>
      <div className="email-header">Onderwerp: 3 nieuwe zorgvacatures in West‑Brabant voor Thuisbegeleider (weekoverzicht)</div>
      <div className="email-body">
        <ul>
          <li>
            <strong>Thuisbegeleider</strong> bij Zorggroep West, Breda<br />
            24–32 uur, CAO VVT, <span className="label">BIG</span> <span className="label">VOG</span><br />
            <a href="#">Bekijk en solliciteer</a>
          </li>
          <li>
            <strong>VIG</strong> bij Thuiszorg Brabant, Roosendaal<br />
            16–24 uur, CAO VVT, <span className="label">VOG</span><br />
            <a href="#">Bekijk en solliciteer</a>
          </li>
        </ul>
        <div className="email-footer">
          Je ontvangt deze mail omdat je een job alert hebt ingesteld voor Thuisbegeleider in West‑Brabant.<br />
          <a href="#">Beheer je alert</a> | <a href="#">Afmelden</a>
        </div>
      </div>
    </div>
  );
}
