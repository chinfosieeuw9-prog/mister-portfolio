import React from "react";
import { faqs } from "../data/faqs";

export default function FAQList({ category, search }) {
  const filtered = faqs.filter(f =>
    f.category === category &&
    (!search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="faq-list">
      {filtered.map((f, i) => (
        <div key={i} className="faq-item">
          <strong>{f.q}</strong>
          <div>{f.a}</div>
        </div>
      ))}
    </div>
  );
}
