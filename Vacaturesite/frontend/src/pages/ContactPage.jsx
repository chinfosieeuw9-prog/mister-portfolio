import React, { useState } from "react";
import Navbar from "../components/Navbar";

export default function ContactPage() {
  const [fields, setFields] = useState({ name: "", email: "", subject: "", message: "", phone: "", consent: false, honeypot: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFields((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!fields.name || !fields.email || !fields.subject || !fields.message) {
      setError("Vul alle verplichte velden in.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(fields.email)) {
      setError("Vul een geldig e-mailadres in.");
      return false;
    }
    if (!fields.consent) {
      setError("Geef toestemming voor verwerking van je gegevens.");
      return false;
    }
    if (fields.honeypot) {
      setError("Spam gedetecteerd.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) setSuccess(true);
  };

  return (
    <>
      <Navbar />
      <div className="contact-page">
        <h1>Contact</h1>
        <div className="contact-intro">Vragen over een vacature of samenwerking? Neem direct contact op. We reageren binnen 1 werkdag.</div>
        <div className="contact-channels">
          <div><strong>Telefoon:</strong> 076-1234567 (09:00–17:00)</div>
          <div><strong>E‑mail:</strong> info@zorgsite.nl</div>
          <div><strong>WhatsApp:</strong> 06-98765432 (kantooruren)</div>
          <div><strong>Adres:</strong> Zorgplein 1, 4811AA Breda</div>
          <div className="contact-socials">Volg ons: <a href="#">LinkedIn</a> <a href="#">Facebook</a></div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit} autoComplete="off">
          <label>Naam*</label>
          <input name="name" value={fields.name} onChange={handleChange} required />
          <label>E‑mail*</label>
          <input name="email" type="email" value={fields.email} onChange={handleChange} required />
          <label>Onderwerp*</label>
          <select name="subject" value={fields.subject} onChange={handleChange} required>
            <option value="">Kies onderwerp...</option>
            <option value="kandidaat">Vraag van kandidaat</option>
            <option value="werkgever">Vraag van werkgever</option>
            <option value="partner">Samenwerking/overig</option>
          </select>
          <label>Telefoon (optioneel)</label>
          <input name="phone" type="tel" value={fields.phone} onChange={handleChange} />
          <label>Bericht*</label>
          <textarea name="message" value={fields.message} onChange={handleChange} required />
          <div style={{ display: "none" }}>
            <label>Laat dit veld leeg</label>
            <input name="honeypot" value={fields.honeypot} onChange={handleChange} autoComplete="off" />
          </div>
          <label>
            <input type="checkbox" name="consent" checked={fields.consent} onChange={handleChange} required />
            Ik ga akkoord dat mijn gegevens worden gebruikt om mijn vraag te beantwoorden.
          </label>
          <button className="btn-primary" type="submit">Verstuur</button>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">Bedankt voor je bericht! We reageren binnen 1 werkdag.</div>}
        </form>
        <div className="contact-sla">We reageren binnen 1 werkdag. Bel ons bij spoed: 076-1234567 (09:00–17:00). Liever appen? Stuur ons een bericht via WhatsApp.</div>
      </div>
    </>
  );
}
