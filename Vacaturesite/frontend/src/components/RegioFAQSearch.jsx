import React from "react";

export default function RegioFAQSearch({ search, setSearch }) {
  return (
    <input
      className="regio-faq-search"
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="Zoek in regio FAQ..."
    />
  );
}
