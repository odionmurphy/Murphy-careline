import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/DashboardLayout";
import AppointmentCard from "../../components/AppointmentCard";
import {
  confirmAppointment,
  getDoctorAppointments,
} from "../../services/appointmentService";
import { Appointment } from "../../types";

const DoctorDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    getDoctorAppointments()
      .then(setAppointments)
      .catch(() => setAppointments([]));
  }, []);

  const handleConfirm = async (id: number) => {
    try {
      const confirmed = await confirmAppointment(id);
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === id ? confirmed : appointment,
        ),
      );
      toast.success("Appointment confirmed");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Unable to confirm appointment",
      );
    }
  };

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "Pending",
  ).length;
  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "Confirmed",
  ).length;

  return (
    <DashboardLayout>
      <div className="page-wrap">
        <section className="welcome-row">
          <div>
            <p className="eyebrow">monday, september 07, 2026</p>
            <h1>Your clinical day, at a glance.</h1>
            <p className="muted">
              You have {appointments.length} appointment
              {appointments.length === 1 ? "" : "s"} in your care queue, with{" "}
              {pendingAppointments} pending request
              {pendingAppointments === 1 ? "" : "s"}.
            </p>
          </div>
          <Link to="/doctor/availability" className="outline-button">
            Edit availability
          </Link>
        </section>
        <section className="stats-grid">
          <div className="stat-card accent">
            <span>Scheduled appointments</span>
            <strong>{appointments.length}</strong>
            <small>Loaded from your appointment queue</small>
          </div>
          <div className="stat-card">
            <span>Awaiting response</span>
            <strong>{pendingAppointments}</strong>
            <small>Requests to review</small>
          </div>
          <div className="stat-card">
            <span>Confirmed visits</span>
            <strong>{confirmedAppointments}</strong>
            <small>Ready for your care</small>
          </div>
        </section>
        <div className="content-grid">
          <section>
            <div className="section-head">
              <div>
                <p className="eyebrow">Tuesday schedule</p>
                <h2>Today’s appointments</h2>
              </div>
              <Link to="/doctor/appointments" className="text-link">
                View calendar
              </Link>
            </div>
            <div className="stack">
              {appointments.slice(0, 2).map((item) => (
                <AppointmentCard
                  key={item.id}
                  appointment={item}
                  doctorView
                  onConfirm={handleConfirm}
                />
              ))}
              {appointments.length === 0 && (
                <div className="empty-state">No appointment requests yet.</div>
              )}
            </div>
          </section>
          <aside className="side-panel">
            <p className="eyebrow">Practice pulse</p>
            <h2>This week</h2>
            <div className="progress-stat">
              <div>
                <span>Booked hours</span>
                <strong>24 / 32 hrs</strong>
              </div>
              <div className="progress">
                <i style={{ width: "75%" }} />
              </div>
            </div>
            <div className="progress-stat">
              <div>
                <span>Follow-up completion</span>
                <strong>86%</strong>
              </div>
              <div className="progress">
                <i className="mint-bar" style={{ width: "86%" }} />
              </div>
            </div>
            <div className="note-box">
              <strong>Quiet afternoon</strong>
              <span>Tomorrow has room for 3 more visits.</span>
              <Link to="/doctor/availability">Open slots →</Link>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default DoctorDashboard;
