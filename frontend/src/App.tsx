import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PatientDashboard from "./pages/patient/Dashboard";
import PatientAppointments from "./pages/patient/Appointments";
import BookAppointment from "./pages/patient/BookAppointment";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorAppointments from "./pages/doctor/Appointments";
import Availability from "./pages/doctor/Availability";
import HomePage from "./pages/HomePage";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute>
                <PatientAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/book"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute>
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/availability"
            element={
              <ProtectedRoute>
                <Availability />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const RoleDashboard: React.FC = () => {
  const { user } = useAuthStore();
  return user?.role === "doctor" ? <DoctorDashboard /> : <PatientDashboard />;
};

export default App;
