import React from "react";

export default function EmployerBlock() {
  return (
    <section className="employer-block">
      <img src="https://via.placeholder.com/60x60?text=Logo" alt="Zorg aan Huis West-Brabant logo" />
      <div className="employer-info">
        <div className="employer-name">Zorg aan Huis West-Brabant</div>
        <div className="employer-missie">Zelfstandigheid thuis vergroten, met aandacht en duidelijke afspraken.</div>
        <div className="employer-meta">Locaties: Breda, Roosendaal</div>
        <div className="employer-benefits">CAO VVT, leerbudget, reiskostenvergoeding</div>
        <button className="btn-secondary">Bekijk werkgeversprofiel</button>
      </div>
    </section>
  );
}
