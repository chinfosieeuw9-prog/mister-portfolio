import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ApplyStep1 from "../components/ApplyStep1";
import ApplyStep2 from "../components/ApplyStep2";
import ApplyStep3 from "../components/ApplyStep3";

export default function ApplyFlow() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const next = (data) => {
    setFormData({ ...formData, ...data });
    setStep(step + 1);
  };

  return (
    <>
      <Navbar />
      <div className="apply-flow">
        {step === 1 && <ApplyStep1 onNext={next} data={formData} />}
        {step === 2 && <ApplyStep2 onNext={next} data={formData} />}
        {step === 3 && <ApplyStep3 data={formData} />}
      </div>
    </>
  );
}
