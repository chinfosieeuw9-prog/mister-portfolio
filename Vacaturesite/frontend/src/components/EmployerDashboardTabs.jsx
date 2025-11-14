import React, { useState } from "react";
import EmployerJobsTab from "./EmployerJobsTab";
import EmployerCandidatesTab from "./EmployerCandidatesTab";
import EmployerMessagesTab from "./EmployerMessagesTab";
import EmployerAnalyticsTab from "./EmployerAnalyticsTab";
import EmployerTeamTab from "./EmployerTeamTab";

const TABS = [
  { key: "jobs", label: "Vacatures" },
  { key: "candidates", label: "Kandidaten" },
  { key: "messages", label: "Berichten" },
  { key: "analytics", label: "Analytics" },
  { key: "team", label: "Team & Instellingen" },
];

export default function EmployerDashboardTabs() {
  const [tab, setTab] = useState("jobs");
  return (
    <div className="employer-dashboard-tabs">
      <div className="tab-nav">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={tab === t.key ? "active" : ""}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tab === "jobs" && <EmployerJobsTab />}
        {tab === "candidates" && <EmployerCandidatesTab />}
        {tab === "messages" && <EmployerMessagesTab />}
        {tab === "analytics" && <EmployerAnalyticsTab />}
        {tab === "team" && <EmployerTeamTab />}
      </div>
    </div>
  );
}
