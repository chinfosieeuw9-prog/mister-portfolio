import React from "react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Verpleegkundige", color: "#00bfae" },
  { name: "Artsen", color: "#3e7cb1" },
  { name: "Zorgassistent", color: "#f9b233" },
  { name: "Paramedici", color: "#e94f37" },
  { name: "Management", color: "#6c63ff" },
  { name: "Overig", color: "#bdbdbd" },
];

export default function CategoryCards() {
  return (
    <section className="categories">
      <h2>Populaire categorieën</h2>
      <div className="category-list">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={`/vacatures?categorie=${encodeURIComponent(cat.name)}`}
            className="category-card"
            style={{ background: cat.color, textDecoration: "none" }}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
