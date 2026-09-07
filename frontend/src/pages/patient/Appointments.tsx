import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import AppointmentCard from "../../components/AppointmentCard";
import { getPatientAppointments } from "../../services/appointmentService";
import { Appointment } from "../../types";

const PatientAppointments: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    getPatientAppointments()
      .then(setAppointments)
      .catch(() => setAppointments([]));
  }, []);

  const filtered =
    filter === "All"
      ? appointments
      : appointments.filter((appointment) => appointment.status === filter);
  return (
    <DashboardLayout>
      <div className="page-wrap">
        <div className="page-title">
          <p className="eyebrow">Your care timeline</p>
          <h1>My appointments</h1>
          <p className="muted">
            Keep track of visits, follow-ups, and care plans.
          </p>
        </div>
        <div className="filter-tabs">
          {["All", "Confirmed", "Pending", "Completed"].map((item) => (
            <button
              className={filter === item ? "filter active" : "filter"}
              key={item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="stack">
          {filtered.length > 0 ? (
            filtered.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <div className="empty-state">
              {filter === "All"
                ? "You do not have any appointments yet."
                : `You do not have any ${filter.toLowerCase()} appointments.`}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
export default PatientAppointments;
