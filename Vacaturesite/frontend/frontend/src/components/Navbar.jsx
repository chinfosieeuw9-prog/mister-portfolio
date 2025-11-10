import React from "react";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="/logo.png" alt="VitalJobs logo" height="40" />
        <span className="navbar-title">VitalJobs</span>
      </div>
      <ul className="navbar-links">
        <li><a href="#">Vacatures</a></li>
        <li><a href="#">Over ons</a></li>
        <li><a href="#">Contact</a></li>
        <li><a href="#" className="btn-primary">Inloggen</a></li>
      </ul>
    </nav>
  );
}
