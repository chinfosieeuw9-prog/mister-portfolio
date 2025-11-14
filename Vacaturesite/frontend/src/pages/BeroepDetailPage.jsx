import React from "react";
import { useParams, Link } from "react-router-dom";
import { beroepen } from "../data/beroepen";

export default function BeroepDetailPage() {
  const { slug } = useParams();
  const beroep = beroepen.find(b => b.slug === slug);
  if (!beroep) return <div>Beroep niet gevonden.</div>;
  return (
    <div className="beroep-detail-page">
      <h1>{beroep.titel} {beroep.big && <span className="label-big">BIG</span>}</h1>
      <div className="beroep-pitch">{beroep.intro}</div>
      <section>
        <h2>Belangrijkste taken</h2>
        <ul>
          {beroep.taken?.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      </section>
      <section>
        <h2>Werkplekken</h2>
        <ul>
          {beroep.werkplekken?.map((w, i) => <li key={i}>{w}</li>)}
        </ul>
      </section>
      <section>
        <h2>Toelatingseisen</h2>
        <ul>
          {beroep.eisen?.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </section>
      <section>
        <h2>Opleiding & doorgroei</h2>
        <ul>
          {beroep.doorgroei?.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      </section>
      <section>
        <h2>Salaris & voorwaarden</h2>
        <div>{beroep.salaris}</div>
      </section>
      <div className="beroep-cta">
        <Link to={`/vacatures?beroep=${beroep.slug}&regio=West-Brabant`} className="btn-primary">Bekijk vacatures in West‑Brabant</Link>
        <button className="btn-secondary">Maak alert voor dit beroep</button>
      </div>
    </div>
  );
}
