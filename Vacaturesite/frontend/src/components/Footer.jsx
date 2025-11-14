import React, { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaGithub, FaYoutube } from "react-icons/fa6";
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
          <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
          <a href="#" aria-label="X / Twitter"><FaXTwitter /></a>
          <a href="#" aria-label="GitHub"><FaGithub /></a>
          <a href="#" aria-label="YouTube"><FaYoutube /></a>
        </div>
      </div>
    </footer>
  );
}
