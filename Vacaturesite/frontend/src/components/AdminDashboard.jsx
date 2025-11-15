import React from "react";
import AdminLogs from "./AdminLogs";

export default function AdminDashboard() {
  return (
    <div style={{ maxWidth: 1000, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Admin Dashboard</h1>
      <nav style={{ marginBottom: 24 }}>
        <a href="#logs" style={{ marginRight: 16 }}>Backup & Logbeheer</a>
        {/* Voeg hier meer admin-links toe */}
      </nav>
      <section id="logs">
        <AdminLogs />
      </section>
    </div>
  );
}
