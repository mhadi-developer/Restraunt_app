"use client";

import { SubmitEvent, useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    // TODO: Call your API here
    console.log("Subscribed:", email);

    setEmail("");
  };

  return (
    <section id="newsletter">
      <div className="nlbg"></div>

      <div className="container">
        <div className="nlw text-center" data-aos="zoom-in">
          <span
            className="slbl"
            style={{ color: "rgba(255,255,255,.7)" }}
          >
            Stay Connected
          </span>

          <h2
            className="mb-3"
            style={{ color: "#fff" }}
          >
            Subscribe &amp; Get Exclusive{" "}
            <span style={{ color: "var(--secondary)" }}>
              Deals
            </span>
          </h2>

          <p
            className="mb-4"
            style={{ color: "rgba(255,255,255,.78)" }}
          >
            Get 15% off your first order plus early access to new menu
            items
          </p>

          <form
            className="nl-form-wrap"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              className="nlinput"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="nlbtn"
            >
              <i className="fas fa-paper-plane me-1"></i>
              Subscribe
            </button>
          </form>

          <p
            style={{
              color: "rgba(255,255,255,.45)",
              fontSize: ".76rem",
              marginTop: "11px",
            }}
          >
            <i className="fas fa-lock me-1"></i>
            No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}