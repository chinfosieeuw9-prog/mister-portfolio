import React from "react";

const FAQS = [
  {
    q: "Welke CAO’s gelden hier?",
    a: "CAO VVT, GGZ, Ziekenhuizen en Gehandicaptenzorg zijn van toepassing. Bekijk werkgeversprofielen voor details.",
  },
  {
    q: "Heb ik BIG/VOG nodig in de thuiszorg?",
    a: "Voor veel functies is een VOG vereist; BIG geldt voor verpleegkundige beroepen. Filter vacatures of bekijk werkgeversprofielen.",
  },
  {
    q: "Kan ik zonder auto werken?",
    a: "Ja, veel locaties zijn bereikbaar met OV of fiets. Bekijk vacatures per plaats voor reistijd en bereikbaarheid.",
  },
];

export default function RegiohubFAQ() {
  return (
    <section className="regiohub-faq">
      <h2>Veelgestelde vragen regio</h2>
      <ul>
        {FAQS.map((f, i) => (
          <li key={i}>
            <strong>{f.q}</strong>
            <p>{f.a}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
