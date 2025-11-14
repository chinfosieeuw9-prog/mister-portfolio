import React, { useState } from "react";
import { regiofaqs } from "../data/regiofaqs";

export default function RegioFAQList({ category, search }) {
  const [open, setOpen] = useState(null);
  const filtered = regiofaqs.filter(f =>
    f.category === category &&
    (!search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="regio-faq-list">
      {filtered.map((f, i) => (
        <div key={i} className="regio-faq-item">
          <button className="faq-question" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            {f.q}
          </button>
          {open === i && (
            <div className="faq-answer">
              <div dangerouslySetInnerHTML={{ __html: f.a }} />
              {f.cta && <a href={f.cta.href} className="btn-secondary">{f.cta.label}</a>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
