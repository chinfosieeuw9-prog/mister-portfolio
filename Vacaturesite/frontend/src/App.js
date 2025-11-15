import "./css/searchbar-demo.css";

import AdminDashboard from "./components/AdminDashboard";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import JobsOverview from "./pages/JobsOverview";
import JobDetailPage from "./pages/JobDetailPage";
import ApplyFlow from "./pages/ApplyFlow";
import EmployerProfilePage from "./pages/EmployerProfilePage";
import EmployerDashboardPage from "./pages/EmployerDashboardPage";
import CandidatePortal from "./pages/CandidatePortal";
import RegiohubWestBrabant from "./pages/RegiohubWestBrabant";
import FAQPage from "./pages/FAQPage";
import PrivacyPage from "./pages/PrivacyPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import BeroepenOverzichtPage from "./pages/BeroepenOverzichtPage";
import BeroepDetailPage from "./pages/BeroepDetailPage";
import JobAlertsPage from "./pages/JobAlertsPage";
import ManageAlertsPage from "./pages/ManageAlertsPage";
import RegioFAQPage from "./pages/RegioFAQPage";
import PostJobPage from "./pages/PostJobPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      {/* Debug overlay rechtsboven */}
      <div style={{position:'fixed',top:10,right:10,zIndex:9999,background:'#222',color:'#fff',padding:'6px 16px',borderRadius:8,fontSize:14,opacity:0.85}}>
        DEBUG {new Date().toLocaleTimeString()}
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vacatures" element={<JobsOverview />} />
          <Route path="/vacature/:slug" element={<JobDetailPage />} />
          <Route path="/solliciteren" element={<ApplyFlow />} />
          <Route path="/werkgever" element={<EmployerProfilePage />} />
          <Route path="/werkgever-dashboard" element={<EmployerDashboardPage />} />
          <Route path="/kandidaat" element={<CandidatePortal />} />
          <Route path="/regiohub-westbrabant" element={<RegiohubWestBrabant />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/beroepen" element={<BeroepenOverzichtPage />} />
          <Route path="/beroep/:slug" element={<BeroepDetailPage />} />
          <Route path="/job-alerts" element={<JobAlertsPage />} />
          <Route path="/manage-alerts" element={<ManageAlertsPage />} />
          <Route path="/regio-faq" element={<RegioFAQPage />} />
          <Route path="/vacature-plaatsen" element={<PostJobPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
