
import React from "react";
import "../App.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
      background:'#fff',
      boxShadow:'0 2px 16px 0 #b3b8c522',
      padding:'0.7rem 0',
      position:'sticky',
      top:0,
      zIndex:100,
      borderBottom:'1.5px solid #e5e7ef',
      width:'100%'
    }}>
      <div style={{maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 2.2rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontWeight:900,fontSize:'1.7rem',color:'#0a2342',letterSpacing:1.5,fontFamily:'Montserrat,sans-serif'}}>Misterplace</span>
        </div>
        <ul style={{display:'flex',alignItems:'center',gap:22,listStyle:'none',margin:0,padding:0}}>
          <li><Link to="/" style={{color:'#1a2340',fontWeight:600,fontSize:16,textDecoration:'none',padding:'6px 0'}}>Home</Link></li>
          <li><Link to="/vacatures" style={{color:'#1a2340',fontWeight:600,fontSize:16,textDecoration:'none',padding:'6px 0'}}>Vacatures</Link></li>
          <li><Link to="/job-alerts" style={{color:'#1a2340',fontWeight:600,fontSize:16,textDecoration:'none',padding:'6px 0'}}>Job alerts</Link></li>
          <li><Link to="/beroepen" style={{color:'#1a2340',fontWeight:600,fontSize:16,textDecoration:'none',padding:'6px 0'}}>Beroepen</Link></li>
          <li><Link to="/blog" style={{color:'#1a2340',fontWeight:600,fontSize:16,textDecoration:'none',padding:'6px 0'}}>Blog</Link></li>
          <li><Link to="/contact" style={{color:'#1a2340',fontWeight:600,fontSize:16,textDecoration:'none',padding:'6px 0'}}>Contact</Link></li>
          <li><Link to="/vacature-plaatsen" style={{background:'linear-gradient(90deg,#ff3576 0%,#ff7a59 100%)',color:'#fff',fontWeight:700,borderRadius:22,padding:'8px 22px',fontSize:16,marginLeft:8,textDecoration:'none',boxShadow:'0 2px 8px #ff357633'}}>Vacature plaatsen</Link></li>
        </ul>
      </div>
    </nav>
  );
}
