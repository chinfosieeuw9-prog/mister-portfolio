import React from "react";
import { blogposts } from "../data/blogposts";
import BlogCard from "./BlogCard";

export default function BlogList({ category }) {
  const filtered = category ? blogposts.filter(b => b.category === category) : blogposts;
  return (
    <div className="blog-list">
      {filtered.map(b => <BlogCard key={b.slug} post={b} />)}
    </div>
  );
}
