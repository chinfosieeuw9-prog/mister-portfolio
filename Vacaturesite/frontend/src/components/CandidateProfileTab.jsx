import React, { useState } from "react";

export default function CandidateProfileTab() {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    region: "",
    hours: "",
    startDate: "",
    shift: "",
    license: false,
    skills: "",
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setSaved(false);
  };

  const validate = () => {
    if (!fields.name || !fields.email || !fields.phone) {
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
    setError("");
    return true;
  };

  const handleBlur = () => {
    if (validate()) setSaved(true);
  };

  return (
    <form className="candidate-profile-tab">
      <h2>Profiel</h2>
      <input name="name" value={fields.name} onChange={handleChange} onBlur={handleBlur} placeholder="Naam*" />
      <input name="email" value={fields.email} onChange={handleChange} onBlur={handleBlur} placeholder="E‑mail*" type="email" />
      <input name="phone" value={fields.phone} onChange={handleChange} onBlur={handleBlur} placeholder="Telefoon*" type="tel" />
      <input name="region" value={fields.region} onChange={handleChange} onBlur={handleBlur} placeholder="Regio (bijv. Breda)" />
      <input name="hours" value={fields.hours} onChange={handleChange} onBlur={handleBlur} placeholder="Uren per week" type="number" />
      <input name="startDate" value={fields.startDate} onChange={handleChange} onBlur={handleBlur} placeholder="Startdatum" type="date" />
      <select name="shift" value={fields.shift} onChange={handleChange} onBlur={handleBlur}>
        <option value="">Dienstvoorkeur...</option>
        <option value="dag">Dag</option>
        <option value="avond">Avond</option>
        <option value="nacht">Nacht</option>
      </select>
      <label>
        <input type="checkbox" name="license" checked={fields.license} onChange={handleChange} />
        Rijbewijs B
      </label>
      <textarea name="skills" value={fields.skills} onChange={handleChange} onBlur={handleBlur} placeholder="Skills/competenties" />
      {error && <div className="form-error">{error}</div>}
      {saved && <div className="form-saved">Opgeslagen</div>}
      <div className="profile-completeness">Profielcompleetheid: 80%</div>
    </form>
  );
}
