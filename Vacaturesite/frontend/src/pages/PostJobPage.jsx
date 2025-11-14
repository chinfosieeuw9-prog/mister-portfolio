import React, { useState } from "react";
import Navbar from "../components/Navbar";
import PostJobForm from "../components/PostJobForm";
import JobPostingPreview from "../components/JobPostingPreview";

export default function PostJobPage() {
  const [jobData, setJobData] = useState(null);
  return (
    <>
      <Navbar />
      <div className="post-job-page">
        <h1>Vacature plaatsen</h1>
        <PostJobForm onPreview={setJobData} />
        {jobData && <JobPostingPreview data={jobData} />}
      </div>
    </>
  );
}
