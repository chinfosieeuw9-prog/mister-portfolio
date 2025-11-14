import React from "react";
import Navbar from "../components/Navbar";
import EmployerHero from "../components/EmployerHero";
import EmployerMission from "../components/EmployerMission";
import EmployerLocations from "../components/EmployerLocations";
import EmployerTeamCulture from "../components/EmployerTeamCulture";
import EmployerBenefits from "../components/EmployerBenefits";
import EmployerGrowth from "../components/EmployerGrowth";
import EmployerTestimonials from "../components/EmployerTestimonials";
import EmployerVacancies from "../components/EmployerVacancies";
import EmployerCTA from "../components/EmployerCTA";

export default function EmployerProfilePage() {
  return (
    <>
      <Navbar />
      <div className="employer-profile-page">
        <EmployerHero />
        <EmployerMission />
        <EmployerLocations />
        <EmployerTeamCulture />
        <EmployerBenefits />
        <EmployerGrowth />
        <EmployerTestimonials />
        <EmployerVacancies />
        <EmployerCTA />
      </div>
    </>
  );
}
