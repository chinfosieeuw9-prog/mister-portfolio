import React from "react";

export default function EmployerTestimonials() {
  return (
    <section className="employer-testimonials">
      <h2>Reviews & testimonials</h2>
      <ul>
        <li>
          <img src="/team1.jpg" alt="Fatima, Verpleegkundige" className="testimonial-photo" />
          <blockquote>“Ik voel me gewaardeerd en krijg ruimte om te groeien.”</blockquote>
          <div className="testimonial-meta">Fatima, Verpleegkundige</div>
        </li>
        <li>
          <img src="/team2.jpg" alt="Jan, Begeleider" className="testimonial-photo" />
          <blockquote>“Het teamgevoel is hier echt bijzonder.”</blockquote>
          <div className="testimonial-meta">Jan, Begeleider</div>
        </li>
      </ul>
      <button className="btn-secondary">Meer verhalen</button>
    </section>
  );
}
