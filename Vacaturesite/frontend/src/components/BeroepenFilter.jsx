import React from "react";

export default function BeroepenFilter({ filters, setFilters }) {
  return (
    <form className="beroepen-filter">
      <label>Doelgroep</label>
      <select value={filters.doelgroep} onChange={e => setFilters(f => ({ ...f, doelgroep: e.target.value }))}>
        <option value="">Alle doelgroepen</option>
        <option value="VVT">VVT</option>
        <option value="GGZ">GGZ</option>
        <option value="GZ">GZ</option>
        <option value="Jeugd">Jeugd</option>
      </select>
      <label>Opleidingsniveau</label>
      <select value={filters.niveau} onChange={e => setFilters(f => ({ ...f, niveau: e.target.value }))}>
        <option value="">Alle niveaus</option>
        <option value="MBO">MBO</option>
        <option value="HBO">HBO</option>
      </select>
      <label>BIG-plicht</label>
      <select value={filters.big} onChange={e => setFilters(f => ({ ...f, big: e.target.value }))}>
        <option value="">Alles</option>
        <option value="ja">Ja</option>
        <option value="nee">Nee</option>
      </select>
      <label>Regio</label>
      <input value={filters.regio} onChange={e => setFilters(f => ({ ...f, regio: e.target.value }))} placeholder="Regio" />
    </form>
  );
}
