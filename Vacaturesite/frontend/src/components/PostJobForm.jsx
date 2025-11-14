import React, { useState } from "react";

const INIT = {
  title: "",
  category: "",
  employer: "",
  logo: null,
  contractType: "",
  hoursMin: "",
  hoursMax: "",
  intro: "",
  description: "",
  labels: [],
  qualifications: [],
  bigRequired: false,
  vogRequired: false,
  license: false,
  adl: false,
  medication: false,
  salaryMin: "",
  salaryMax: "",
  salaryUnit: "MONTH",
  salaryCurrency: "EUR",
  cao: "",
  benefits: "",
  location: "",
  region: "",
  country: "NL",
  remote: false,
  datePosted: new Date().toISOString().slice(0,10),
  validThrough: "",
  directApply: false,
  channels: [],
};

const CONTRACT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACTOR", "TEMPORARY", "INTERN"];
const CATEGORIES = ["VVT", "Thuiszorg", "GGZ", "GZ", "Jeugd"];
const CAOS = ["VVT", "GGZ", "Ziekenhuizen", "Gehandicaptenzorg"];
const LABELS = ["Direct starten", "ZZP mogelijk"];
const QUALIFICATIONS = ["MBO-3", "MBO-4", "VIG", "Verpleegkunde"];
const CHANNELS = ["Eigen site", "Indeed", "LinkedIn", "Regionale boards"];
const REGIONS = ["Breda", "Roosendaal", "Bergen op Zoom", "West-Brabant"];

export default function PostJobForm({ onPreview }) {
  const [fields, setFields] = useState(INIT);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFields((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFields((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "select-multiple") {
      const vals = Array.from(e.target.options).filter(o => o.selected).map(o => o.value);
      setFields((prev) => ({ ...prev, [name]: vals }));
    } else {
      setFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    if (!fields.title || fields.title.length < 5 || fields.title.length > 80) {
      setError("Titel 5–80 tekens verplicht.");
      return false;
    }
    if (!fields.contractType) {
      setError("Contracttype verplicht.");
      return false;
    }
    if (!fields.hoursMin || isNaN(fields.hoursMin) || fields.hoursMin <= 0) {
      setError("Min. uren verplicht en > 0.");
      return false;
    }
    if (fields.hoursMax && (isNaN(fields.hoursMax) || fields.hoursMax < fields.hoursMin)) {
      setError("Max. uren moet ≥ min. uren.");
      return false;
    }
    if (!fields.description || fields.description.split(" ").length < 300) {
      setError("Uitgebreide beschrijving vereist (min. 300 woorden).");
      return false;
    }
    if (fields.bigRequired && !fields.description.toLowerCase().includes("big")) {
      setError("Vermeld BIG in de beschrijving als deze vereist is.");
      return false;
    }
    if (fields.salaryMin && fields.salaryMax && Number(fields.salaryMin) > Number(fields.salaryMax)) {
      setError("Salaris min. ≤ max.");
      return false;
    }
    if (!fields.location && !fields.remote) {
      setError("Minstens één locatie of remote verplicht.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onPreview(fields);
    }
  };

  return (
    <form className="post-job-form" onSubmit={handleSubmit}>
      <h2>Sectie 1 — Basisgegevens</h2>
      <input name="title" value={fields.title} onChange={handleChange} placeholder="Functietitel*" />
      <select name="category" value={fields.category} onChange={handleChange}>
        <option value="">Categorie...</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input name="employer" value={fields.employer} onChange={handleChange} placeholder="Werkgever*" />
      <input name="logo" type="file" accept="image/*" onChange={handleChange} />
      <select name="contractType" value={fields.contractType} onChange={handleChange} required>
        <option value="">Contracttype...</option>
        {CONTRACT_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input name="hoursMin" value={fields.hoursMin} onChange={handleChange} placeholder="Min. uren/week*" type="number" />
      <input name="hoursMax" value={fields.hoursMax} onChange={handleChange} placeholder="Max. uren/week" type="number" />
      <h2>Sectie 2 — Details & Taken</h2>
      <input name="intro" value={fields.intro} onChange={handleChange} placeholder="Korte intro (2–3 zinnen)" />
      <textarea name="description" value={fields.description} onChange={handleChange} placeholder="Uitgebreide beschrijving (min. 300 woorden)" />
      <label>Labels</label>
      <select name="labels" multiple value={fields.labels} onChange={handleChange}>
        {LABELS.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <h2>Sectie 3 — Vereisten</h2>
      <label>Kwalificaties</label>
      <select name="qualifications" multiple value={fields.qualifications} onChange={handleChange}>
        {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
      </select>
      <label>
        <input type="checkbox" name="bigRequired" checked={fields.bigRequired} onChange={handleChange} /> BIG vereist
      </label>
      <div className="form-hint">Voor deze functie kan een geldige BIG‑registratie vereist zijn; controle vindt plaats in het selectieproces.</div>
      <label>
        <input type="checkbox" name="vogRequired" checked={fields.vogRequired} onChange={handleChange} /> VOG vereist
      </label>
      <div className="form-hint">Een VOG kan worden gevraagd. Aanvragen kan via je gemeente of Justis.</div>
      <label>
        <input type="checkbox" name="license" checked={fields.license} onChange={handleChange} /> Rijbewijs B
      </label>
      <label>
        <input type="checkbox" name="adl" checked={fields.adl} onChange={handleChange} /> ADL/tillift-ervaring
      </label>
      <label>
        <input type="checkbox" name="medication" checked={fields.medication} onChange={handleChange} /> Medicatie-bevoegdheid
      </label>
      <h2>Sectie 4 — Arbeidsvoorwaarden</h2>
      <input name="salaryMin" value={fields.salaryMin} onChange={handleChange} placeholder="Salaris min." type="number" />
      <input name="salaryMax" value={fields.salaryMax} onChange={handleChange} placeholder="Salaris max." type="number" />
      <select name="salaryUnit" value={fields.salaryUnit} onChange={handleChange}>
        <option value="MONTH">Per maand</option>
        <option value="HOUR">Per uur</option>
      </select>
      <input name="salaryCurrency" value={fields.salaryCurrency} onChange={handleChange} placeholder="Valuta (EUR)" />
      <select name="cao" value={fields.cao} onChange={handleChange}>
        <option value="">CAO...</option>
        {CAOS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input name="benefits" value={fields.benefits} onChange={handleChange} placeholder="Overige benefits" />
      <h2>Sectie 5 — Locatie(s)</h2>
      <input name="location" value={fields.location} onChange={handleChange} placeholder="Standplaats (plaats)" />
      <select name="region" value={fields.region} onChange={handleChange}>
        <option value="">Regio...</option>
        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      <input name="country" value={fields.country} onChange={handleChange} placeholder="Land (NL)" />
      <label>
        <input type="checkbox" name="remote" checked={fields.remote} onChange={handleChange} /> Remote/Hybride
      </label>
      <h2>Sectie 6 — Publicatie & Distributie</h2>
      <input name="datePosted" value={fields.datePosted} onChange={handleChange} type="date" placeholder="Datum publicatie*" />
      <input name="validThrough" value={fields.validThrough} onChange={handleChange} type="date" placeholder="Einddatum" />
      <label>
        <input type="checkbox" name="directApply" checked={fields.directApply} onChange={handleChange} /> Direct apply
      </label>
      <label>Distributiekanalen</label>
      <select name="channels" multiple value={fields.channels} onChange={handleChange}>
        {CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <button className="btn-primary" type="submit">Preview & check</button>
      {error && <div className="form-error">{error}</div>}
    </form>
  );
}
