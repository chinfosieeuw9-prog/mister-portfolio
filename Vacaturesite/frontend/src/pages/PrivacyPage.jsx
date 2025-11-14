import React from "react";
import Navbar from "../components/Navbar";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="privacy-page">
        <h1>Privacy & AVG</h1>
        <div className="privacy-intro">Wij verwerken je gegevens zorgvuldig en transparant volgens de AVG. Op deze pagina lees je waarvoor we gegevens gebruiken, hoe lang we die bewaren en welke rechten je hebt.</div>
        <section>
          <h2>Wie is verantwoordelijk?</h2>
          <p>Zorgsite West‑Brabant, Zorgplein 1, 4811AA Breda, privacy@zorgsite.nl</p>
        </section>
        <section>
          <h2>Welke gegevens verwerken we en waarom?</h2>
          <ul>
            <li>Sollicitaties: uitvoering overeenkomst/legitiem belang</li>
            <li>Job alerts: alleen met toestemming</li>
            <li>Contactformulier: legitiem belang</li>
            <li>Analytics/cookies: alleen met toestemming voor tracking</li>
          </ul>
        </section>
        <section>
          <h2>Welke gegevens verzamelen we?</h2>
          <ul>
            <li>Identificatie- en contactgegevens</li>
            <li>Sollicitatiegegevens en documenten (BIG/VOG)</li>
            <li>Gebruiksdata (analytics, cookies)</li>
          </ul>
        </section>
        <section>
          <h2>Bewaartermijnen</h2>
          <ul>
            <li>Sollicitaties: 4 weken na afronding, of 12 maanden met toestemming</li>
            <li>Job alerts: tot intrekking</li>
            <li>Contactvragen: max. 6 maanden</li>
          </ul>
          <div className="privacy-hint">Na afronding van de procedure verwijderen we je gegevens binnen 4 weken, tenzij je toestemming geeft om ze 12 maanden te bewaren voor toekomstige vacatures.</div>
        </section>
        <section>
          <h2>Ontvangers en verwerkers</h2>
          <ul>
            <li>Hosting, ATS, e‑mail, cookie/analytics‑providers</li>
            <li>Geen overdracht buiten EU zonder waarborgen</li>
          </ul>
        </section>
        <section>
          <h2>Jouw rechten</h2>
          <ul>
            <li>Inzage, rectificatie, verwijdering, beperking, dataportabiliteit</li>
            <li>Bezwaar, intrekken toestemming, klachtrecht AP</li>
          </ul>
        </section>
        <section>
          <h2>Beveiliging</h2>
          <ul>
            <li>Technische en organisatorische maatregelen</li>
            <li>2FA, autorisaties, auditlogs</li>
          </ul>
        </section>
        <section>
          <h2>Cookies</h2>
          <p>We vragen alleen toestemming voor cookies die niet strikt noodzakelijk zijn. Je kunt je keuze altijd aanpassen. Zie ook ons cookiestatement.</p>
        </section>
      </div>
    </>
  );
}
