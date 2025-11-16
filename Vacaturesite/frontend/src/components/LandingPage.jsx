
import React, { useState } from "react";
import "../App.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const categories = [
  { name: "Verpleegkundige", color: "#00bfae" },
  { name: "Artsen", color: "#3e7cb1" },
  { name: "Zorgassistent", color: "#f9b233" },
  { name: "Paramedici", color: "#e94f37" },
  { name: "Management", color: "#6c63ff" },
  { name: "Overig", color: "#bdbdbd" },
];



export default function LandingPage() {
  const [keywords, setKeywords] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [aiResults, setAiResults] = useState(null);

  function handleSearch(e) {
    e.preventDefault();
    setAiResults(null); // zoekactie wist AI-resultaat
    // TODO: zoekactie uitvoeren
  }

  function handleAISearch() {
    // Simuleer AI-resultaten op basis van input
    const kw = keywords.trim() || "Verpleegkundige";
    const reg = region || "Breda";
    const cat = category || "Verpleegkundige";
    const results = [
      {
        title: `AI Match: ${kw} in ${reg}`,
        company: reg === "Rotterdam" ? "Paramedisch Centrum Rijnmond" : "Zorg aan Huis West-Brabant",
        location: reg,
        hours: reg === "Rotterdam" ? "20-36u" : "24-32u",
        salary: cat === "Paramedici" ? "€2.900–€3.800 CAO Ziekenhuizen" : "€2.700–€3.400 CAO VVT",
        mustHave: cat === "Artsen" ? "BIG vereist" : "Geen BIG vereist",
        link: "#"
      },
      {
        title: `AI Match: ${cat} in ${reg === "Breda" ? "Rotterdam" : "Breda"}`,
        company: reg === "Breda" ? "Paramedisch Centrum Rijnmond" : "Zorg aan Huis West-Brabant",
        location: reg === "Breda" ? "Rotterdam" : "Breda",
        hours: "20-36u",
        salary: "€2.900–€3.800 CAO Ziekenhuizen",
        mustHave: "BIG vereist",
        link: "#"
      }
    ];
    setAiResults(results);
  }

  return (
    <div className="landing-bg">
      {/* DEBUG BANNER */}
      {(() => {
        const debugMsg = `DEBUG: AI-PATCH ${new Date().toLocaleString()} - CLEAR CACHE IF YOU SEE THIS!`;
        console.log('%c' + debugMsg, 'background: #ff0055; color: #fff; font-size: 18px; font-weight: bold; padding: 8px; border-radius: 8px;');
        return (
          <div style={{
            position: 'fixed',
            top: 12,
            right: 16,
            background: '#ff0055',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: 12,
            fontWeight: 900,
            fontSize: 18,
            zIndex: 9999,
            boxShadow: '0 4px 16px #0005',
            letterSpacing: 2,
            border: '3px solid #fff',
            textShadow: '1px 1px 6px #000a',
            transform: 'rotate(2deg)'
          }}>
            DEBUG: AI-PATCH {new Date().toLocaleString()}<br />CLEAR CACHE IF YOU SEE THIS!
          </div>
        );
      })()}
      <Navbar />
      <header className="hero hero-bg">
        <div className="hero-content">
          <h1>Vind jouw droombaan in de zorg</h1>
          <p>AI-gedreven vacaturesite voor zorgprofessionals</p>
          <form className="search-form search-form-large" style={{
            display: 'flex',
            gap: 0,
            alignItems: 'center',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 16px #0001',
            padding: 6,
            maxWidth: 700,
            margin: '0 auto',
            border: '2px solid #e6e6e6',
            position: 'relative',
            zIndex: 2
          }} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Keywords"
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              style={{
                flex: 2,
                minWidth: 120,
                padding: '14px 16px',
                border: 'none',
                borderRadius: 8,
                fontSize: 17,
                background: '#f7fafc',
                marginRight: 4
              }}
            />
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              style={{
                flex: 1,
                minWidth: 120,
                fontWeight: 700,
                border: 'none',
                borderRadius: 8,
                padding: '14px 16px',
                fontSize: 17,
                background: '#f7fafc',
                marginRight: 4
              }}
            >
              <option value="">Alle regio's</option>
              <option>Breda</option>
              <option>Rotterdam</option>
              <option>Amsterdam</option>
            </select>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{
                flex: 1,
                minWidth: 120,
                fontWeight: 700,
                border: 'none',
                borderRadius: 8,
                padding: '14px 16px',
                fontSize: 17,
                background: '#f7fafc',
                marginRight: 4
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.name}>{cat.name}</option>
              ))}
            </select>
            <button
              type="submit"
              style={{
                background: '#ff3576',
                color: '#fff',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: 8,
                padding: '14px 32px',
                fontSize: 18,
                marginLeft: 4,
                marginRight: 4,
                boxShadow: '0 2px 8px #ff357633',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleAISearch}
              style={{
                background: '#14213d',
                color: '#fff',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: 8,
                padding: '14px 32px',
                fontSize: 18,
                marginLeft: 0,
                boxShadow: '0 2px 8px #14213d33',
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: '#fff',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              AI
            </button>
          </form>
          {aiResults && (
            <div style={{
              marginTop: 24,
              background: '#f7fafc',
              borderRadius: 10,
              boxShadow: '0 2px 8px #0001',
              padding: 24,
              maxWidth: 700,
              marginLeft: 'auto',
              marginRight: 'auto',
              zIndex: 1
            }}>
              <h3 style={{marginTop:0, marginBottom:16, color:'#14213d'}}>AI Suggesties</h3>
              {aiResults.map((job, i) => (
                <div key={i} style={{
                  background: '#fff',
                  borderRadius: 8,
                  padding: 18,
                  marginBottom: 16,
                  boxShadow: '0 1px 4px #0001',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}>
                  <div style={{fontWeight:700, fontSize:18}}>{job.title}</div>
                  <div style={{color:'#555'}}>{job.company} – {job.location} | {job.hours}</div>
                  <div style={{color:'#888', fontSize:15}}>{job.salary} | {job.mustHave}</div>
                  <a href={job.link} style={{marginTop:8, alignSelf:'flex-start', background:'#14213d', color:'#fff', borderRadius:6, padding:'7px 18px', textDecoration:'none', fontWeight:500}}>Bekijk vacature</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
      <section className="categories">
        <h2>Populaire categorieën</h2>
        <div className="category-list">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="category-card"
              style={{ background: cat.color }}
            >
              {cat.name}
            </div>
          ))}
        </div>
      </section>
      {/* Footer verwijderd, HomePage regelt nu de juiste footer */}
    </div>
  );
}
