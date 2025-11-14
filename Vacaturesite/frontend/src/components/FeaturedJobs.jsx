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
  },
  // ...meer vacatures
];

export default function FeaturedJobs() {
  return (
    <section className="featured-jobs">
      <h2>Uitgelichte vacatures</h2>
      <div className="job-list">
        {jobs.map((job, idx) => (
          <div key={idx} className="job-card">
            <div className="job-title">{job.title}</div>
            <div className="job-meta">
              <span>{job.employer}</span> | <span>{job.location}</span> | <span>{job.hours}</span>
            </div>
            <div className="job-salary">{job.salary} <span className="job-cao">{job.cao}</span></div>
            <div className="job-label">{job.label}</div>
            <div className="job-date">{job.date}</div>
            <button className="btn-primary">Nu solliciteren</button>
          </div>
        ))}
      </div>
      <button className="btn-secondary">Toon meer vacatures</button>
    </section>
  );
}
