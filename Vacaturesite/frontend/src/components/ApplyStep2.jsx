import React, { useState } from "react";

export default function ApplyStep2({ onNext, data }) {
  const [fields, setFields] = useState({
    bigStatus: data.bigStatus || "",
    bigNumber: data.bigNumber || "",
    vogStatus: data.vogStatus || "",
    availability: data.availability || "",
    hours: data.hours || "",
    license: data.license || "",
    adl: data.adl || "",
    adlYears: data.adlYears || "",
    medication: data.medication || "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (fields.bigStatus === "Geldig" && (!fields.bigNumber || !/^\d{8}$/.test(fields.bigNumber))) {
      setError("Vul een geldig BIG-nummer in (8 cijfers).");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext(fields);
    }
  };

  return (
    <form className="apply-step" onSubmit={handleSubmit}>
      <h2>Stap 2: Zorgspecifieke vragen</h2>
      <label>BIG-status*</label>
      <select name="bigStatus" value={fields.bigStatus} onChange={handleChange} required>
        <option value="">Kies...</option>
        <option value="Geldig">Geldig</option>
        <option value="In aanvraag">In aanvraag</option>
        <option value="Niet van toepassing">Niet van toepassing</option>
      </select>
      {fields.bigStatus === "Geldig" && (
        <input name="bigNumber" value={fields.bigNumber} onChange={handleChange} placeholder="BIG-nummer (8 cijfers)" maxLength={8} />
      )}
      <div className="form-hint">Je BIG-nummer staat ook op Mijn BIG-register; verplicht voor bepaalde beroepen.</div>
      <label>VOG-status*</label>
      <select name="vogStatus" value={fields.vogStatus} onChange={handleChange} required>
        <option value="">Kies...</option>
        <option value="Aanwezig">Aanwezig</option>
        <option value="Bereid aan te vragen">Bereid aan te vragen</option>
      </select>
      <div className="form-hint">Nog geen VOG? Je kunt deze eenvoudig aanvragen via je gemeente of Justis.</div>
      <label>Beschikbaarheid*</label>
      <select name="availability" value={fields.availability} onChange={handleChange} required>
        <option value="">Kies...</option>
        <option value="Per direct">Per direct</option>
        <option value="Binnen 1 maand">Binnen 1 maand</option>
        <option value="Later">Later</option>
      </select>
      <label>Gewenste uren per week</label>
      <input name="hours" type="number" min={8} max={40} value={fields.hours} onChange={handleChange} placeholder="Bijv. 24" />
      <label>Rijbewijs B*</label>
      <select name="license" value={fields.license} onChange={handleChange} required>
        <option value="">Kies...</option>
        <option value="Ja">Ja</option>
        <option value="Nee">Nee</option>
      </select>
      <label>ADL/tillift-ervaring*</label>
      <select name="adl" value={fields.adl} onChange={handleChange} required>
        <option value="">Kies...</option>
        <option value="Ja">Ja</option>
        <option value="Nee">Nee</option>
      </select>
      {fields.adl === "Ja" && (
        <input name="adlYears" type="number" min={0} max={40} value={fields.adlYears} onChange={handleChange} placeholder="Jaren ervaring" />
      )}
      <label>Medicatie-bevoegdheid*</label>
      <select name="medication" value={fields.medication} onChange={handleChange} required>
        <option value="">Kies...</option>
        <option value="Ja">Ja</option>
        <option value="Nee">Nee</option>
        <option value="In opleiding">In opleiding</option>
      </select>
      <button className="btn-primary" type="submit">Verder</button>
      {error && <div className="form-error">{error}</div>}
    </form>
  );
}
