import api from "./api";
import { Appointment } from "../types";

interface AppointmentResponse {
  id: number;
  doctor_id: number;
  patient_id: number;
  doctor_name: string;
  specialty: string;
  scheduled_at: string;
  status: Appointment["status"];
  mode: Appointment["mode"];
  patient?: { name: string };
}

const formatAppointment = (appointment: AppointmentResponse): Appointment => {
  const scheduledAt = new Date(appointment.scheduled_at);

  return {
    id: appointment.id,
    doctor: appointment.doctor_name,
    patient: appointment.patient?.name,
    patient_id: appointment.patient_id,
    specialty: appointment.specialty,
    date: scheduledAt.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    time: scheduledAt.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }),
    status: appointment.status,
    mode: appointment.mode,
    initials: appointment.doctor_name
      .replace(/^Dr\.\s*/i, "")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2),
    tone: "coral",
  };
};

export const getPatientAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get<{ data: AppointmentResponse[] }>(
    "/appointments",
  );
  return response.data.data.map(formatAppointment);
};

export const getDoctorAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get<{ data: AppointmentResponse[] }>(
    "/appointments",
  );
  return response.data.data.map(formatAppointment);
};

export const createAppointment = async (data: {
  doctor_id: number;
  doctor_name: string;
  specialty: string;
  scheduled_at: string;
  mode: Appointment["mode"];
}): Promise<Appointment> => {
  const response = await api.post<{ data: AppointmentResponse }>(
    "/appointments",
    data,
  );
  return formatAppointment(response.data.data);
};

export const confirmAppointment = async (id: number): Promise<Appointment> => {
  const response = await api.post<{ data: AppointmentResponse }>(
    `/appointments/${id}/confirm`,
  );
  return formatAppointment(response.data.data);
};
