import React, { useEffect, useState } from "react";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/logs.json")
      .then((res) => res.json())
      .then(setLogs)
      .catch(() => setLogs([]));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Backup & Logbeheer</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#181f2a", color: "#fff" }}>
        <thead>
          <tr style={{ background: "#232b3b" }}>
            <th style={{ padding: 8, border: "1px solid #333" }}>Datum/tijd</th>
            <th style={{ padding: 8, border: "1px solid #333" }}>Versie</th>
            <th style={{ padding: 8, border: "1px solid #333" }}>Status</th>
            <th style={{ padding: 8, border: "1px solid #333" }}>Items</th>
            <th style={{ padding: 8, border: "1px solid #333" }}>Melding</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign: "center", color: "#aaa" }}>Geen logs gevonden</td></tr>
          )}
          {logs.slice().reverse().map((log, i) => (
            <tr key={i}>
              <td style={{ padding: 8, border: "1px solid #333" }}>{log.timestamp.replace("T", " ").replace("Z", "")}</td>
              <td style={{ padding: 8, border: "1px solid #333" }}>{log.version}</td>
              <td style={{ padding: 8, border: "1px solid #333" }}>{log.status}</td>
              <td style={{ padding: 8, border: "1px solid #333" }}>{Array.isArray(log.items) ? log.items.join(", ") : ""}</td>
              <td style={{ padding: 8, border: "1px solid #333" }}>{log.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
