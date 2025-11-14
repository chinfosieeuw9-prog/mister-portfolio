import React from "react";
import Navbar from "../components/Navbar";
import RegiohubHero from "../components/RegiohubHero";
import RegiohubVacaturekaart from "../components/RegiohubVacaturekaart";
import RegiohubWerkgevers from "../components/RegiohubWerkgevers";
import RegiohubGemeenten from "../components/RegiohubGemeenten";
import RegiohubEvents from "../components/RegiohubEvents";
import RegiohubReizen from "../components/RegiohubReizen";
import JobAlertForm from "../components/JobAlertForm";
import RegiohubFAQ from "../components/RegiohubFAQ";

export default function RegiohubWestBrabant() {
  return (
    <>
      <Navbar />
      <div className="regiohub-westbrabant-page">
        <RegiohubHero />
        <RegiohubVacaturekaart />
        <RegiohubWerkgevers />
        <RegiohubGemeenten />
        <RegiohubEvents />
        <RegiohubReizen />
        <section className="regiohub-jobalert">
          <h2>Job alert voor West‑Brabant</h2>
          <p>Ontvang nieuwe zorgvacatures in West‑Brabant in je inbox.</p>
          <JobAlertForm presetFilters={{ regio: "West-Brabant" }} />
        </section>
        <RegiohubFAQ />
      </div>
    </>
  );
}
