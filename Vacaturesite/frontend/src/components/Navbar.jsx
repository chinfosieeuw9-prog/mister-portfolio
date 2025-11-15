
import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="navbar-title">VitalJobs</span>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/home">Startpagina</Link></li>
        <li><Link to="/vacatures">Vacatures</Link></li>
        <li><Link to="/job-alerts">Job alerts</Link></li>
        <li><Link to="/manage-alerts">Beheer alerts</Link></li>
        <li><Link to="/beroepen">Beroepen</Link></li>
        <li><Link to="/faq">FAQ</Link></li>
        <li><Link to="/privacy">Privacy</Link></li>
        <li><Link to="/regiohub-westbrabant">Regiohub</Link></li>
        <li><Link to="/employer">Werkgever</Link></li>
        <li><Link to="/werkgever-dashboard">Werkgever dashboard</Link></li>
        <li><Link to="/candidate">Kandidaat</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/vacature-plaatsen" className="btn-secondary">Vacature plaatsen</Link></li>
        <li><Link to="/admin-dashboard" className="btn-primary">Admin</Link></li>
      </ul>
    </nav>
  );
}
