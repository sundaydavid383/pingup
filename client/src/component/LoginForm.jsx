import React, { useState } from "react";
import CustomAlert from "./CustomAlert";
import Loading from "./Loading";
import "../styles/colors.css";

const LoginForm = ({ onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!formData.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Enter a valid email";
    if (!formData.password.trim()) return "Password is required";
    if (formData.password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setAlert({ show: true, message: error, type: "error" });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("🔐 Logging in with:", formData);
      setAlert({ show: true, message: "Login successful!", type: "success" });
    }, 1000);
  };

  return (
    <div className="relative w-full max-w-md mx-auto mt-8">
      <div
        className="absolute inset-0 backdrop-blur-2xl rounded-3xl shadow-2xl"
        style={{ backgroundColor: "var(--form-bg)" }}
      ></div>

      {loading && <Loading />}
      {alert.show && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="relative z-10 p-6 sm:p-10 text-[var(--text-main)] space-y-6"
      >
        <h2 className="text-2xl font-bold text-center" style={{ color: "var(--color-text)" }}>
          Log In
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-[var(--input-bg)] text-[var(--input-text)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-[var(--input-bg)] text-[var(--input-text)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full py-3 bg-[var(--accent)] hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
        >
          Login
        </button>

        <p className="text-center text-sm text-white/70">
          Don’t have an account?{" "}
          <button
            type="button"
            className="text-[var(--accent)] font-medium underline"
            onClick={onSwitchToSignUp}
          >
            Sign up here
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;