import React from "react";

export default function FAQTabs({ category, setCategory, categories }) {
  return (
    <div className="faq-tabs">
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
