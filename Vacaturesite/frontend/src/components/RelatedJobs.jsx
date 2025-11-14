import React from "react";

const related = [
  {
    title: "Verzorgende IG – Roosendaal",
    employer: "Zorg aan Huis West-Brabant",
    location: "Roosendaal",
    hours: "20–28 u",
    salary: "€2.500–€3.200",
    cao: "CAO VVT",
  },
  // ...meer gerelateerde vacatures
];

export default function RelatedJobs() {
  return (
    <section className="related-jobs">
      <h3>Gerelateerde vacatures</h3>
      <div className="related-list">
        {related.map((job, idx) => (
          <div key={idx} className="related-card">
            <div className="related-title">{job.title}</div>
            <div className="related-meta">{job.employer} | {job.location} | {job.hours}</div>
            <div className="related-salary">{job.salary} <span className="related-cao">{job.cao}</span></div>
            <button className="btn-secondary">Bekijk vacature</button>
          </div>
        ))}
      </div>
    </section>
  );
}
