import React, { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/DashboardLayout";
const Availability: React.FC = () => {
  const [days, setDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const toggle = (day: string) =>
    setDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day],
    );
  return (
    <DashboardLayout>
      <div className="page-wrap narrow">
        <div className="page-title">
          <p className="eyebrow">Your schedule settings</p>
          <h1>Availability</h1>
          <p className="muted">
            Let patients know when they can find you for care.
          </p>
        </div>
        <section className="settings-panel">
          <h2>Working days</h2>
          <p className="muted">Select the days you accept appointments.</p>
          <div className="day-selector">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <button
                className={
                  days.includes(day) ? "day-select active" : "day-select"
                }
                key={day}
                onClick={() => toggle(day)}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="form-row">
            <label className="field-label">
              Start time
              <input type="time" defaultValue="09:00" />
            </label>
            <label className="field-label">
              End time
              <input type="time" defaultValue="17:00" />
            </label>
          </div>
          <label className="toggle-row">
            <span>
              <strong>Video consultations</strong>
              <small>Accept remote appointments during these hours</small>
            </span>
            <input type="checkbox" defaultChecked />
          </label>
          <label className="toggle-row">
            <span>
              <strong>Buffer between visits</strong>
              <small>Leave 15 minutes between appointments</small>
            </span>
            <input type="checkbox" defaultChecked />
          </label>
          <button
            className="primary-button"
            onClick={() => toast.success("Availability updated")}
          >
            Save availability <span>→</span>
          </button>
        </section>
      </div>
    </DashboardLayout>
  );
};
export default Availability;
