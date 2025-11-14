import React from "react";
import "../App.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

const categories = [
  { name: "Verpleegkundige", color: "#00bfae" },
  { name: "Artsen", color: "#3e7cb1" },
  { name: "Zorgassistent", color: "#f9b233" },
  { name: "Paramedici", color: "#e94f37" },
  { name: "Management", color: "#6c63ff" },
  { name: "Overig", color: "#bdbdbd" },
];

export default function LandingPage() {
  return (
    <div className="landing-bg">
      <Navbar />
      <header className="hero hero-bg">
        <div className="hero-content">
          <h1>Vind jouw droombaan in de zorg</h1>
          <p>AI-gedreven vacaturesite voor zorgprofessionals</p>
          <form className="search-form search-form-large">
            <input type="text" placeholder="Functie, trefwoord..." />
            <input type="text" placeholder="Plaats of regio" />
            <select>
              <option>Alle categorieën</option>
              {categories.map((cat) => (
                <option key={cat.name}>{cat.name}</option>
              ))}
            </select>
            <button type="submit">Zoek</button>
          </form>
        </div>
      </header>
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
      <Footer />
    </div>
  );
}
