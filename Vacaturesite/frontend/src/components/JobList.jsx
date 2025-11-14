import React from "react";

const jobs = [
  {
    title: "Thuisbegeleider – Breda",
    employer: "Zorg aan Huis West-Brabant",
    location: "Breda",
    hours: "24–32 u",
    salary: "€2.700–€3.400",
    cao: "CAO VVT",
    label: "BIG vereist",
    date: "13 nov",
    summary: "Je ondersteunt cliënten thuis met structuur, ADL en zelfstandigheid.",
  },
  // ...meer vacatures
];

export default function JobList() {
  if (jobs.length === 0) {
    return (
      <div className="job-list-empty">
        Geen resultaten voor deze filters. Verwijder 1 of meer filters of breid je regio uit.
      </div>
    );
  }
  return (
    <div className="job-list">
      {jobs.map((job, idx) => (
        <div key={idx} className="job-card">
          <div className="job-title">{job.title} <span className="job-label">{job.label}</span></div>
          <div className="job-meta">
            <span>{job.employer}</span> | <span>{job.location}</span> | <span>{job.hours}</span>
          </div>
          <div className="job-salary">{job.salary} <span className="job-cao">{job.cao}</span></div>
          <div className="job-summary">{job.summary}</div>
          <div className="job-date">{job.date}</div>
          <div className="job-actions">
            <button className="btn-primary">Nu solliciteren</button>
            <button className="btn-secondary">Bewaar</button>
            <button className="btn-secondary">Deel</button>
          </div>
        </div>
      ))}
      <button className="btn-secondary">Toon meer</button>
    </div>
  );
}
