import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const isDoctor = user?.role === "doctor";
  const links = isDoctor
    ? [
        ["/dashboard", "Overview"],
        ["/doctor/appointments", "Appointments"],
        ["/doctor/availability", "Availability"],
      ]
    : [
        ["/dashboard", "Overview"],
        ["/patient/appointments", "My appointments"],
        ["/patient/book", "Book a visit"],
      ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate("/dashboard")}>
          <span className="brand-mark">+</span>
          <span>Murphy careline</span>
        </button>
        <NavLink to="/dashboard" className="workspace-label">
          {isDoctor ? "Clinician workspace" : "Patient workspace"}
        </NavLink>
        <nav className="side-nav">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span className="nav-dot" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <NavLink
            to={isDoctor ? "/doctor/availability" : "/patient/book"}
            className="help-panel"
          >
            <strong>
              {isDoctor ? "Shape your week" : "Need a specialist?"}
            </strong>
            <span>
              {isDoctor
                ? "Keep your availability current."
                : "Find the right care for you."}
            </span>
          </NavLink>
          <button
            className="nav-item logout"
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <NavLink to="/dashboard">Careline</NavLink>
            <span>/</span>
            <NavLink to="/dashboard">
              {isDoctor ? "Clinician workspace" : "Patient workspace"}
            </NavLink>
          </nav>
          <div className="profile-chip">
            <div className="mini-avatar">
              {user?.name
                ?.split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2) || "GU"}
            </div>
            <div>
              <strong>{user?.name || "Guest user"}</strong>
              <span>{isDoctor ? "Care team" : "Patient"}</span>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
