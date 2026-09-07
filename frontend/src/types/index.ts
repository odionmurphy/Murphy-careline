export type Role = "patient" | "doctor" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  specialty?: string;
  avatar_url?: string;
}

export interface Appointment {
  id: number;
  doctor: string;
  patient?: string;
  patient_id?: number;
  specialty: string;
  date: string;
  time: string;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  mode: "Video consultation" | "In clinic";
  initials: string;
  tone: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  nextAvailable: string;
  initials: string;
  tone: string;
}
