import React from "react";

export default function HeroSection() {
  return (
    <section className="hero-bg">
      <div className="hero-content">
        <h1>Werken in de zorg in West‑Brabant</h1>
        <p>Vind snel vacatures in thuiszorg, VVT en meer</p>
        <form className="search-form-large">
          <input type="text" placeholder="Functie of diploma (bijv. Thuisbegeleider, VIG)" />
          <input type="text" placeholder="Plaats/Regio (Breda, Roosendaal)" />
          <button type="submit">Zoek</button>
        </form>
      </div>
    </section>
  );
}
