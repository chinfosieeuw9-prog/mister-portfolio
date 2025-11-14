import React from "react";
import Navbar from "../components/Navbar";
import JobDetailHeader from "../components/JobDetailHeader";
import JobDetailTabs from "../components/JobDetailTabs";
import JobApplyCard from "../components/JobApplyCard";
import EmployerBlock from "../components/EmployerBlock";
import RelatedJobs from "../components/RelatedJobs";

export default function JobDetailPage() {
  return (
    <>
      <Navbar />
      <div className="breadcrumb">Home &gt; Vacatures &gt; Thuisbegeleider – Breda</div>
      <div className="job-detail-layout">
        <main className="job-detail-main">
          <JobDetailHeader />
          <JobDetailTabs />
          <EmployerBlock />
          <RelatedJobs />
        </main>
        <aside className="job-detail-aside">
          <JobApplyCard />
        </aside>
      </div>
    </>
  );
}
