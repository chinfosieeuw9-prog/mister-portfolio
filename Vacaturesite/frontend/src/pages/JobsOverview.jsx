
import React from "react";
import Navbar from "../components/Navbar";
import JobSearchBar from "../components/JobSearchBar";
import JobFilters from "../components/JobFilters";
import JobSortBar from "../components/JobSortBar";
import JobList from "../components/JobList";
import CTAJobAlert from "../components/CTAJobAlert";
import { useLocation } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function JobsOverview() {
  const query = useQuery();
  const filters = {
    functie: query.get("functie") || "",
    locatie: query.get("locatie") || "",
    categorie: query.get("categorie") || "",
  };
  return (
    <>
      <Navbar />
      <div className="breadcrumb">Home &gt; Vacatures</div>
      <h1>Zorgvacatures in West‑Brabant</h1>
      <p>Filter op functie, doelgroep en regio en solliciteer direct op banen in thuiszorg, VVT en meer.</p>
      <JobSearchBar defaultFilters={filters} />
      <div className="jobs-overview-layout">
        <aside className="jobs-filters-col">
          <JobFilters filters={filters} />
        </aside>
        <main className="jobs-results-col">
          <JobSortBar />
          <JobList filters={filters} />
          <CTAJobAlert />
        </main>
      </div>
    </>
  );
}
