import React, { useState } from "react";
import { Appointment } from "../types";

const AppointmentCard: React.FC<{
  appointment: Appointment;
  doctorView?: boolean;
  onConfirm?: (id: number) => Promise<void>;
}> = ({ appointment, doctorView, onConfirm }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <article className="appointment-card">
        <div className={`avatar ${appointment.tone}`}>
          {appointment.initials}
        </div>
        <div className="appointment-main">
          <div className="appointment-heading">
            <div>
              <h3>{doctorView ? appointment.patient : appointment.doctor}</h3>
              <p>{appointment.specialty}</p>
            </div>
            <span className={`status ${appointment.status.toLowerCase()}`}>
              {appointment.status}
            </span>
          </div>
          <div className="appointment-meta">
            <span>{appointment.date}</span>
            <span>{appointment.time}</span>
            <span>{appointment.mode}</span>
          </div>
        </div>
        <div className="appointment-actions">
          <button className="ghost-button" onClick={() => setShowDetails(true)}>
            View details
          </button>
          {doctorView && appointment.status === "Pending" && onConfirm && (
            <button
              className="primary-button"
              onClick={() => onConfirm(appointment.id)}
            >
              Confirm
            </button>
          )}
        </div>
      </article>
      {showDetails && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setShowDetails(false)}
        >
          <section
            className="details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`appointment-${appointment.id}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="section-head">
              <div>
                <p className="eyebrow">Appointment details</p>
                <h2 id={`appointment-${appointment.id}`}>
                  {doctorView ? appointment.patient : appointment.doctor}
                </h2>
              </div>
              <button
                className="close-tip"
                aria-label="Close details"
                onClick={() => setShowDetails(false)}
              >
                ×
              </button>
            </div>
            <div className="details-list">
              <div>
                <span>Specialty</span>
                <strong>{appointment.specialty}</strong>
              </div>
              <div>
                <span>Date</span>
                <strong>{appointment.date}</strong>
              </div>
              <div>
                <span>Time</span>
                <strong>{appointment.time}</strong>
              </div>
              <div>
                <span>Visit type</span>
                <strong>{appointment.mode}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{appointment.status}</strong>
              </div>
            </div>
            {doctorView && appointment.status === "Pending" && onConfirm && (
              <button
                className="primary-button full"
                onClick={async () => {
                  await onConfirm(appointment.id);
                  setShowDetails(false);
                }}
              >
                Confirm appointment
              </button>
            )}
          </section>
        </div>
      )}
    </>
  );
};

export default AppointmentCard;
