import React from "react";
import Navbar from "../components/Navbar";
import JobSearchBar from "../components/JobSearchBar";
import JobFilters from "../components/JobFilters";
import JobSortBar from "../components/JobSortBar";
import JobList from "../components/JobList";
import CTAJobAlert from "../components/CTAJobAlert";

export default function JobsOverview() {
  return (
    <>
      <Navbar />
      <div className="breadcrumb">Home &gt; Vacatures</div>
      <h1>Zorgvacatures in West‑Brabant</h1>
      <p>Filter op functie, doelgroep en regio en solliciteer direct op banen in thuiszorg, VVT en meer.</p>
      <JobSearchBar />
      <div className="jobs-overview-layout">
        <aside className="jobs-filters-col">
          <JobFilters />
        </aside>
        <main className="jobs-results-col">
          <JobSortBar />
          <JobList />
          <CTAJobAlert />
        </main>
      </div>
    </>
  );
}
