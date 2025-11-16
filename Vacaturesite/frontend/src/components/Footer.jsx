
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
    <>
      <div style={{position:'fixed',left:10,bottom:10,zIndex:9999,background:'#ff0055',color:'#fff',padding:'8px 18px',borderRadius:8,fontWeight:700,fontSize:15,boxShadow:'0 2px 8px #0002',letterSpacing:1}}>
        DEBUG: Footer component actief
      </div>
      <footer style={{background:'#181f2a',color:'#e5e7ef',padding:'2.5rem 0 1.2rem 0',marginTop:'3rem',borderTop:'1px solid #232b3b'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:24}}>
          <div style={{display:'flex',gap:18,marginBottom:8}}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{color:'#e5e7ef',fontSize:22}}><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{color:'#e5e7ef',fontSize:22}}><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" style={{color:'#e5e7ef',fontSize:22}}><FaTwitter /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{color:'#e5e7ef',fontSize:22}}><FaGithub /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{color:'#e5e7ef',fontSize:22}}><FaYoutube /></a>
          </div>
          <div style={{fontSize:15,letterSpacing:0.5,opacity:0.95}}>
            © Copyright 2025 Misterplace - V {version ? version : 'X.X.X'} - All Rights Reserved
          </div>
        </div>
      </footer>
    </>

  );
}
