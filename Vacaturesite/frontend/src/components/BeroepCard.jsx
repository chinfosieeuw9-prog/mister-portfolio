import React from "react";
import { Link } from "react-router-dom";

export default function BeroepCard({ beroep }) {
  return (
    <div className="beroep-card">
      <h2>{beroep.titel}</h2>
      <div className="beroep-intro">{beroep.intro}</div>
      {beroep.big && <span className="label-big">BIG</span>}
      <Link to={`/beroepen/${beroep.slug}`} className="btn-primary">Bekijk beroep</Link>
    </div>
  );
}
