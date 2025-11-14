import React from "react";

const blogs = [
  {
    title: "Dag uit het leven van een Thuisbegeleider",
    summary: "Lees hoe een werkdag eruitziet in de thuiszorg en wat het werk zo bijzonder maakt.",
    category: "Verhalen",
  },
  {
    title: "Sollicitatietips voor de zorg",
    summary: "Praktische tips om je kans op een baan in de zorg te vergroten.",
    category: "Sollicitatietips",
  },
  // ...meer blogs
];

export default function BlogTeasers() {
  return (
    <section className="blog-teasers">
      <h2>Verhalen & tips</h2>
      <div className="blog-list">
        {blogs.map((blog, idx) => (
          <div key={idx} className="blog-card">
            <div className="blog-title">{blog.title}</div>
            <div className="blog-summary">{blog.summary}</div>
            <div className="blog-category">{blog.category}</div>
            <button className="btn-secondary">Lees meer</button>
          </div>
        ))}
      </div>
    </section>
  );
}
