import React, { useState } from "react";

export default function ApplyStep1({ onNext, data }) {
  const [fields, setFields] = useState({
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    phone: data.phone || "",
    motivation: data.motivation || "",
    cv: null,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const validate = () => {
    if (!fields.firstName || !fields.lastName || !fields.email || !fields.phone) {
      setError("Vul alle verplichte velden in.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(fields.email)) {
      setError("Vul een geldig e-mailadres in.");
      return false;
    }
    if (!/^\d{9,}$/.test(fields.phone.replace(/\D/g, ""))) {
      setError("Vul een geldig telefoonnummer in (min. 9 cijfers).");
      return false;
    }
    if (fields.cv && fields.cv.size > 5 * 1024 * 1024) {
      setError("Cv mag maximaal 5 MB zijn.");
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
      <h2>Stap 1: Jouw gegevens</h2>
      <input name="firstName" value={fields.firstName} onChange={handleChange} placeholder="Voornaam*" required />
      <input name="lastName" value={fields.lastName} onChange={handleChange} placeholder="Achternaam*" required />
      <input name="email" value={fields.email} onChange={handleChange} placeholder="E‑mail*" required type="email" />
      <input name="phone" value={fields.phone} onChange={handleChange} placeholder="Telefoon*" required type="tel" />
      <label>Cv (PDF/DOC, max. 5 MB)</label>
      <input name="cv" type="file" accept=".pdf,.doc,.docx" onChange={handleChange} />
      <textarea name="motivation" value={fields.motivation} onChange={handleChange} maxLength={500} placeholder="Vertel kort waarom deze rol bij je past (optioneel)" />
      <button className="btn-primary" type="submit">Verder</button>
      {error && <div className="form-error">{error}</div>}
      <div className="privacy-hint">Sollicitatiegegevens worden uiterlijk na 4 weken verwijderd na afronding van de procedure, tenzij je toestemming geeft voor 12 maanden bewaartermijn.</div>
    </form>
  );
}
