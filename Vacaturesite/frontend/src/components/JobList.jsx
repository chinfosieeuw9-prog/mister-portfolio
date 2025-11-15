
import React from "react";
import userProfile from "../data/userProfile";

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
    categorie: "Verpleegkundige",
    functie: "Thuisbegeleider",
  },
  {
    title: "Verzorgende IG – Roosendaal",
    employer: "Zorg aan Huis West-Brabant",
    location: "Roosendaal",
    hours: "20–28 u",
    salary: "€2.500–€3.200",
    cao: "CAO VVT",
    label: "",
    date: "12 nov",
    summary: "Verzorgende IG in de wijk, zelfstandig en in teamverband.",
    categorie: "Zorgassistent",
    functie: "Verzorgende IG",
  },
  // ...meer vacatures
];


// Uitgebreidere matching-score functie
function matchScore(job, profile) {
  let score = 0;
  let uitleg = [];
  if (job.functie && profile.functie && job.functie.toLowerCase() === profile.functie.toLowerCase()) {
    score += 40;
    uitleg.push("Functie komt overeen");
  }
  if (job.categorie && profile.categorieVoorkeur && profile.categorieVoorkeur.includes(job.categorie)) {
    score += 20;
    uitleg.push("Categorie in jouw voorkeur");
  }
  if (job.location && profile.locatie && job.location.toLowerCase() === profile.locatie.toLowerCase()) {
    score += 15;
    uitleg.push("Locatie komt overeen");
  }
  if (profile.diploma && job.title && profile.diploma.some(d => job.title.toLowerCase().includes(d.toLowerCase()))) {
    score += 8;
    uitleg.push("Diploma matcht met vacature");
  }
  if (profile.opleidingsniveau && job.summary && job.summary.toLowerCase().includes(profile.opleidingsniveau.toLowerCase())) {
    score += 6;
    uitleg.push("Opleidingsniveau sluit aan");
  }
  if (profile.sectorVoorkeur && job.summary && profile.sectorVoorkeur.some(s => job.summary.toLowerCase().includes(s.toLowerCase()))) {
    score += 5;
    uitleg.push("Sectorvoorkeur komt voor");
  }
  if (profile.specialisaties && job.summary && profile.specialisaties.some(s => job.summary.toLowerCase().includes(s.toLowerCase()))) {
    score += 5;
    uitleg.push("Specialisatie sluit aan");
  }
  if (profile.contractVoorkeur && job.hours && profile.contractVoorkeur.some(c => job.hours.toLowerCase().includes(c.toLowerCase()))) {
    score += 4;
    uitleg.push("Contractvorm past bij voorkeur");
  }
  if (profile.talen && job.summary && profile.talen.some(t => job.summary.toLowerCase().includes(t.toLowerCase()))) {
    score += 2;
    uitleg.push("Taal komt voor in omschrijving");
  }
  if (profile.softSkills && job.summary && profile.softSkills.some(s => job.summary.toLowerCase().includes(s.toLowerCase()))) {
    score += 2;
    uitleg.push("Soft skill sluit aan");
  }
  if (profile.beschikbaarheid && job.hours && job.hours.includes(profile.beschikbaarheid.split(" ")[0])) {
    score += 2;
    uitleg.push("Uren sluiten aan bij beschikbaarheid");
  }
  if (profile.beschikbaarheidPerDag) {
    const days = Object.entries(profile.beschikbaarheidPerDag).filter(([dag, val]) => val).map(([dag]) => dag);
    if (job.summary && days.some(d => job.summary.toLowerCase().includes(d))) {
      score += 2;
      uitleg.push("Beschikbare dag komt voor");
    }
  }
  if (profile.mobiliteit && job.summary && profile.mobiliteit.some(m => job.summary.toLowerCase().includes(m.toLowerCase()))) {
    score += 2;
    uitleg.push("Mobiliteit sluit aan");
  }
  if (profile.rijbewijs && job.summary && job.summary.toLowerCase().includes("rijbewijs")) {
    score += 2;
    uitleg.push("Rijbewijs vereist en aanwezig");
  }
  if (profile.werkvorm && job.summary && profile.werkvorm.some(w => job.summary.toLowerCase().includes(w.toLowerCase()))) {
    score += 2;
    uitleg.push("Werkvorm sluit aan");
  }
  if (profile.interesses && job.summary && profile.interesses.some(i => job.summary.toLowerCase().includes(i.toLowerCase()))) {
    score += 2;
    uitleg.push("Interesse sluit aan");
  }
  return { score, uitleg };
}

