import React from "react";
import { Link } from "react-router-dom";
import PublicFooter from "./PublicFooter";

const PublicAuthLayout: React.FC<{
  eyebrow: string;
  title: string;
  text: string;
  children: React.ReactNode;
}> = ({ eyebrow, title, text, children }) => (
  <div className="auth-page">
    <header className="auth-nav">
      <Link to="/" className="public-brand">
        <span className="brand-mark">+</span>
        <span>careline</span>
      </Link>
      <Link to="/" className="auth-back">
        Back to home <span>↖</span>
      </Link>
    </header>
    <main className="auth-main">
      <div className="auth-aside">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
        <div className="auth-aside-mark">✦</div>
      </div>
      <section className="auth-form-panel">
        <div className="auth-form-heading">
          <p className="eyebrow">Careline account</p>
          <h2>
            {title === "Welcome back."
              ? "Welcome back."
              : "Create your account."}
          </h2>
          <p>Manage appointments and stay close to your care team.</p>
        </div>
        {children}
      </section>
    </main>
    <PublicFooter />
  </div>
);

export default PublicAuthLayout;
