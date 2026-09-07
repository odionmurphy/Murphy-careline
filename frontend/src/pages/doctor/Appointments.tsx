import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/DashboardLayout";
import AppointmentCard from "../../components/AppointmentCard";
import {
  confirmAppointment,
  getDoctorAppointments,
} from "../../services/appointmentService";
import { Appointment } from "../../types";

const DoctorAppointments: React.FC = () => {
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

  return (
    <DashboardLayout>
      <div className="page-wrap">
        <div className="page-title">
          <p className="eyebrow">Your working day</p>
          <h1>Appointments</h1>
          <p className="muted">
            Review upcoming visits and prepare for every patient.
          </p>
        </div>
        <div className="calendar-strip">
          {["Mon 26", "Tue 27", "Wed 28", "Thu 29", "Fri 30"].map(
            (day, index) => (
              <button className={index === 1 ? "day active" : "day"} key={day}>
                <strong>{day.split(" ")[0]}</strong>
                <span>{day.split(" ")[1]}</span>
              </button>
            ),
          )}
        </div>
        <div className="stack">
          {appointments.length > 0 ? (
            appointments.map((item) => (
              <AppointmentCard
                key={item.id}
                appointment={item}
                doctorView
                onConfirm={handleConfirm}
              />
            ))
          ) : (
            <div className="empty-state">No appointment requests yet.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
export default DoctorAppointments;
