
import React, { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaGithub, FaYoutube } from "react-icons/fa";
import "../App.css";
import { getVersion } from "../utils/version";

export default function Footer() {
  const [version, setVersion] = useState("");
  useEffect(() => {
    getVersion().then(v => setVersion(v));
  }, []);
  return (
    <footer className="footer-bar-modern">
      <div className="footer-content">
        <span>
          © 2025 VitalJobs {version ? `(v${version})` : ""}. All rights reserved.
        </span>
        <div className="footer-socials">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
        </div>
      </div>
    </footer>
  );
}
