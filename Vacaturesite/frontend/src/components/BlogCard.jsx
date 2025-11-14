import React from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ post }) {
  return (
    <div className="blog-card">
      <img src={post.image} alt={post.title} />
      <h2>{post.title}</h2>
      <div className="blog-intro">{post.intro}</div>
      <div className="blog-meta">{post.category} • {post.date}</div>
      <Link to={`/blog/${post.slug}`} className="btn-primary">Lees verder</Link>
    </div>
  );
}
