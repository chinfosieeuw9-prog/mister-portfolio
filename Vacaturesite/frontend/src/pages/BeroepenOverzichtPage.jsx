import React, { useState } from "react";
import Navbar from "../components/Navbar";
import BeroepenFilter from "../components/BeroepenFilter";
import BeroepenGrid from "../components/BeroepenGrid";

export default function BeroepenOverzichtPage() {
  const [filters, setFilters] = useState({ doelgroep: "", niveau: "", big: "", regio: "West-Brabant" });
  return (
    <>
      <Navbar />
      <div className="beroepen-overzicht-page">
        <h1>Beroepen in de zorg – West‑Brabant</h1>
        <BeroepenFilter filters={filters} setFilters={setFilters} />
        <BeroepenGrid filters={filters} />
      </div>
    </>
  );
}
