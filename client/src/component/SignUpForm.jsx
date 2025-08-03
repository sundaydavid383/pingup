// SignUpForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomAlert from './CustomAlert';
import Loading from './Loading';
import '../styles/colors.css';
import axios from 'axios';

const steps = [
  'Basic Info',
  'Profile Details',
  'Spiritual Info',
  'Interests',
  'Bio',
];

const SignUpForm = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    occupation: '',
    age: '',
    gender: '',
    location: '',
    churchName: '',
    churchRole: '',
    prayerRequest: '',
    interests: '',
    bio: '',
  });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidName = (name) =>
    /^[A-Za-z\s]+$/.test(name.trim());

const validateStep = () => {
  if (step === 0) {
    if (!formData.name.trim()) return 'Full Name is required';
    if (!isValidName(formData.name)) return 'Name must contain only letters and spaces';

    if (!formData.email.trim()) return 'Email is required';
    if (!isValidEmail(formData.email)) return 'Enter a valid email address';

    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
  }

  if (step === 1) {
    if (formData.age && isNaN(formData.age)) return 'Age must be a number';
    const ageNum = parseInt(formData.age, 10);
    if (formData.age && (ageNum < 13 || ageNum > 120)) return 'Age must be between 13 and 120';

    if (formData.gender && !['Male', 'Female', 'Prefer not to say'].includes(formData.gender))
      return 'Invalid gender selected';

    if (formData.occupation && !/^[a-zA-Z\s.,'-]{2,50}$/.test(formData.occupation))
      return 'Occupation contains invalid characters';
  }

  if (step === 2) {
    if (formData.location && formData.location.length < 3)
      return 'Location name is too short';

    if (formData.churchName && !isValidName(formData.churchName))
      return 'Church name must contain only letters and spaces';

    if (formData.churchRole && !/^[a-zA-Z\s]{2,30}$/.test(formData.churchRole))
      return 'Invalid church role';
  }

  if (step === 3) {
    if (formData.interests && formData.interests.length < 3)
      return 'Please give a bit more detail in interests';

    if (formData.bio && formData.bio.length < 10)
      return 'Bio should be at least 10 characters';

    if (formData.prayerRequest && formData.prayerRequest.length < 5)
      return 'Prayer request is too short';
  }

  return null;
};

const handleNext = async () => {
  const error = validateStep();
  if (error) {
    setAlert({ show: true, message: error, type: 'error' });
    return;
  }

  if (step < steps.length - 1) {
    setDirection(1);
    setStep(step + 1);
  }
   else {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: formData.age,
        gender: formData.gender,
        occupation: formData.occupation,
        location: formData.location,
        churchName: formData.churchName,
        churchRole: formData.churchRole,
        interests: formData.interests,
        bio: formData.bio,
        prayerRequest: formData.prayerRequest,
      });

      setLoading(false);
      setAlert({
        show: true,
        message: response.data.message || "Signup successful!",
        type: 'success',
      });

      // Optional: reset form or redirect
      console.log("✅ Registered:", response.data.user);
    } catch (err) {
      setLoading(false);
      setAlert({
        show: true,
        message: err.response?.data?.message || "Something went wrong",
        type: 'error',
      });
    }
  }
};

  return (
    <div className="relative w-full max-w-lg mx-auto mt-8">
      <div
        className="absolute inset-0 backdrop-blur-2xl rounded-3xl shadow-2xl"
        style={{ backgroundColor: 'var(--form-bg)' }}
      ></div>

      {loading && <Loading />}
      {alert.show && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}

      <AnimatePresence mode="wait" custom={direction}>
        <motion.form
          key={step}
          custom={direction}
          initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={(e) => e.preventDefault()}
          className="relative z-10 p-6 sm:p-10 text-[var(--text-main)] space-y-5"
        >
          <h2 className="text-2xl font-bold text-center" style={{ color: 'var(--color-text)' }}>
            {steps[step]}
          </h2>

          {/* Step 1: Basic Info */}
          {step === 0 && (
  <>
    <input
      name="name"
      placeholder="Full Name"
      value={formData.name}
      onChange={handleChange}
      required
      className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
    />
    <input
      type="email"
      name="email"
      placeholder="Email Address"
      value={formData.email}
      onChange={handleChange}
      required
      className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
    />
    <input
      type="password"
      name="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleChange}
      required
      className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
    />
    <input
      type="password"
      name="confirmPassword"
      placeholder="Confirm Password"
      value={formData.confirmPassword}
      onChange={handleChange}
      required
      className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
    />
  </>
)}

          {/* Step 2: Profile Details */}
          {step === 1 && (
            <>
              <input
                name="occupation"
                placeholder="Occupation (optional)"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
              />
              <input
                name="age"
                type="number"
                placeholder="Age (13–120)"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
              />
            <select
  name="gender"
  value={formData.gender}
  onChange={handleChange}
  className="w-full p-3 rounded-xl bg-[var(--input-bg)] text-[var(--input-text)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
>
  <option value="">Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Prefer not to say">Prefer not to say</option>
</select>
              <input
                name="location"
                placeholder="Location (optional)"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
              />
            </>
          )}

          {/* Step 3: Spiritual Info */}
          {step === 2 && (
            <>
              <input
                name="churchName"
                placeholder="Church Name (optional)"
                value={formData.churchName}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
              />
              <input
                name="churchRole"
                placeholder="Role in Church (optional)"
                value={formData.churchRole}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
              />
              <textarea
                name="prayerRequest"
                placeholder="Prayer Requests (optional)"
                value={formData.prayerRequest}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
              />
            </>
          )}

          {/* Step 4: Interests */}
          {step === 3 && (
            <textarea
              name="interests"
              placeholder="What are your interests? (optional)"
              value={formData.interests}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
            />
          )}

          {/* Step 5: Bio */}
          {step === 4 && (
            <textarea
              name="bio"
              placeholder="Short bio or testimony (optional)"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
            />
          )}

          <div className="flex justify-between items-center gap-4 mt-4">
            {step > 0 && (
              <button
                onClick={handleBack}
                type="button"
                className="w-1/2 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-xl transition"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              type="button"
              className={`w-full ${step > 0 ? 'w-1/2' : 'w-full'} py-3 bg-[var(--accent)] hover:bg-indigo-700 text-white font-semibold rounded-xl transition`}
            >
              {step < steps.length - 1 ? 'Next' : 'Finish'}
            </button>
          </div>

          <p className="text-sm text-center text-white/60">
            Step {step + 1} of {steps.length}
          </p>
          <p className="text-center text-sm text-white/70">
  Already have an account?{" "}
  <button
    type="button"
    className="text-[var(--accent)] font-medium underline"
    onClick={onSwitchToLogin}
  >
    Log in here
  </button>
</p>
        </motion.form>
      </AnimatePresence>
    </div>
  );
};

export default SignUpForm;