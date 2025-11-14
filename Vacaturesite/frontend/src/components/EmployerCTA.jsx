import React from "react";

export default function EmployerCTA() {
  return (
    <section className="employer-cta">
      <button className="btn-primary">Solliciteer open</button>
      <button className="btn-secondary">Maak alert voor deze werkgever</button>
      <div className="compliance-info">
        <p>CAO VVT van toepassing. VOG en BIG-vereisten gelden voor bepaalde functies. Begeleiding bij aanvragen beschikbaar.</p>
        <a href="/privacy">Privacy & sollicitatieproces</a>
      </div>
    </section>
  );
}
