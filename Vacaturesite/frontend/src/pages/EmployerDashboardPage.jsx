import React, { useState } from "react";
import Navbar from "../components/Navbar";
import EmployerKPIWidgets from "../components/EmployerKPIWidgets";
import EmployerDashboardTabs from "../components/EmployerDashboardTabs";

export default function EmployerDashboardPage() {
  return (
    <>
      <Navbar />
      <div className="employer-dashboard-page">
        <EmployerKPIWidgets />
        <EmployerDashboardTabs />
      </div>
    </>
  );
}
