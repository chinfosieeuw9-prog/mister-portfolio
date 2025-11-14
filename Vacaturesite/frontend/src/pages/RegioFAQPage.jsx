import React, { useState } from "react";
import Navbar from "../components/Navbar";
import RegioFAQTabs from "../components/RegioFAQTabs";
import RegioFAQSearch from "../components/RegioFAQSearch";
import RegioFAQList from "../components/RegioFAQList";
import JobAlertForm from "../components/JobAlertForm";

const CATEGORIES = [
  "Solliciteren",
  "Functie-eisen",
  "Reizen & Rooster",
  "Salaris & CAO",
  "Overig",
];

export default function RegioFAQPage() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [search, setSearch] = useState("");
  return (
    <>
      <Navbar />
      <div className="regio-faq-page">
        <h1>Veelgestelde vragen – West‑Brabant</h1>
        <RegioFAQTabs category={category} setCategory={setCategory} categories={CATEGORIES} />
        <RegioFAQSearch search={search} setSearch={setSearch} />
        <RegioFAQList category={category} search={search} />
        <section className="regio-faq-jobalert">
          <JobAlertForm presetFilters={{ regio: "West-Brabant" }} />
        </section>
      </div>
    </>
  );
}
