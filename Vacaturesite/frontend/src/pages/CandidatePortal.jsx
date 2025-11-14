import React, { useState } from "react";
import Navbar from "../components/Navbar";
import CandidateDashboard from "../components/CandidateDashboard";
import CandidateProfileTab from "../components/CandidateProfileTab";
import CandidateDocumentsTab from "../components/CandidateDocumentsTab";
import CandidateApplicationsTab from "../components/CandidateApplicationsTab";
import CandidateMessagesTab from "../components/CandidateMessagesTab";
import CandidateAlertsTab from "../components/CandidateAlertsTab";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "profile", label: "Profiel" },
  { key: "documents", label: "Documenten" },
  { key: "applications", label: "Sollicitaties" },
  { key: "messages", label: "Berichten" },
  { key: "alerts", label: "Alerts & voorkeuren" },
];

export default function CandidatePortal() {
  const [tab, setTab] = useState("dashboard");
  return (
    <>
      <Navbar />
      <div className="candidate-portal">
        <div className="tabs">
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
          {tab === "dashboard" && <CandidateDashboard />}
          {tab === "profile" && <CandidateProfileTab />}
          {tab === "documents" && <CandidateDocumentsTab />}
          {tab === "applications" && <CandidateApplicationsTab />}
          {tab === "messages" && <CandidateMessagesTab />}
          {tab === "alerts" && <CandidateAlertsTab />}
        </div>
      </div>
    </>
  );
}
