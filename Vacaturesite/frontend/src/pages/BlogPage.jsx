import React, { useState } from "react";
import Navbar from "../components/Navbar";
import BlogCategories from "../components/BlogCategories";
import BlogList from "../components/BlogList";

export default function BlogPage() {
  const [category, setCategory] = useState("");
  return (
    <>
      <Navbar />
      <div className="blog-page">
        <h1>Blog & verhalen uit de zorg</h1>
        <BlogCategories category={category} setCategory={setCategory} />
        <BlogList category={category} />
      </div>
    </>
  );
}
