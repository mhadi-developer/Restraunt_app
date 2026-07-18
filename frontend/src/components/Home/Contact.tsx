"use client";

import { SubmitEvent, useState } from "react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(formData);

    // TODO: Send data to your API

    setIsSubmitted(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "General Inquiry",
      message: "",
    });

    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <section id="contact-section">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="slbl">Get In Touch</span>

          <h2 className="stitle">
            Contact <span>Us</span>
          </h2>

          <div className="sline"></div>

          <p
            className="sdesc mx-auto"
            style={{ maxWidth: "480px" }}
          >
            Have a question, feedback, or want to plan a special event?
            We&apos;d love to hear from you.
          </p>
        </div>

        <div className="row g-4">
          {/* Contact Info */}
          <div className="col-lg-4" data-aos="fade-right">
            <div className="ctdark">
              <h4>Let&apos;s Talk</h4>

              <p className="ctsub">
                We typically respond within 2 hours during business hours.
              </p>

              <div className="ctitem">
                <div className="cticon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>

                <div className="ctinfo">
                  <strong>Address</strong>

                  <span>
                    42 Flavor Street, Manhattan,
                    <br />
                    New York, NY 10001
                  </span>
                </div>
              </div>

              <div className="ctitem">
                <div className="cticon">
                  <i className="fas fa-phone-alt"></i>
                </div>

                <div className="ctinfo">
                  <strong>Phone</strong>
                  <span>+1 (800) 123-4567</span>
                </div>
              </div>

              <div className="ctitem">
                <div className="cticon">
                  <i className="fas fa-envelope"></i>
                </div>

                <div className="ctinfo">
                  <strong>Email</strong>
                  <span>hello@sarabfood.com</span>
                </div>
              </div>

              <div className="ctitem">
                <div className="cticon">
                  <i className="fas fa-clock"></i>
                </div>

                <div className="ctinfo">
                  <strong>Working Hours</strong>
                  <span>Wed - Sun: 9 AM - 11 PM</span>
                </div>
              </div>

              <div className="ctsocrow">
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>

                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>

                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>

                <a href="#">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-8" data-aos="fade-left">
            <div className="fcard">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="flbl">Your Name *</label>

                    <input
                      type="text"
                      name="name"
                      className="fctrl"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="flbl">Email Address *</label>

                    <input
                      type="email"
                      name="email"
                      className="fctrl"
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="flbl">Phone Number</label>

                    <input
                      type="tel"
                      name="phone"
                      className="fctrl"
                      placeholder="+1 (800) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="flbl">Subject *</label>

                    <select
                      name="subject"
                      className="fctrl"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option>General Inquiry</option>
                      <option>Catering &amp; Events</option>
                      <option>Feedback</option>
                      <option>Partnership</option>
                      <option>Media &amp; Press</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="flbl">Message *</label>

                    <textarea
                      name="message"
                      className="fctrl"
                      rows={5}
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn-red"
                    >
                      <i className="fas fa-paper-plane"></i>{" "}
                      Send Message
                    </button>
                  </div>
                </div>
              </form>

              {isSubmitted && (
                <div className="sucmsg">
                  <i className="fas fa-check-circle"></i>

                  <p>
                    Message sent! We&apos;ll reply within 2 hours.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}