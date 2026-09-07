import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/DashboardLayout";
import { doctors } from "../../services/demoData";
import { createAppointment } from "../../services/appointmentService";

const BookAppointment: React.FC = () => {
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState("All specialties");
  const [selectedDoctor, setSelectedDoctor] = useState(1);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slot, setSlot] = useState("4:30 PM");
  const filtered =
    specialty === "All specialties"
      ? doctors
      : doctors.filter((item) => item.specialty === specialty);
  const book = async () => {
    const doctor = doctors.find((item) => item.id === selectedDoctor);
    if (!doctor) return;

    try {
      await createAppointment({
        doctor_id: doctor.id,
        doctor_name: doctor.name,
        specialty: doctor.specialty,
        scheduled_at: `${date} ${slot}`,
        mode: "Video consultation",
      });
      toast.success("Appointment request sent");
      navigate("/patient/appointments");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Unable to book appointment",
      );
    }
  };
  return (
    <DashboardLayout>
      <div className="page-wrap booking-page">
        <div className="page-title">
          <p className="eyebrow">Find your next visit</p>
          <h1>Book an appointment</h1>
          <p className="muted">
            Choose a specialist, a time that suits you, and we will handle the
            rest.
          </p>
        </div>
        <div className="booking-layout">
          <section className="booking-options">
            <label className="field-label">
              What kind of care do you need?
              <select
                value={specialty}
                onChange={(event) => setSpecialty(event.target.value)}
              >
                <option>All specialties</option>
                <option>Family medicine</option>
                <option>Cardiology</option>
                <option>Dermatology</option>
              </select>
            </label>
            <div className="section-head compact">
              <h2>Available specialists</h2>
              <span className="muted">{filtered.length} matches</span>
            </div>
            <div className="doctor-list">
              {filtered.map((doctor) => (
                <button
                  className={
                    selectedDoctor === doctor.id
                      ? "doctor-choice selected"
                      : "doctor-choice"
                  }
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor.id)}
                >
                  <div className={`avatar ${doctor.tone}`}>
                    {doctor.initials}
                  </div>
                  <div>
                    <strong>{doctor.name}</strong>
                    <span>
                      {doctor.specialty} · {doctor.experience}
                    </span>
                    <small>
                      ★ {doctor.rating} · Next: {doctor.nextAvailable}
                    </small>
                  </div>
                  <span className="radio">
                    {selectedDoctor === doctor.id ? "●" : "○"}
                  </span>
                </button>
              ))}
            </div>
          </section>
          <aside className="booking-summary">
            <p className="eyebrow">Your visit</p>
            <h2>{doctors.find((item) => item.id === selectedDoctor)?.name}</h2>
            <p className="muted">
              {doctors.find((item) => item.id === selectedDoctor)?.specialty}
            </p>
            <label className="field-label">
              Date
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>
            <div className="field-label">
              Choose a time
              <div className="slot-grid">
                {["9:00 AM", "11:15 AM", "2:00 PM", "4:30 PM", "5:15 PM"].map(
                  (item) => (
                    <button
                      className={slot === item ? "slot selected" : "slot"}
                      key={item}
                      onClick={() => setSlot(item)}
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            </div>
            <div className="summary-line">
              <span>Visit type</span>
              <strong>Video consultation</strong>
            </div>
            <button className="primary-button full" onClick={book}>
              Request appointment <span>→</span>
            </button>
            <Link to="/patient/appointments" className="cancel-link">
              View your appointments
            </Link>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default BookAppointment;
