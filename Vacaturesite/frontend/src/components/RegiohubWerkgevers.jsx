import React from "react";

export default function RegiohubWerkgevers() {
  return (
    <section className="regiohub-werkgevers">
      <h2>Topwerkgevers in de regio</h2>
      <div className="werkgevers-list">
        <div className="werkgever-card">
          <img src="/zorggroepwest-logo.png" alt="Zorggroep West" />
          <div>
            <strong>Zorggroep West</strong>
            <p>“Werk dicht bij huis” – 8 vacatures</p>
            <button>Bekijk profiel</button>
          </div>
        </div>
        <div className="werkgever-card">
          <img src="/thuiszorgbrabant-logo.png" alt="Thuiszorg Brabant" />
          <div>
            <strong>Thuiszorg Brabant</strong>
            <p>“Samen sterk in de wijk” – 5 vacatures</p>
            <button>Bekijk profiel</button>
          </div>
        </div>
      </div>
      <div className="werkgevers-callout">Werk dicht bij huis – reistijdindicaties per locatie.</div>
    </section>
  );
}
