import React, { useState } from "react";

export default function ApplyStep3({ data }) {
  const [consent, setConsent] = useState({
    procedure: false,
    retention: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e) => {
    const { name, checked } = e.target;
    setConsent((prev) => ({ ...prev, [name]: checked }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consent.procedure) return;
    setSubmitted(true);
  };
  if (submitted) {
    return (
      <div className="apply-step apply-confirm">
        <h2>Bedankt voor je sollicitatie!</h2>
        <p>Je ontvangt direct een bevestiging per e‑mail. Binnen 48 uur hoor je van ons.</p>
        <div className="apply-docs-checklist">
          <strong>Documentenchecklist:</strong>
          <ul>
            <li>Cv (verplicht)</li>
            <li>Diploma(’s)</li>
            <li>BIG-bewijs (indien van toepassing)</li>
            <li>VOG (of bereid aan te vragen)</li>
            <li>BHV (indien aanwezig)</li>
          </ul>
        </div>
        <button className="btn-secondary">Upload documenten</button>
        <button className="btn-secondary">Plan een kort belmoment</button>
      </div>
    );
  }
  return (
    <form className="apply-step" onSubmit={handleSubmit}>
      <h2>Stap 3: Toestemming & bevestiging</h2>
      <label>
        <input type="checkbox" name="procedure" checked={consent.procedure} onChange={handleChange} required />
        Ik ga akkoord met verwerking van mijn sollicitatiegegevens t.b.v. deze procedure.
      </label>
      <label>
        <input type="checkbox" name="retention" checked={consent.retention} onChange={handleChange} />
        Bewaar mijn gegevens voor toekomstige vacatures tot 12 maanden (optioneel).
      </label>
      <button className="btn-primary" type="submit">Verstuur sollicitatie</button>
      <div className="privacy-hint">Sollicitatiegegevens worden uiterlijk na 4 weken verwijderd na afronding van de procedure, tenzij je toestemming geeft voor 12 maanden bewaartermijn.</div>
    </form>
  );
}
