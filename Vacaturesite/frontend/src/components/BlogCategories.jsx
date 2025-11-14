import React from "react";

const CATEGORIES = [
  "Sollicitatietips",
  "Dag uit het leven",
  "Opleiding/BIG/VOG",
  "Regio & werkgevers",
  "Seizoenscontent",
];

export default function BlogCategories({ category, setCategory }) {
  return (
    <div className="blog-categories">
      {CATEGORIES.map((c) => (
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
