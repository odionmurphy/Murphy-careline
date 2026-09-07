import React from "react";
import { Link } from "react-router-dom";

const PublicFooter: React.FC = () => (
  <footer className="public-footer">
    <div className="footer-main">
      <div className="footer-brand">
        <Link to="/" className="public-brand">
          <span className="brand-mark">+</span>
          <span>careline</span>
        </Link>
        <p>Better care, closer to home.</p>
      </div>
      <div className="footer-links">
        <div>
          <strong>Care</strong>
          <Link to="/register">Find a doctor</Link>
          <Link to="/register">For patients</Link>
          <Link to="/register">For clinicians</Link>
        </div>
        <div>
          <strong>Company</strong>
          <a href="#services">Our services</a>
          <a href="#approach">Our approach</a>
          <a href="mailto:hello@careline.health">Contact us</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2026 Careline Health</span>
      <span>Private, secure, human.</span>
    </div>
  </footer>
);

export default PublicFooter;
