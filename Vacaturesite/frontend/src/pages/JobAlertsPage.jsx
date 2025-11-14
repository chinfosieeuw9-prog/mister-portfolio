import React from "react";
import Navbar from "../components/Navbar";
import JobAlertForm from "../components/JobAlertForm";

export default function JobAlertsPage() {
  return (
    <>
      <Navbar />
      <div className="job-alerts-page">
        <h1>Job alerts</h1>
        <JobAlertForm />
      </div>
    </>
  );
}
