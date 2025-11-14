import React from "react";

const employers = [
  {
    name: "Zorg aan Huis West-Brabant",
    logo: "https://via.placeholder.com/60x60?text=Logo",
    pitch: "Zelfstandigheid thuis vergroten, met aandacht en duidelijke afspraken.",
    jobs: 8,
    locations: ["Breda", "Roosendaal"],
  },
  // ...meer werkgevers
];

export default function FeaturedEmployers() {
  return (
    <section className="featured-employers">
      <h2>Uitgelichte werkgevers</h2>
      <div className="employer-list">
        {employers.map((emp, idx) => (
          <div key={idx} className="employer-card">
            <img src={emp.logo} alt={emp.name + " logo"} />
            <div className="employer-info">
              <div className="employer-name">{emp.name}</div>
              <div className="employer-pitch">{emp.pitch}</div>
              <div className="employer-meta">{emp.jobs} vacatures | {emp.locations.join(", ")}</div>
              <button className="btn-secondary">Bekijk werkgeversprofiel</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
