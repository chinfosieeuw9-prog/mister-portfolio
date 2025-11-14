import React from "react";

const GEMEENTEN = [
  "Breda",
  "Roosendaal",
  "Bergen op Zoom",
  "Etten-Leur",
  "Oosterhout",
  "Halderberge",
  "Moerdijk",
  "Steenbergen",
  "Woensdrecht",
  "Zundert",
];

export default function RegiohubGemeenten() {
  return (
    <section className="regiohub-gemeenten">
      <h2>Gemeenten en plaatsen</h2>
      <div className="gemeenten-grid">
        {GEMEENTEN.map((g) => (
          <div key={g} className="gemeente-tile">
            <strong>{g}</strong>
            <p>Korte intro over zorg in {g}.</p>
            <button>Bekijk vacatures</button>
          </div>
        ))}
      </div>
    </section>
  );
}
