import React from "react";
import Navbar from "../components/Navbar";

// Dummy data voor alerts
const alerts = [
  {
    id: 1,
    functies: ["Thuisbegeleider"],
    regio: "Breda",
    doelgroep: "VVT",
    uren: "24-32",
    frequency: "wekelijks",
    active: true,
  },
  {
    id: 2,
    functies: ["VIG"],
    regio: "Roosendaal",
    doelgroep: "GGZ",
    uren: "16-24",
    frequency: "dagelijks",
    active: false,
  },
];

export default function ManageAlertsPage() {
  return (
    <>
      <Navbar />
      <div className="manage-alerts-page">
        <h1>Beheer job alerts</h1>
        <ul className="alerts-list">
          {alerts.map((alert) => (
            <li key={alert.id} className={alert.active ? "active" : "inactive"}>
              <div>
                <strong>{alert.functies.join(", ")}</strong> – {alert.regio} – {alert.doelgroep} – {alert.uren}u – {alert.frequency}
              </div>
              <div>
                <button>{alert.active ? "Uitzetten" : "Aanzetten"}</button>
                <button>Wijzig</button>
                <button>Verwijder</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
