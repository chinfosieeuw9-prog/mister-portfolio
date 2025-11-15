import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAISuggestie } from "../utils/aiSuggestie";
// SVG icon for sparkle
const SparkleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight:'8px',verticalAlign:'middle'}}>
    <g filter="url(#glow)">
      <path d="M11 2.5L12.09 7.09C12.23 7.67 12.73 8.07 13.33 8.07H18.09L14.09 10.91C13.61 11.25 13.41 11.89 13.65 12.44L15.09 15.91L11 13.09C10.52 12.75 9.78 12.75 9.3 13.09L5.21 15.91L6.65 12.44C6.89 11.89 6.69 11.25 6.21 10.91L2.21 8.07H6.97C7.57 8.07 8.07 7.67 8.21 7.09L9.3 2.5H11Z" fill="#fff"/>
    </g>
    <defs>
      <filter id="glow" x="0" y="0" width="22" height="22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#a084ff"/>
      </filter>
    </defs>
  </svg>
);

function HeroSection() {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const categories = [
    "Verpleging",
    "Verzorging",
    "Paramedisch",
    "Medisch",
    "Overig"
  ];
  const regions = [
    "Alle regio's",
    "Breda",
    "Roosendaal",
    "Bergen op Zoom",
    "Etten-Leur",
    "Oudenbosch"
  ];

  function handleSubmit(e) {
    e.preventDefault();
    const params = [];
    if (keywords) params.push(`functie=${encodeURIComponent(keywords)}`);
    if (region && region !== "Alle regio's") params.push(`locatie=${encodeURIComponent(region)}`);
    if (category && category !== "Alle categorieën") params.push(`categorie=${encodeURIComponent(category)}`);
    navigate(`/vacatures${params.length ? "?" + params.join("&") : ""}`);
  }

  const aiSuggestie = getAISuggestie();

  function handleAISuggestie(e) {
    e.preventDefault();
    setKeywords(aiSuggestie.split(" in ")[0] || "");
    setRegion(aiSuggestie.split(" in ")[1] || "");
    setCategory(aiSuggestie.split(" in ")[2] || "");
    const params = [];
    if (aiSuggestie.split(" in ")[0]) params.push(`functie=${encodeURIComponent(aiSuggestie.split(" in ")[0])}`);
    if (aiSuggestie.split(" in ")[1]) params.push(`locatie=${encodeURIComponent(aiSuggestie.split(" in ")[1])}`);
    if (aiSuggestie.split(" in ")[2]) params.push(`categorie=${encodeURIComponent(aiSuggestie.split(" in ")[2])}`);
    navigate(`/vacatures${params.length ? "?" + params.join("&") : ""}`);
  }

  return (
    <section className="hero-bg">
      <div className="hero-content">
        <h1>Vind jouw droombaan in de zorg</h1>
        <p>AI-gedreven vacaturesite voor zorgprofessionals</p>
        <form style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#fff', borderRadius: '0.7rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '2px solid #cfd2da', padding: '0.4rem 0.8rem', maxWidth: '1100px', margin: '0 auto' }} onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            placeholder="Keywords"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            style={{ flex: 1, minWidth: 80, maxWidth: 180, border: 'none', outline: 'none', fontSize: '1.1rem', padding: '0.6rem 0.8rem', borderRadius: '0.4rem', background: '#f7f7fa' }}
          />
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            style={{ minWidth: 120, fontWeight: 600, borderRadius: '0.4rem', border: 'none', background: '#f7f7fa', fontSize: '1.1rem', padding: '0.6rem 0.8rem' }}
          >
            {regions.map((r, i) => (
              <option key={i} value={r === "Alle regio's" ? "" : r}>{r}</option>
            ))}
          </select>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{ minWidth: 120, fontWeight: 600, borderRadius: '0.4rem', border: 'none', background: '#f7f7fa', fontSize: '1.1rem', padding: '0.6rem 0.8rem' }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button type="submit" style={{ background: '#ff3576', color: '#fff', fontWeight: 'bold', border: 'none', borderRadius: '0.4rem', padding: '0.6rem 1.2rem', fontSize: '1.1rem', cursor: 'pointer', marginLeft: 4 }}>Search</button>
          <button
            style={{
              background: '#0a2342',
              color: '#7ee6fd',
              borderRadius: '0.4rem',
              marginLeft: 4,
              boxShadow: '0 0 8px 1px #7ee6fd, 0 2px 12px 0 #0a2342',
              padding: '0.6rem 2rem',
              fontSize: '1.1rem',
              border: 'none',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontFamily: 'inherit',
              minWidth: 110,
              minHeight: 0,
              width: 'auto',
            }}
            onClick={handleAISuggestie}
            type="button"
          >
            AI
          </button>
        </form>
        <div className="ai-suggestie-news" style={{textAlign:'center',marginTop:'1rem',fontWeight:500}}>
          <span style={{color:'#2d9cdb'}}>AI Suggestie:</span> <span>{aiSuggestie}</span>
        </div>
      </div>
    </section>

  );
}

export default HeroSection;
