import React from "react";

export default function JobPostingPreview({ data }) {
  if (!data) return null;
  // Genereer JSON-LD JobPosting
  const jobPosting = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: data.title,
    description: data.description,
    datePosted: data.datePosted,
    validThrough: data.validThrough,
    employmentType: data.contractType,
    hiringOrganization: {
      "@type": "Organization",
      name: data.employer,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: data.location,
        addressRegion: data.region,
        addressCountry: data.country,
      },
    },
    directApply: data.directApply,
    baseSalary: data.salaryMin && data.salaryMax ? {
      "@type": "MonetaryAmount",
      currency: data.salaryCurrency,
      value: {
        "@type": "QuantitativeValue",
        minValue: Number(data.salaryMin),
        maxValue: Number(data.salaryMax),
        unitText: data.salaryUnit,
      },
    } : undefined,
  };

  return (
    <div className="job-posting-preview">
      <h2>Preview & publicatie-checklist</h2>
      <div className="preview-block">
        <strong>{data.title}</strong> ({data.hoursMin}–{data.hoursMax} u/wk, {data.contractType})<br />
        {data.intro && <em>{data.intro}</em>}<br />
        <div dangerouslySetInnerHTML={{ __html: data.description }} />
        <div>Locatie: {data.location} ({data.region})</div>
        <div>Werkgever: {data.employer}</div>
        <div>Salaris: {data.salaryMin}–{data.salaryMax} {data.salaryCurrency} / {data.salaryUnit}</div>
        <div>CAO: {data.cao}</div>
        <div>Labels: {data.labels && data.labels.join(", ")}</div>
        <div>Vereisten: {data.qualifications && data.qualifications.join(", ")}{data.bigRequired && ", BIG"}{data.vogRequired && ", VOG"}</div>
        <div>Benefits: {data.benefits}</div>
        <div>Direct apply: {data.directApply ? "Ja" : "Nee"}</div>
        <div>Distributie: {data.channels && data.channels.join(", ")}</div>
      </div>
      <h3>JobPosting JSON-LD</h3>
      <pre>{JSON.stringify(jobPosting, null, 2)}</pre>
      <div className="checklist">
        <h4>Checklist</h4>
        <ul>
          <li>Titel, salaris, locatie consistent in velden en tekst</li>
          <li>BIG/VOG eisen genoemd in velden én beschrijving indien gemarkeerd</li>
          <li>Geen dubbele vacature (zelfde titel+werkgever+locatie recent?)</li>
          <li>JobPosting JSON-LD gevalideerd</li>
        </ul>
      </div>
    </div>
  );
}
