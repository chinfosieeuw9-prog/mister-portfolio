import React from "react";
import HeroSection from "../components/HeroSection";
import CategoryCards from "../components/CategoryCards";
import FeaturedJobs from "../components/FeaturedJobs";
import FeaturedEmployers from "../components/FeaturedEmployers";
import CTAJobAlert from "../components/CTAJobAlert";
import BlogTeasers from "../components/BlogTeasers";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryCards />
      <FeaturedJobs />
      <FeaturedEmployers />
      <CTAJobAlert />
      <BlogTeasers />
    </>
  );
}
