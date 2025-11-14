import React, { useState } from "react";
import Navbar from "../components/Navbar";
import FAQTabs from "../components/FAQTabs";
import FAQSearch from "../components/FAQSearch";
import FAQList from "../components/FAQList";

const CATEGORIES = ["Kandidaten", "Werkgevers", "Privacy/AVG"];

export default function FAQPage() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [search, setSearch] = useState("");
  return (
    <>
      <Navbar />
      <div className="faq-page">
        <h1>Veelgestelde vragen</h1>
        <FAQTabs category={category} setCategory={setCategory} categories={CATEGORIES} />
        <FAQSearch search={search} setSearch={setSearch} />
        <FAQList category={category} search={search} />
      </div>
    </>
  );
}
