

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import userProfile from "../data/userProfile";

export default function JobSearchBar({ defaultFilters = {} }) {
  const [functie, setFunctie] = useState(defaultFilters.functie || "");
  const [locatie, setLocatie] = useState(defaultFilters.locatie || "");
  const [categorie, setCategorie] = useState(defaultFilters.categorie || "");
  const [functieSuggesties, setFunctieSuggesties] = useState([]);
  const [locatieSuggesties, setLocatieSuggesties] = useState([]);
  const [showFunctieSug, setShowFunctieSug] = useState(false);
  const [showLocatieSug, setShowLocatieSug] = useState(false);
  const functieInputRef = useRef();
  const locatieInputRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  // Sync state met URL (bijv. als je terug navigeert)
  useEffect(() => {
    setFunctie(defaultFilters.functie || "");
    setLocatie(defaultFilters.locatie || "");
    setCategorie(defaultFilters.categorie || "");
  }, [defaultFilters.functie, defaultFilters.locatie, defaultFilters.categorie]);

  // Suggestielijsten (dummydata + profielvoorkeuren)
  const alleFuncties = [
    "Verpleegkundige",
    "Thuisbegeleider",
    "Verzorgende IG",
    "Arts",
    "Zorgassistent",
    "Paramedicus",
    "Teamleider",
    "Helpende",
    ...userProfile.diploma,
    ...userProfile.categorieVoorkeur,
  ];
  const alleLocaties = [
    "Breda",
    "Roosendaal",
    "Bergen op Zoom",
    "Etten-Leur",
    "Oudenbosch",
    userProfile.locatie,
  ];

  // Slimme suggesties genereren obv input en profiel
  useEffect(() => {
    if (functie.length > 0) {
      let suggesties = alleFuncties.filter(f =>
        f.toLowerCase().includes(functie.toLowerCase())
      );
      // Profielvoorkeuren voorrang
      suggesties = [
        ...userProfile.categorieVoorkeur.filter(f => f.toLowerCase().includes(functie.toLowerCase())),
        ...suggesties.filter(f => !userProfile.categorieVoorkeur.includes(f)),
      ];
      setFunctieSuggesties([...new Set(suggesties)].slice(0, 5));
      setShowFunctieSug(true);
    } else {
      setFunctieSuggesties([]);
      setShowFunctieSug(false);
    }
  }, [functie]);

  useEffect(() => {
    if (locatie.length > 0) {
      let suggesties = alleLocaties.filter(l =>
        l.toLowerCase().includes(locatie.toLowerCase())
      );
      // Profiel-locatie voorrang
      if (userProfile.locatie.toLowerCase().includes(locatie.toLowerCase())) {
        suggesties = [userProfile.locatie, ...suggesties.filter(l => l !== userProfile.locatie)];
      }
      setLocatieSuggesties([...new Set(suggesties)].slice(0, 5));
      setShowLocatieSug(true);
    } else {
      setLocatieSuggesties([]);
      setShowLocatieSug(false);
    }
  }, [locatie]);

  // Live zoeken: update URL direct bij typen
  useEffect(() => {
    const params = [];
    if (functie) params.push(`functie=${encodeURIComponent(functie)}`);
    if (locatie) params.push(`locatie=${encodeURIComponent(locatie)}`);
    if (categorie) params.push(`categorie=${encodeURIComponent(categorie)}`);
    const qs = params.length ? `?${params.join("&")}` : "";
    if (location.search !== qs) {
      navigate({ pathname: location.pathname, search: qs }, { replace: true });
    }
    // eslint-disable-next-line
  }, [functie, locatie, categorie]);

  return (
    <form className="job-search-bar" onSubmit={e => e.preventDefault()} autoComplete="off">
      <div style={{position: "relative"}}>
        <input
          type="text"
          placeholder="Functie of diploma (bijv. Thuisbegeleider, VIG)"
          value={functie}
          ref={functieInputRef}
          onChange={e => setFunctie(e.target.value)}
          onFocus={() => functieSuggesties.length > 0 && setShowFunctieSug(true)}
          onBlur={() => setTimeout(() => setShowFunctieSug(false), 150)}
        />
        {showFunctieSug && functieSuggesties.length > 0 && (
          <ul className="suggestie-dropdown">
            {functieSuggesties.map((s, i) => (
              <li key={i} onMouseDown={() => { setFunctie(s); setShowFunctieSug(false); }}>{s}</li>
            ))}
          </ul>
        )}
      </div>
      <div style={{position: "relative"}}>
        <input
          type="text"
          placeholder="Plaats/Regio (Breda, Roosendaal, Bergen op Zoom)"
          value={locatie}
          ref={locatieInputRef}
          onChange={e => setLocatie(e.target.value)}
          onFocus={() => locatieSuggesties.length > 0 && setShowLocatieSug(true)}
          onBlur={() => setTimeout(() => setShowLocatieSug(false), 150)}
        />
        {showLocatieSug && locatieSuggesties.length > 0 && (
          <ul className="suggestie-dropdown">
            {locatieSuggesties.map((s, i) => (
              <li key={i} onMouseDown={() => { setLocatie(s); setShowLocatieSug(false); }}>{s}</li>
            ))}
          </ul>
        )}
      </div>
      <select value={categorie} onChange={e => setCategorie(e.target.value)}>
        <option value="">Alle categorieën</option>
        <option value="Verpleegkundige">Verpleegkundige</option>
        <option value="Artsen">Artsen</option>
        <option value="Zorgassistent">Zorgassistent</option>
        <option value="Paramedici">Paramedici</option>
        <option value="Management">Management</option>
        <option value="Overig">Overig</option>
      </select>
      <a href="#" className="search-advanced">Uitgebreid zoeken</a>
    </form>
  );
}
