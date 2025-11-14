import React from "react";

export default function EmployerHero() {
  return (
    <section className="employer-hero">
      <img src="/logo.png" alt="Logo werkgever" className="employer-logo" />
      <div className="hero-content">
        <h1>Thuis in West‑Brabant: warme zorg nabij, met oog voor zelfstandigheid en ontwikkeling.</h1>
        <p>Korte pitch over de organisatie. <em>Voorbeeld: "Wij vergroten zelfstandigheid thuis, met aandacht, duidelijke afspraken en ruimte voor groei."</em></p>
        <div className="hero-cta">
          <button className="btn-primary">Bekijk vacatures</button>
          <button className="btn-secondary">Volg werkgever</button>
        </div>
      </div>
      <img src="/hero-zorg.jpg" alt="Hero beeld of video" className="hero-image" />
    </section>
  );
}
