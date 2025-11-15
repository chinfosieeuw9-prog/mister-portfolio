import React from "react";
import { useParams, Link } from "react-router-dom";
import { blogposts } from "../data/blogposts";
import JobAlertForm from "../components/JobAlertForm";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const post = blogposts.find(b => b.slug === slug);
  if (!post) return <div>Artikel niet gevonden.</div>;
  return (
    <div className="blog-detail-page">
      <div className="blog-hero">
        <img src={post.image} alt={post.title} />
        <h1>{post.title}</h1>
        <div className="blog-meta">{post.category} • {post.date}</div>
      </div>
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      <div className="blog-cta">
        <JobAlertForm presetFilters={{ regio: "West-Brabant" }} />
        <Link to="/vacatures" className="btn-primary">Bekijk vacatures in West‑Brabant</Link>
      </div>
    </div>
  );
}
