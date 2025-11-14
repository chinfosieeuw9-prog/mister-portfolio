import React from "react";

const ALERTS = [
  {
    id: 1,
    functies: ["Thuisbegeleider"],
    regio: "Breda",
    doelgroep: "VVT",
    uren: "24-32",
    frequency: "wekelijks",
    active: true,
  },
];

export default function CandidateAlertsTab() {
  return (
    <div className="candidate-alerts-tab">
      <h2>Job alerts & voorkeuren</h2>
      <ul className="alerts-list">
        {ALERTS.map((alert) => (
          <li key={alert.id} className={alert.active ? "active" : "inactive"}>
            <div>
              <strong>{alert.functies.join(", ")}</strong> – {alert.regio} – {alert.doelgroep} – {alert.uren}u – {alert.frequency}
            </div>
            <div>
              <button>{alert.active ? "Pauzeren" : "Activeren"}</button>
              <button>Wijzig</button>
              <button>Verwijder</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="comm-prefs">
        <h3>Communicatievoorkeuren</h3>
        <label>
          <input type="checkbox" /> E‑mail updates
        </label>
        <label>
          <input type="checkbox" /> Sms updates
        </label>
        <label>
          <input type="checkbox" /> Privacy: sta verwerking toe voor job alerts
        </label>
      </div>
      <div className="privacy-hint">
        Je kunt je alerts en voorkeuren altijd aanpassen of verwijderen. Lees meer in onze <a href="/privacy">privacyverklaring</a>.
      </div>
    </div>
  );
}
