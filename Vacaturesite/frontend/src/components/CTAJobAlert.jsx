import React from "react";

export default function CTAJobAlert() {
  return (
    <section className="cta-job-alert">
      <h3>Mis geen nieuwe zorgvacatures in jouw regio</h3>
      <form className="job-alert-form">
        <input type="text" placeholder="Functie(s)" />
        <input type="text" placeholder="Regio" />
        <select>
          <option>Frequentie</option>
          <option>Dagelijks</option>
          <option>Wekelijks</option>
        </select>
        <input type="email" placeholder="E‑mail" />
        <button className="btn-primary">Maak alert voor West‑Brabant</button>
      </form>
    </section>
  );
}
