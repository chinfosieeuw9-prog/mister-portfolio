import React from "react";
import Navbar from "./Navbar";
import "../styles/HomePage.css";

const categories = [
  { name: "Verpleegkundige", color: "#00bfae" },
  { name: "Artsen", color: "#3e7cb1" },
  { name: "Zorgassistent", color: "#f9b233" },
  { name: "Paramedici", color: "#e94f37" },
  { name: "Management", color: "#6c63ff" },
  { name: "Overig", color: "#bdbdbd" },
];

export default function HomePage() {
  return (
    <div className="homepage-bg">
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <h1>Vind jouw droombaan in de zorg</h1>
          <p>AI-gedreven vacaturesite voor zorgprofessionals</p>
          <form className="search-form">
            <input type="text" placeholder="Functie, trefwoord..." />
            <input type="text" placeholder="Plaats of regio" />
            <button type="submit">Zoek</button>
          </form>
        </div>
      </section>
      <section className="categories">
        <h2>Populaire categorieën</h2>
        <div className="category-list">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="category-card"
              style={{ background: cat.color }}
            >
              {cat.name}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
