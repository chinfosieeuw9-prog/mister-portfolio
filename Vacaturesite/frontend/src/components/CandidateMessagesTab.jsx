import React from "react";

const MESSAGES = [
  {
    id: 1,
    thread: [
      { from: "Kandidaat", text: "Bedankt voor de uitnodiging!", read: true },
      { from: "Recruiter", text: "Graag tot het interview op 15/11.", read: true },
    ],
  },
];

export default function CandidateMessagesTab() {
  return (
    <div className="candidate-messages-tab">
      <h2>Berichten</h2>
      {MESSAGES.map((msg) => (
        <div key={msg.id} className="message-thread">
          {msg.thread.map((m, i) => (
            <div key={i} className={m.from === "Kandidaat" ? "from-candidate" : "from-recruiter"}>
              <strong>{m.from}:</strong> {m.text} {m.read && <span className="read-receipt">✓</span>}
            </div>
          ))}
          <input placeholder="Snel antwoord..." />
          <button>Verstuur</button>
        </div>
      ))}
      <div className="message-hint">Notificaties bij nieuwe berichten per e‑mail/sms en in‑app.</div>
    </div>
  );
}
