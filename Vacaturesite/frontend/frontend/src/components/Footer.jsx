import React from "react";
import "../styles/Footer.css";
import versionData from "../../../version.json";

// Jaartal vast op 2025
const year = 2025;

export default function Footer() {
  return (
    <footer className="footer-bar">
      © Copyright {year} MProductions - Version v{versionData.version} - All Rights Reserved
    </footer>
  );
}
