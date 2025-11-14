import React, { useState } from "react";

const DOC_TYPES = [
  { key: "cv", label: "Cv" },
  { key: "diploma", label: "Diploma's" },
  { key: "big", label: "BIG-bewijs" },
  { key: "vog", label: "VOG" },
  { key: "bhv", label: "BHV/overig" },
];

export default function CandidateDocumentsTab() {
  const [docs, setDocs] = useState({
    cv: {},
    diploma: {},
    big: {},
    vog: {},
    bhv: {},
  });
  const [error, setError] = useState("");

  const handleFile = (type, file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      setError("Bestand te groot (max. 5 MB).");
      return;
    }
    setDocs((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        file,
        status: "geüpload",
        issued: new Date().toISOString().slice(0, 10),
        expires: type === "big" || type === "vog" ? "2026-01-01" : "",
      },
    }));
    setError("");
  };

  return (
    <div className="candidate-documents-tab">
      <h2>Documenten</h2>
      {DOC_TYPES.map((doc) => (
        <div key={doc.key} className="doc-upload-block">
          <label>{doc.label}</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFile(doc.key, e.target.files[0])}
          />
          {docs[doc.key].file && (
            <div className="doc-status">
              Status: {docs[doc.key].status} | Uitgegeven op: {docs[doc.key].issued}
              {docs[doc.key].expires && (
                <> | Verloopt op: {docs[doc.key].expires}</>
              )}
            </div>
          )}
        </div>
      ))}
      <div className="doc-hint">
        Ontbreekt je VOG nog? Vraag ‘m aan via je gemeente of online via je (toekomstig) werkgever.<br />
        <a href="https://www.justis.nl/producten/vog/">Meer info over VOG aanvragen</a> | <a href="https://www.bigregister.nl/">BIG-register</a>
      </div>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
