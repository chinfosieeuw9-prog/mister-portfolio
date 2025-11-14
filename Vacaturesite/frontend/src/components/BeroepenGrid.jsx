import React from "react";
import { beroepen } from "../data/beroepen";
import BeroepCard from "./BeroepCard";

export default function BeroepenGrid({ filters }) {
  // Filterlogica kan later uitgebreid worden
  const filtered = beroepen.filter(b =>
    (!filters.doelgroep || b.doelgroep === filters.doelgroep) &&
    (!filters.niveau || b.niveau === filters.niveau) &&
    (!filters.big || (filters.big === "ja" ? b.big : !b.big)) &&
    (!filters.regio || b.regio.includes(filters.regio))
  );
  return (
    <div className="beroepen-grid">
      {filtered.map(b => <BeroepCard key={b.slug} beroep={b} />)}
    </div>
  );
}