export default function JobList({ filters = {} }) {
  // Filteren op zoekfilters
  let filtered = jobs;
  if (filters.functie) {
    filtered = filtered.filter(j =>
      (j.functie && j.functie.toLowerCase().includes(filters.functie.toLowerCase())) ||
      (j.title && j.title.toLowerCase().includes(filters.functie.toLowerCase()))
    );
  }
  if (filters.locatie) {
    filtered = filtered.filter(j =>
      (j.location && j.location.toLowerCase().includes(filters.locatie.toLowerCase()))
    );
  }
  if (filters.categorie) {
    filtered = filtered.filter(j =>
      (j.categorie && j.categorie.toLowerCase() === filters.categorie.toLowerCase())
    );
  }


  // Matching en sortering
  const jobsWithScore = filtered.map(j => {
    const { score, uitleg } = matchScore(j, userProfile);
    return { ...j, match: score, uitleg };
  });
  const sorted = [...jobsWithScore].sort((a, b) => b.match - a.match);
  const bestMatches = sorted.filter(j => j.match >= 40); // 40+ = sterke match
  const otherMatches = sorted.filter(j => j.match < 40);

  if (sorted.length === 0) {
    return (
      <div className="job-list-empty">
        Geen resultaten voor deze filters. Verwijder 1 of meer filters of breid je regio uit.
      </div>
    );
  }

  return (
    <div className="job-list">
      {bestMatches.length > 0 && (
        <>
          <h2 style={{marginTop:0}}>Vacatures op basis van jouw profiel</h2>
          {bestMatches.map((job, idx) => (
            <div key={"best-"+idx} className="job-card job-card-bestmatch">
              <div className="job-title">{job.title} <span className="job-label">{job.label}</span></div>
              <div className="job-meta">
                <span>{job.employer}</span> | <span>{job.location}</span> | <span>{job.hours}</span>
              </div>
              <div className="job-salary">{job.salary} <span className="job-cao">{job.cao}</span></div>
              <div className="job-summary">{job.summary}</div>
              <div className="job-date">{job.date}</div>
              <div className="job-matchscore">Match: {job.match}%</div>
              {job.uitleg && job.uitleg.length > 0 && (
                <ul className="job-match-explain">
                  {job.uitleg.map((u, i) => <li key={i}>{u}</li>)}
                </ul>
              )}
              <div className="job-actions">
                <button className="btn-primary">Nu solliciteren</button>
                <button className="btn-secondary">Bewaar</button>
                <button className="btn-secondary">Deel</button>
              </div>
            </div>
          ))}
        </>
      )}
      {otherMatches.length > 0 && (
        <>
          {bestMatches.length > 0 && <h3>Overige vacatures</h3>}
          {otherMatches.map((job, idx) => (
            <div key={"other-"+idx} className="job-card">
              <div className="job-title">{job.title} <span className="job-label">{job.label}</span></div>
              <div className="job-meta">
                <span>{job.employer}</span> | <span>{job.location}</span> | <span>{job.hours}</span>
              </div>
              <div className="job-salary">{job.salary} <span className="job-cao">{job.cao}</span></div>
              <div className="job-summary">{job.summary}</div>
              <div className="job-date">{job.date}</div>
              <div className="job-matchscore">Match: {job.match}%</div>
              {job.uitleg && job.uitleg.length > 0 && (
                <ul className="job-match-explain">
                  {job.uitleg.map((u, i) => <li key={i}>{u}</li>)}
                </ul>
              )}
              <div className="job-actions">
                <button className="btn-primary">Nu solliciteren</button>
                <button className="btn-secondary">Bewaar</button>
                <button className="btn-secondary">Deel</button>
              </div>
            </div>
          ))}
        </>
      )}
      <button className="btn-secondary">Toon meer</button>
    </div>
  );
}
