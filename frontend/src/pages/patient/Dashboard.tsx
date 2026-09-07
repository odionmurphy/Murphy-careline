import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuthStore } from "../../store/authStore";
import { doctors } from "../../services/demoData";
import { getPatientAppointments } from "../../services/appointmentService";
import { Appointment } from "../../types";

const PatientDashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.name?.trim().split(" ")[0] || "there";
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    getPatientAppointments()
      .then(setAppointments)
      .catch(() => setAppointments([]));
  }, []);

  const nextAppointment = appointments[0];

  return (
    <DashboardLayout>
      <div className="page-wrap">
        <section className="welcome-row">
          <div>
            <p className="eyebrow">Your patient requests</p>
            <h1>Welcome, {firstName}.</h1>
            <p className="muted">
              Your health, appointments, and care team in one calm place.
            </p>
          </div>
          <Link to="/patient/book" className="primary-button">
            Book an appointment <span>+</span>
          </Link>
        </section>
        <section className="stats-grid">
          <div className="stat-card accent">
            <span>Next appointment</span>
            <strong>
              {nextAppointment
                ? `${nextAppointment.date}, ${nextAppointment.time}`
                : "None scheduled"}
            </strong>
            <small>
              {nextAppointment?.doctor || "Book a visit when you are ready."}
            </small>
          </div>
          <div className="stat-card">
            <span>Care plan</span>
            <strong>Not started</strong>
            <small>Your care plan will appear here.</small>
          </div>
          <div className="stat-card">
            <span>Health records</span>
            <strong>0 documents</strong>
            <small>Your records will appear here.</small>
          </div>
        </section>
        <div className="content-grid">
          <section>
            <div className="section-head">
              <div>
                <p className="eyebrow">Your schedule</p>
                <h2>Upcoming appointments</h2>
              </div>
              <Link to="/patient/appointments" className="text-link">
                View all
              </Link>
            </div>
            <div className="stack">
              {appointments.length > 0 ? (
                appointments.slice(0, 2).map((appointment) => (
                  <div key={appointment.id} className="appointment-card">
                    <div className="avatar coral">{appointment.initials}</div>
                    <div className="appointment-main">
                      <div className="appointment-heading">
                        <div>
                          <h3>{appointment.doctor}</h3>
                          <p>{appointment.specialty}</p>
                        </div>
                        <span
                          className={`status ${appointment.status.toLowerCase()}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                      <div className="appointment-meta">
                        <span>{appointment.date}</span>
                        <span>{appointment.time}</span>
                        <span>{appointment.mode}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  You do not have any appointments yet.
                  <Link to="/patient/book" className="text-link">
                    Book your first visit
                  </Link>
                </div>
              )}
            </div>
          </section>
          <aside className="side-panel">
            <div className="section-head">
              <div>
                <p className="eyebrow">Your care team</p>
                <h2>Specialists</h2>
              </div>
            </div>
            {doctors.slice(0, 2).map((doctor) => (
              <div className="doctor-row" key={doctor.id}>
                <div className={`avatar ${doctor.tone}`}>{doctor.initials}</div>
                <div>
                  <strong>{doctor.name}</strong>
                  <span>{doctor.specialty}</span>
                </div>
                <span className="rating">★ {doctor.rating}</span>
              </div>
            ))}
            <Link to="/patient/book" className="outline-button full">
              Browse specialists
            </Link>
          </aside>
        </div>
        <section className="tip-banner">
          <div className="tip-icon">✦</div>
          <div>
            <strong>Make space for your health</strong>
            <p>
              Small check-ins make a big difference. Your next appointment is a
              good moment to share any changes.
            </p>
          </div>
          <button className="close-tip">×</button>
        </section>
      </div>
    </DashboardLayout>
  );
};
export default PatientDashboard;
