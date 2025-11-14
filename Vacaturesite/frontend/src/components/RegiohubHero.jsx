import React from "react";

export default function RegiohubHero() {
  return (
    <section className="regiohub-hero">
      <h1>Zorgvacatures in West‑Brabant</h1>
      <p>Werk dichtbij huis in Breda, Roosendaal, Bergen op Zoom en omgeving.</p>
      <form className="regiohub-search">
        <input placeholder="Trefwoord (bijv. Verpleegkundige)" />
        <input placeholder="Locatie" value="West‑Brabant" readOnly />
        <button className="btn-primary">Bekijk vacatures</button>
      </form>
    </section>
  );
}
