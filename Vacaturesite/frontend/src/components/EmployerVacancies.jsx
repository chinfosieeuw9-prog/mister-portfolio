import React from "react";

const VACANCIES = [
  {
    id: 1,
    title: "Verpleegkundige",
    location: "Breda",
    hours: "24-32",
    labels: ["BIG", "Direct starten"],
  },
  {
    id: 2,
    title: "Begeleider",
    location: "Roosendaal",
    hours: "16-24",
    labels: ["ZZP"],
  },
];

export default function EmployerVacancies() {
  return (
    <section className="employer-vacancies">
      <h2>Openstaande vacatures</h2>
      <div className="vacancy-filters">[Filters: functie, locatie, uren]</div>
      <ul>
        {VACANCIES.map((v) => (
          <li key={v.id}>
            <strong>{v.title}</strong> – {v.location} – {v.hours}u
            {v.labels.map((l) => (
              <span key={l} className="vacancy-label">{l}</span>
            ))}
            <button className="btn-primary">Bekijk vacature</button>
          </li>
        ))}
      </ul>
      <div className="vacancy-microcopy">Vind jouw plek in het team – solliciteer binnen 5 minuten.</div>
    </section>
  );
}
