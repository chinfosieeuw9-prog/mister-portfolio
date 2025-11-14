import React from "react";

export default function JobSortBar() {
  return (
    <div className="job-sort-bar">
      <span>20 resultaten</span>
      <select>
        <option>Meest recent</option>
        <option>Salaris (hoog-laag)</option>
        <option>Dichtstbij</option>
        <option>Uren (hoog-laag)</option>
      </select>
      <button className="btn-secondary">Lijst</button>
      <button className="btn-secondary">Kaart</button>
    </div>
  );
}
