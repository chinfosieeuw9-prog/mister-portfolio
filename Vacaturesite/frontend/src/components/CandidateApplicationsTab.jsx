import React from "react";

const APPLICATIONS = [
  {
    id: 1,
    title: "Verpleegkundige",
    employer: "Zorggroep West",
    date: "2025-11-01",
    status: "In beoordeling",
    next: "Interview plannen",
  },
  {
    id: 2,
    title: "Begeleider",
    employer: "Thuiszorg Brabant",
    date: "2025-10-20",
    status: "Interview gepland",
    next: "Meeloopdienst",
  },
];

export default function CandidateApplicationsTab() {
  return (
    <div className="candidate-applications-tab">
      <h2>Sollicitaties</h2>
      <ul>
        {APPLICATIONS.map((app) => (
          <li key={app.id}>
            <strong>{app.title}</strong> bij {app.employer} – {app.date}<br />
            Status: {app.status} | Volgende stap: {app.next}
            <div>
              <button>Bericht sturen</button>
              <button>Terugtrekken</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="status-hint">Zie je volgende stap en bereid je gesprek voor; wij sturen je een reminder.</div>
    </div>
  );
}
