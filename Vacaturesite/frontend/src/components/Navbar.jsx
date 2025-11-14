import React from "react";
import "../App.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* Logo of naam */}
        <span className="navbar-title">VitalJobs</span>
      </div>
      <ul className="navbar-links">
        <li><a href="/">Home</a></li>
        <li><a href="/jobs">Jobs</a></li>
        <li><a href="/employer">Employer</a></li>
        <li><a href="/candidate">Candidate</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><button className="btn-secondary">Post a Job</button></li>
        <li><button className="btn-primary">Signup/Login</button></li>
      </ul>
    </nav>
  );
}
