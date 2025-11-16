import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAISuggestie } from "../utils/aiSuggestie";
// SVG icon for sparkle
const SparkleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight:'8px',verticalAlign:'middle'}}>
    <g filter="url(#glow)">
      <path d="M11 2.5L12.09 7.09C12.23 7.67 12.73 8.07 13.33 8.07H18.09L14.09 10.91C13.61 11.25 13.41 11.89 13.65 12.44L15.09 15.91L11 13.09C10.52 12.75 9.78 12.75 9.3 13.09L5.21 15.91L6.65 12.44C6.89 11.89 6.69 11.25 6.21 10.91L2.21 8.07H6.97C7.57 8.07 8.07 7.67 8.21 7.09L9.3 2.5H11Z" fill="#fff"/>
    </g>
    <defs>
      <filter id="glow" x="0" y="0" width="22" height="22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#a084ff"/>
      </filter>
    </defs>
  </svg>
);
const navigate = useNavigate();
  const [keywords, setKeywords] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState("vacatures");
  const categories = [
    "Verpleging",
    "Verzorging",
    "Paramedisch",
    "Medisch",
    "Overig"
  ];
        <form
          style={{
            display: 'flex',
            width: '100%',
            maxWidth: 900,
            margin: '0 auto',
            border: 'none',
            background: 'linear-gradient(90deg,#f7f8fa 0%,#eaf3ff 100%)',
            borderRadius: '2.5rem',
            boxShadow: '0 6px 32px 0 #b3b8c522',
            alignItems: 'center',
            gap: 0,
            position: 'relative',
            zIndex: 2
          }}
          onSubmit={handleSubmit}
        >
          {/* ...input fields here... */}
          <button
            className="glass-btn"
            ref={el => window._aiBtn = el}
            type="button"
            title="AI Suggestie"
            onClick={e => {
              handleAISuggestie(e);
              const btn = e.currentTarget;
              const ripple = document.createElement('span');
              ripple.className = 'ripple';
              ripple.style.width = ripple.style.height = '54px';
              ripple.style.left = '0px';
              ripple.style.top = '0px';
              btn.appendChild(ripple);
              setTimeout(() => ripple.remove(), 600);
              // Confetti effect
              for(let i=0;i<12;i++){
                const conf = document.createElement('span');
                conf.className = 'confetti';
                conf.style.background = `hsl(${Math.random()*360},90%,60%)`;
                conf.style.width = '6px';
                conf.style.height = '6px';
                conf.style.borderRadius = '50%';
                conf.style.position = 'absolute';
                conf.style.left = (27+Math.cos(i/12*2*Math.PI)*18)+'px';
                conf.style.top = (27+Math.sin(i/12*2*Math.PI)*18)+'px';
                conf.style.opacity = 1;
                conf.animate([
                  {transform:`translateY(0) scale(1)`,opacity:1},
                  {transform:`translateY(${40+Math.random()*20}px) scale(${0.7+Math.random()*0.5})`,opacity:0.1}
                ],{duration:700});
                btn.appendChild(conf);
                setTimeout(()=>conf.remove(),700);
              }
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" fill="#fff5"/>
              <text x="16" y="22" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">AI</text>
            </svg>
          </button>
          <button
            className="glass-btn zoek"
            ref={el => window._zoekBtn = el}
            type="submit"
            title="Zoek"
            onClick={e => {
              const btn = e.currentTarget;
              const ripple = document.createElement('span');
              ripple.className = 'ripple';
              ripple.style.width = ripple.style.height = '54px';
              ripple.style.left = '0px';
              ripple.style.top = '0px';
              btn.appendChild(ripple);
              setTimeout(() => ripple.remove(), 600);
              // Confetti effect
              for(let i=0;i<12;i++){
                const conf = document.createElement('span');
                conf.className = 'confetti';
                conf.style.background = `hsl(${Math.random()*360},90%,60%)`;
                conf.style.width = '6px';
                conf.style.height = '6px';
                conf.style.borderRadius = '50%';
                conf.style.position = 'absolute';
                conf.style.left = (27+Math.cos(i/12*2*Math.PI)*18)+'px';
                conf.style.top = (27+Math.sin(i/12*2*Math.PI)*18)+'px';
                conf.style.opacity = 1;
                conf.animate([
                  {transform:`translateY(0) scale(1)`,opacity:1},
                  {transform:`translateY(${40+Math.random()*20}px) scale(${0.7+Math.random()*0.5})`,opacity:0.1}
                ],{duration:700});
                btn.appendChild(conf);
                setTimeout(()=>conf.remove(),700);
              }
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" fill="#fff5"/>
              <circle cx="16" cy="17" r="6" fill="none" stroke="#fff" strokeWidth="2"/>
              <line x1="24" y1="24" x2="20.5" y2="20.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </form>
        {/* Zorg dat losse JSX na </form> in een fragment staat */}
        <>
          <circle cx="16" cy="16" r="14" fill="#fff5"/>
          <text x="16" y="22" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="bold">AI</text>
        </>
            }}
            onClick={handleAISuggestie}
            type="button"
            title="AI Suggestie"
          >
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="26" fill="url(#aiCircle)"/>
              <defs>
                <linearGradient id="aiCircle" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#5fd0ff"/>
                  <stop offset="100%" stopColor="#2d9cdb"/>
                </linearGradient>
              </defs>
              <text x="28" y="36" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="bold">AI</text>
            </svg>
          </button>
          <button
            className="shine-anim"
            ref={el => window._zoekBtn = el}
            type="submit"
            style={{
              background: 'none',
              width: 56,
              height: 56,
              marginLeft: 12,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              position: 'relative',
              overflow: 'visible'
            }}
            <button
              className="glass-btn zoek"
              ref={el => window._zoekBtn = el}
              type="submit"
              onClick={e => {
                const btn = e.currentTarget;
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.width = ripple.style.height = '54px';
                ripple.style.left = '0px';
                ripple.style.top = '0px';
                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
                // Confetti effect
                for(let i=0;i<12;i++){
                  const conf = document.createElement('span');
                  conf.className = 'confetti';
                  conf.style.background = `hsl(${Math.random()*360},90%,60%)`;
                  conf.style.width = '6px';
                  conf.style.height = '6px';
                  conf.style.borderRadius = '50%';
                  conf.style.position = 'absolute';
                  conf.style.left = (27+Math.cos(i/12*2*Math.PI)*18)+'px';
                  conf.style.top = (27+Math.sin(i/12*2*Math.PI)*18)+'px';
                  conf.style.opacity = 1;
                  conf.animate([
                    {transform:`translateY(0) scale(1)`,opacity:1},
                    {transform:`translateY(${40+Math.random()*20}px) scale(${0.7+Math.random()*0.5})`,opacity:0.1}
                  ],{duration:700});
                  btn.appendChild(conf);
                  setTimeout(()=>conf.remove(),700);
                }
              }}
              title="Zoek"
            >
              <svg width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" fill="#fff5"/>
                <circle cx="16" cy="17" r="6" fill="none" stroke="#fff" strokeWidth="2"/>
                <line x1="24" y1="24" x2="20.5" y2="20.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
