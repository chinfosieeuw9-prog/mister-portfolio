import React from "react";

export default function RegiohubVacaturekaart() {
  return (
    <section className="regiohub-vacaturekaart">
      <h2>Vacatures op de kaart</h2>
      <div className="vacaturekaart-map">[Kaart met pins, toggle lijst/kaart]</div>
      <div className="vacaturekaart-filters">
        <label>Functie</label>
        <input placeholder="Alle functies" />
        <label>Doelgroep</label>
        <input placeholder="Alle doelgroepen" />
        <label>BIG vereist</label>
        <input type="checkbox" />
        <label>Uren</label>
        <input placeholder="Bijv. 24-32" />
        <label>Diensten</label>
        <input placeholder="Dag/Avond/Nacht" />
        <label>Salaris</label>
        <input placeholder="Minimaal salaris" />
        <label>Afstand</label>
        <input placeholder="Binnen 15 km van Breda" />
      </div>
      <div className="vacaturekaart-microcopy">Toon vacatures binnen 15 km van Breda.</div>
    </section>
  );
}
