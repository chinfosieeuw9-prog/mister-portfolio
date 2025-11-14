import React from "react";

export default function JobFilters() {
  return (
    <aside className="job-filters">
      <h3>Filters</h3>
      <div className="filter-group">
        <label>Functie</label>
        <input type="text" placeholder="Bijv. Verpleegkundige" />
      </div>
      <div className="filter-group">
        <label>Doelgroep</label>
        <select>
          <option>Alle doelgroepen</option>
          <option>VVT</option>
          <option>GGZ</option>
          <option>GZ</option>
          <option>Jeugd</option>
        </select>
      </div>
      <div className="filter-group">
        <label>BIG vereist</label>
        <input type="checkbox" />
      </div>
      <div className="filter-group">
        <label>Contracttype</label>
        <select>
          <option>Alle types</option>
          <option>Vast</option>
          <option>Tijdelijk</option>
          <option>ZZP</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Uren</label>
        <input type="number" placeholder="Min" style={{width: '60px'}} /> - <input type="number" placeholder="Max" style={{width: '60px'}} />
      </div>
      <div className="filter-group">
        <label>Diensten</label>
        <select>
          <option>Alle diensten</option>
          <option>Dag</option>
          <option>Avond</option>
          <option>Nacht</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Regio</label>
        <input type="text" placeholder="Bijv. Breda" />
      </div>
      <div className="filter-group">
        <label>Salarisrange</label>
        <input type="number" placeholder="Min" style={{width: '60px'}} /> - <input type="number" placeholder="Max" style={{width: '60px'}} />
      </div>
      <div className="filter-group">
        <label>CAO</label>
        <input type="text" placeholder="Bijv. VVT" />
      </div>
      <button className="btn-primary">Toon resultaten</button>
      <button className="btn-secondary">Wis alles</button>
    </aside>
  );
}
