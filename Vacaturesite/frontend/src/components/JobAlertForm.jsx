import React, { useState } from "react";

const FUNCTION_OPTIONS = [
  "Thuisbegeleider",
  "VIG",
  "Verpleegkundige",
  "Begeleider",
];
const REGIO_OPTIONS = [
  "Breda",
  "Roosendaal",
  "Bergen op Zoom",
  "Straal 10km",
  "Straal 25km",
];
const DOELGROEP_OPTIONS = ["VVT", "GGZ", "GZ", "Jeugd"];
const UREN_OPTIONS = [
  { label: "8–16", value: "8-16" },
  { label: "16–24", value: "16-24" },
  { label: "24–32", value: "24-32" },
  { label: "32–36+", value: "32-36+" },
];
const FREQUENCY_OPTIONS = [
  { label: "Direct", value: "direct" },
  { label: "Dagelijks", value: "dagelijks" },
  { label: "Wekelijks", value: "wekelijks" },
];

export default function JobAlertForm({ presetFilters = {} }) {
  const [fields, setFields] = useState({
    functies: presetFilters.functies || [],
    regio: presetFilters.regio || "",
    doelgroep: presetFilters.doelgroep || "",
    uren: presetFilters.uren || "",
    frequency: "wekelijks",
    email: "",
    consent: false,
    generic: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    if (type === "checkbox") {
      setFields((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "select-multiple") {
      const vals = Array.from(options).filter((o) => o.selected).map((o) => o.value);
      setFields((prev) => ({ ...prev, [name]: vals }));
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    if (!fields.email) {
      setError("Vul je e-mailadres in.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(fields.email)) {
      setError("Vul een geldig e-mailadres in.");
      return false;
    }
    if (!fields.consent) {
      setError("Geef toestemming voor het ontvangen van job alerts.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="alert-success">
        Alert aangemaakt. Je ontvangt wekelijks een overzicht met nieuwe vacatures die passen bij jouw voorkeuren.
      </div>
    );
  }

  return (
    <form className="job-alert-form" onSubmit={handleSubmit}>
      <div className="form-explainer">Mis geen zorgvacatures in West‑Brabant. Stel je voorkeuren in en ontvang gerichte updates in je inbox.</div>
      <label>Functie(s)</label>
      <select name="functies" multiple value={fields.functies} onChange={handleChange}>
        {FUNCTION_OPTIONS.map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
      <label>Regio</label>
      <select name="regio" value={fields.regio} onChange={handleChange}>
        <option value="">Kies regio...</option>
        {REGIO_OPTIONS.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <label>Doelgroep</label>
      <select name="doelgroep" value={fields.doelgroep} onChange={handleChange}>
        <option value="">Kies doelgroep...</option>
        {DOELGROEP_OPTIONS.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <label>Uren per week</label>
      <select name="uren" value={fields.uren} onChange={handleChange}>
        <option value="">Kies uren...</option>
        {UREN_OPTIONS.map((u) => (
          <option key={u.value} value={u.value}>{u.label}</option>
        ))}
      </select>
      <label>Frequentie</label>
      <select name="frequency" value={fields.frequency} onChange={handleChange}>
        {FREQUENCY_OPTIONS.map((f) => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>
      <label>E‑mail*</label>
      <input name="email" type="email" value={fields.email} onChange={handleChange} required />
      <label>
        <input type="checkbox" name="consent" checked={fields.consent} onChange={handleChange} />
        Ik geef toestemming voor het ontvangen van job alerts per e‑mail.
      </label>
      <label>
        <input type="checkbox" name="generic" checked={fields.generic} onChange={handleChange} />
        Houd mijn alert generiek (geen personalisatie).
      </label>
      <button className="btn-primary" type="submit">Maak alert voor West‑Brabant</button>
      {error && <div className="form-error">{error}</div>}
      <div className="privacy-hint">
        Je ontvangt een bevestigingsmail met beheerlink. Lees meer in onze <a href="/privacy">privacyverklaring</a>.
      </div>
    </form>
  );
}
