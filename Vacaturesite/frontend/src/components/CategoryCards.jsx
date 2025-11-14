import React from "react";

const categories = [
  { name: "Thuiszorg", badge: "Direct starten", color: "#00bfae" },
  { name: "VVT", badge: "ZZP mogelijk", color: "#3e7cb1" },
  { name: "GGZ", badge: "", color: "#f9b233" },
  { name: "Gehandicaptenzorg", badge: "", color: "#e94f37" },
  { name: "Jeugd", badge: "", color: "#6c63ff" },
];

export default function CategoryCards() {
  return (
    <section className="categories">
      <h2>Populaire categorieën</h2>
      <div className="category-list">
        {categories.map((cat) => (
          <div key={cat.name} className="category-card" style={{ background: cat.color }}>
            <div>{cat.name}</div>
            {cat.badge && <span className="category-badge">{cat.badge}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
