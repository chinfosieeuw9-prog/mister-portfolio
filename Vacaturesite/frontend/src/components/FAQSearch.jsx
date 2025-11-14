import React from "react";

export default function FAQSearch({ search, setSearch }) {
  return (
    <input
      className="faq-search"
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="Zoek in FAQ..."
    />
  );
}
