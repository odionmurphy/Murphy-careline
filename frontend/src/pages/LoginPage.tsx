import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PublicAuthLayout from "../components/PublicAuthLayout";
import { useAuthStore } from "../store/authStore";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setError("");
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message || "We could not sign you in.",
      );
    }
  };

  return (
    <PublicAuthLayout
      eyebrow="A better way to care"
      title="Welcome back."
      text="Your appointments, your care team, and your next step, all in one considered place."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email address
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button
          className="primary-button full auth-submit"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing you in..." : "Log in"}
          <span>↗</span>
        </button>
      </form>
      <p className="auth-switch">
        New to Careline? <Link to="/register">Create an account</Link>
      </p>
    </PublicAuthLayout>
  );
};

export default LoginPage;
