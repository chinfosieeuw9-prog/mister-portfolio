import React from "react";

export default function RegioFAQTabs({ category, setCategory, categories }) {
  return (
    <div className="regio-faq-tabs">
      {categories.map((c) => (
        <button
          key={c}
          className={category === c ? "active" : ""}
          onClick={() => setCategory(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
