import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PublicAuthLayout from "../components/PublicAuthLayout";
import { useAuthStore } from "../store/authStore";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "patient",
    phone: "",
  });
  const [error, setError] = useState("");

  const update = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) =>
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      formData.password.length < 8 ||
      formData.password !== formData.password_confirmation
    ) {
      setError("Please complete the form and make sure your passwords match.");
      return;
    }
    setError("");
    try {
      await register({ ...formData, phone: formData.phone || null });
      toast.success("Your account is ready");
      navigate("/dashboard");
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          "We could not create your account.",
      );
    }
  };

  return (
    <PublicAuthLayout
      eyebrow="Start with Careline"
      title="Create your account."
      text="A few details now means a simpler, more personal care experience later."
    >
      <form className="auth-form register-form" onSubmit={handleSubmit}>
        <div className="auth-form-grid">
          <label>
            Full name
            <input
              name="name"
              value={formData.name}
              onChange={update}
              placeholder="Your full name"
              disabled={isLoading}
            />
          </label>
          <label>
            Phone <span className="optional">optional</span>
            <input
              name="phone"
              value={formData.phone}
              onChange={update}
              placeholder="Your phone number"
              disabled={isLoading}
            />
          </label>
        </div>
        <label>
          Email address
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={update}
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </label>
        <label>
          I am joining as
          <select
            name="role"
            value={formData.role}
            onChange={update}
            disabled={isLoading}
          >
            <option value="patient">A patient</option>
            <option value="doctor">A doctor</option>
          </select>
        </label>
        <div className="auth-form-grid">
          <label>
            Password
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={update}
              placeholder="8 characters minimum"
              disabled={isLoading}
            />
          </label>
          <label>
            Confirm password
            <input
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={update}
              placeholder="Repeat password"
              disabled={isLoading}
            />
          </label>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button
          className="primary-button full auth-submit"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating your account..." : "Create account"}
          <span>↗</span>
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </PublicAuthLayout>
  );
};

export default RegisterPage;
