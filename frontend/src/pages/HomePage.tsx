import React from "react";
import { Link } from "react-router-dom";
import PublicFooter from "../components/PublicFooter";
import { doctors } from "../services/demoData";

const services = [
  {
    icon: "↗",
    title: "Video consultations",
    text: "Talk to a qualified clinician from wherever you feel most comfortable.",
  },
  {
    icon: "◷",
    title: "Flexible scheduling",
    text: "Find a time that fits your life, with clear availability and no phone tag.",
  },
  {
    icon: "⌁",
    title: "Connected care",
    text: "Keep appointments, follow-ups, and your care team together in one place.",
  },
];

const HomePage: React.FC = () => (
  <div className="public-page">
    <header className="public-nav">
      <Link to="/" className="public-brand">
        <span className="brand-mark">+</span>
        <span>careline</span>
      </Link>
      <nav className="public-nav-links" aria-label="Main navigation">
        <a href="#services">Services</a>
        <a href="#doctors">Our doctors</a>
        <a href="#approach">Our approach</a>
      </nav>
      <div className="public-nav-actions">
        <Link to="/login" className="nav-login">
          Log in
        </Link>
        <Link to="/register" className="primary-button">
          Get started <span>↗</span>
        </Link>
      </div>
    </header>

    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Care that meets you where you are</p>
          <h1>Feel better about your next appointment.</h1>
          <p className="hero-text">
            Careline makes it simple to find trusted specialists, book a visit,
            and stay connected to the care you need.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="primary-button hero-button">
              Find your care team <span>↗</span>
            </Link>
            <a href="#services" className="text-link hero-secondary">
              Explore services <span>↓</span>
            </a>
          </div>
          <div className="hero-proof">
            <div className="proof-avatars">
              <span>MP</span>
              <span>JW</span>
              <span>SM</span>
              <span>+</span>
            </div>
            <p>
              <strong>4.9/5 patient rating</strong>
              <br />
              Care from people who listen.
            </p>
          </div>
        </div>
        <div className="hero-visual" aria-label="Careline appointment preview">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="consultation-card">
            <div className="consultation-top">
              <span className="live-dot" /> Next available
            </div>
            <div className="consultation-doctor">
              <div className="large-avatar coral">MP</div>
              <div>
                <strong>Dr. Maya Patel</strong>
                <span>Family medicine</span>
              </div>
              <b>4.9 ★</b>
            </div>
            <div className="consultation-time">
              <span>Today</span>
              <strong>4:30 PM</strong>
              <small>Video consultation</small>
            </div>
            <Link to="/register" className="outline-button full">
              Reserve this time <span>→</span>
            </Link>
          </div>
          <div className="floating-note note-top">
            <span>✦</span>
            <div>
              <strong>Care, on your terms</strong>
              <small>Simple. Personal. Secure.</small>
            </div>
          </div>
          <div className="floating-note note-bottom">
            <strong>12k+</strong>
            <small>visits supported</small>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <span>Designed around real life</span>
        <span>Available when you need us</span>
        <span>Built for better conversations</span>
      </section>

      <section className="public-section services-section" id="services">
        <div className="section-intro">
          <p className="eyebrow">A calmer way to care</p>
          <h2>Everything you need for the next step.</h2>
          <p>
            From your first search to your follow-up, Careline keeps the
            experience clear and considered.
          </p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <span className="service-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <Link to="/register" className="text-link">
                Learn more →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section doctors-section" id="doctors">
        <div className="section-intro row-intro">
          <div>
            <p className="eyebrow">People you can trust</p>
            <h2>Meet your care team.</h2>
          </div>
          <Link to="/register" className="outline-button">
            Browse all doctors <span>→</span>
          </Link>
        </div>
        <div className="doctor-showcase">
          {doctors.map((doctor) => (
            <article className="showcase-doctor" key={doctor.id}>
              <div className={`showcase-avatar ${doctor.tone}`}>
                {doctor.initials}
              </div>
              <div>
                <h3>{doctor.name}</h3>
                <p>{doctor.specialty}</p>
                <span>{doctor.experience}</span>
              </div>
              <b>★ {doctor.rating}</b>
            </article>
          ))}
        </div>
      </section>

      <section className="approach-section" id="approach">
        <div className="approach-panel">
          <div>
            <p className="eyebrow">The Careline approach</p>
            <h2>
              Medicine is personal.
              <br />
              The experience should be too.
            </h2>
          </div>
          <div className="approach-copy">
            <p>
              Good care starts with being heard. We give you a simple,
              thoughtful place to manage visits and build a relationship with
              your care team.
            </p>
            <Link to="/register" className="primary-button">
              Start your care journey <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
    <PublicFooter />
  </div>
);

export default HomePage;
