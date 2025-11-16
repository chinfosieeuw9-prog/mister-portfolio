
import React from "react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Design Art & Multimedia", color: "#6C63FF", icon: <svg width="40" height="40" fill="#fff" viewBox="0 0 24 24"><path d="M19.5 4.5l-15 15" stroke="#fff" strokeWidth="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="7" r="2"/></svg>, openings: 22 },
  { name: "Finance", color: "#B721FF", icon: <svg width="40" height="40" fill="#fff" viewBox="0 0 24 24"><path d="M12 2v20M5 12h14" stroke="#fff" strokeWidth="2"/></svg>, openings: 11 },
  { name: "Medical", color: "#2196F3", icon: <svg width="40" height="40" fill="#fff" viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="20" rx="3"/></svg>, openings: 27 },
  { name: "Networking", color: "#8BC34A", icon: <svg width="40" height="40" fill="#fff" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" opacity=".2"/><circle cx="12" cy="12" r="4"/></svg>, openings: 12 },
  { name: "Research", color: "#FF9800", icon: <svg width="40" height="40" fill="#fff" viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="5"/></svg>, openings: 2 },
  { name: "Development", color: "#FF5722", icon: <svg width="40" height="40" fill="#fff" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="10" opacity=".2"/><rect x="9" y="9" width="6" height="6" rx="3"/></svg>, openings: 9 },
  { name: "Film Industry", color: "#009688", icon: <svg width="40" height="40" fill="#fff" viewBox="0 0 24 24"><rect x="7" y="13" width="3" height="7"/><rect x="11" y="9" width="3" height="11"/><rect x="15" y="5" width="3" height="15"/></svg>, openings: 11 },
  { name: "Corporate", color: "#00BCD4", icon: <svg width="40" height="40" fill="#fff" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" opacity=".2"/><circle cx="12" cy="12" r="4"/></svg>, openings: 10 },
  { name: "Goverment", color: "#3F51B5", icon: <svg width="40" height="40" fill="#fff" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="10" opacity=".2"/><rect x="9" y="9" width="6" height="6" rx="3"/></svg>, openings: 12 },
  { name: "Banking", color: "#E91E63", icon: <svg width="40" height="40" fill="#fff" viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="5"/></svg>, openings: 20 },
];

export default function CategoryCards() {
  return (
    <section style={{padding:'2.5rem 0 1.5rem 0',background:'#f7f8fa'}}>
      <h2 style={{textAlign:'center',fontSize:'2.1rem',fontWeight:800,letterSpacing:0.5,color:'#1a2340',marginBottom:'0.7rem'}}>Populaire categorieën</h2>
      <div style={{textAlign:'center',color:'#7a7a8c',fontSize:'1.08rem',marginBottom:'2.2rem'}}>Hier vind je de categorieën met de meeste vacatures.</div>
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(5, 180px)',
        gap:'2.1rem 2.1rem',
        maxWidth:1100,
        margin:'0 auto',
        justifyContent:'center',
      }}>
        {categories.map((cat, i) => (
          <Link
            key={cat.name}
            to={`/vacatures?categorie=${encodeURIComponent(cat.name)}`}
            style={{
              background: cat.color,
              color:'#fff',
              textDecoration:'none',
              width:180,
              height:150,
              borderRadius:18,
              display:'flex',
              flexDirection:'column',
              alignItems:'center',
              justifyContent:'center',
              fontWeight:700,
              fontSize:'1.13rem',
              letterSpacing:0.2,
              transition:'transform 0.18s',
              cursor:'pointer',
              boxShadow:'0 2px 8px #b3b8c522',
              border:'none',
              margin:0
            }}
            onMouseOver={e=>e.currentTarget.style.transform='translateY(-6px) scale(1.04)'}
            onMouseOut={e=>e.currentTarget.style.transform='none'}
          >
            <div style={{marginBottom:18}}>{cat.icon}</div>
            <span style={{color:'#fff',fontWeight:700,fontSize:'1.13rem',textAlign:'center',lineHeight:1.2}}>{cat.name}</span>
            <span style={{color:'#fff',fontWeight:400,fontSize:'0.98rem',marginTop:6,opacity:0.92}}>{`(${cat.openings} vacatures)`}</span>
          </Link>
        ))}
      </div>
      <div style={{textAlign:'center',marginTop:'2.2rem'}}>
        <Link to="/beroepen" style={{color:'#f857a6',fontWeight:700,fontSize:'1.08rem',textDecoration:'underline',letterSpacing:0.2}}>Bekijk alle categorieën &gt;</Link>
      </div>
    </section>
  );
}
