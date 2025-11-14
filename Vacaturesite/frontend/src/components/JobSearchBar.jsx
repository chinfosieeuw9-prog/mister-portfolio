import React from "react";

export default function JobSearchBar() {
  return (
    <form className="job-search-bar">
      <input type="text" placeholder="Functie of diploma (bijv. Thuisbegeleider, VIG)" />
      <input type="text" placeholder="Plaats/Regio (Breda, Roosendaal, Bergen op Zoom)" />
      <button className="btn-primary">Zoek</button>
      <a href="#" className="search-advanced">Uitgebreid zoeken</a>
    </form>
  );
}
