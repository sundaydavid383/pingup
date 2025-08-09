// SignUpForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomAlert from './shared/CustomAlert';
import Loading from './shared/Loading';
import '../styles/ui.css';
import './signUpForm.css';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";


const steps = [
  'Basic Info',
  'Profile Details',
  // 'Spiritual Info',
  'Interests',
  'Bio',
];

const ValidationItem = ({ isValid, label }) => (
  <div style={{ color: isValid ? '#2fdf2f' : '#f14b4b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <span>{isValid ? '✔️' : '❌'}</span>
    <span>{label}</span>
  </div>
);

const SignUpForm = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("")
  const [alert, setAlert] = useState({ show: false, message: '', type: 'error' });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState('');
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    occupation: '',
    dob: '',
    gender: '',
    location: '',
    churchName: '',
    churchRole: '',
    prayerRequest: '',
    interests: '',
    bio: '',
    profilePicUrl: '',
  });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };
   
  const handleImageUpload = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const form = new FormData();
            form.append('profilePic', file);

            try {
              setLoading(true);
              setLoadingText('Uploading image...');
              const res = await axios.post('http://localhost:5000/api/auth/upload-image', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });

              setFormData(prev => ({
                ...prev,
                profilePicUrl: res.data.imageUrl
              }));

              setAlert({
                show: true,
                message: 'Profile picture uploaded successfully!',
                type: 'success'
              });
            } catch (err) {
              console.error(err);
              setAlert({
                show: true,
                message: 'Failed to upload image.',
                type: 'error'
              });
            } finally {
              setLoading(false);
            }
          };

  const validateStep = () => {
    const {
      name,
      email,
      password,
      confirmPassword,
      dob,
      gender,
      occupation,
      location,
      churchName,
      churchRole,
      interests,
      bio,
      prayerRequest,
      
    } = formData;

    // STEP 0: BASIC INFO
    if (step === 0) {
     if (!/^[A-Za-z\s]+$/.test(name.trim()))
        return 'Name must contain only letters and spaces';

      if (!name.trim().includes(' ') || name.trim().split(/\s+/).length < 2)
        return 'Please enter both first and last name';

      if (name.trim().length < 3 || name.trim().length > 50)
        return 'Name must be 3–50 characters long';
            if (!email.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        return 'Enter a valid email address';

      if (!password) return 'Password is required';
      if (password.length < 6)
        return 'Password must be at least 6 characters';
      if (password.length > 30)
        return 'Password must be 6–30 characters long';
      if (!/[a-zA-Z]/.test(password))
        return 'Password must contain at least one letter';
      if (!/[0-9]/.test(password))
        return 'Password must contain at least one number';
      if (password !== confirmPassword)
        return 'Passwords do not match';
    }

    // STEP 1: PROFILE DETAILS
    if (step === 1) {
     if (!dob.trim()) return 'Date of Birth is required';

const birthDate = new Date(dob);
const today = new Date();
let age = today.getFullYear() - birthDate.getFullYear();
const m = today.getMonth() - birthDate.getMonth();
if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
  age--;
}

if (isNaN(age)) return 'Date of Birth must be a valid date';
      if (!gender) return 'Please select a gender';
      const validGenders = ['Male', 'Female', 'Prefer not to say'];
      if (!validGenders.includes(gender)) return 'Invalid gender selected';

      if (occupation && occupation.trim()) {
        if (occupation.trim().length < 2 || occupation.trim().length > 50)
          return 'Occupation must be 2–50 characters';
        if (!/^[a-zA-Z\s.,'-]+$/.test(occupation))
          return 'Occupation contains invalid characters';
      }

      if (location && location.trim()) {
        if (location.trim().length < 3 || location.trim().length > 100)
          return 'Location must be 3–100 characters long';
      }
    }

    // STEP 2: SPIRITUAL INFO
    // if (step === 2) {
    //   if (churchName && churchName.trim()) {
    //     if (!/^[A-Za-z\s]+$/.test(churchName.trim()) || churchName.trim().length < 2)
    //       return 'Church name must be at least 2 letters and only contain letters and spaces';
    //   }

    //   if (churchRole && churchRole.trim()) {
    //     if (!/^[a-zA-Z\s]{2,30}$/.test(churchRole.trim()))
    //       return 'Church role must be 2–30 characters and only letters/spaces';
    //   }

    //   if (prayerRequest && prayerRequest.trim()) {
    //     if (prayerRequest.trim().length < 5)
    //       return 'Prayer request must be at least 5 characters';
    //     if (prayerRequest.trim().length > 300)
    //       return 'Prayer request must be less than 300 characters';
    //   }
    // }

    // STEP 3: INTERESTS
    if (step === 2) {
      if (interests && interests.trim()) {
        if (interests.trim().length < 3)
          return 'Please share more about your interests';
        if (interests.trim().length > 300)
          return 'Interests must be less than 300 characters';
      }
    }

    // STEP 4: BIO
    if (step === 3) {
      if (bio && bio.trim()) {
        if (bio.trim().length < 10)
          return 'Bio must be at least 10 characters';
        if (bio.trim().length > 500)
          return 'Bio must be under 500 characters';
      }
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
      setLoadingText("registering user...")

      try {
        const response = await axios.post("http://localhost:5000/api/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          dob: formData.dob,
          gender: formData.gender,
          occupation: formData.occupation,
          location: formData.location,
          churchName: formData.churchName,
          churchRole: formData.churchRole,
          interests: formData.interests,
          bio: formData.bio,
          prayerRequest: formData.prayerRequest,
          profilePicUrl: formData.profilePicUrl,
        });


        setLoading(false);
        setAlert({
          show: true,
          message: response.data.message || "Registration successful! Please check your email for the OTP.",
          type: 'success',
        });
        setUserId(response.data.userId);
        setShowOtpInput(true);
        // Optional: reset form or redirect
        console.log("✅ Registered:", response.data.user);
      } catch (err) {
        setLoading(false);

        // Check if we got specific validation errors from the server
        const serverErrors = err.response?.data?.errors;

        if (serverErrors && typeof serverErrors === 'object') {
          const messages = Object.values(serverErrors).join('\n');

          setAlert({
            show: true,
            message: messages || "Validation failed.",
            type: 'error',
          });

          console.log("❌ Validation errors from server:", serverErrors);
        } else {
          setAlert({
            show: true,
            message: err.response?.data?.message || "Something went wrong",
            type: 'error',
          });

          console.log("❌ General error from server:", err.response?.data || err.message);
        }
      }
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto mt-8">
      <div
        className="absolute inset-0 backdrop-blur-2xl rounded-3xl shadow-2xl"
        style={{ backgroundColor: 'var(--form-bg)' }}
      ></div>

      {loading && <Loading text={loadingText} />}
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
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
              />
              <input
                autoComplete="email"
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="off"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-[var(--input-bg)] text-[var(--input-text)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform bg-[var(--accent)] px-3 py-1 rounded-full text-white text-sm hover:bg-opacity-90 transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="password-validation" style={{ marginTop: '10px' }}>
                <ValidationItem
                  isValid={formData.password.length >= 8}
                  label="Minimum 8 characters"
                />
                <ValidationItem
                  isValid={/[A-Z]/.test(formData.password)}
                  label="At least 1 uppercase letter"
                />
                <ValidationItem
                  isValid={/[a-z]/.test(formData.password)}
                  label="At least 1 lowercase letter"
                />
                <ValidationItem
                  isValid={/\d/.test(formData.password)}
                  label="At least 1 number"
                />
                <ValidationItem
                  isValid={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)}
                  label="At least 1 special character"
                />
              </div>
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
            {!formData.profilePicUrl && (<input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-3 rounded-xl bg-white text-black shadow-[var(--input-shadow)] focus:outline-none"
                />)}

                {formData.profilePicUrl && (
                  <img
                    src={formData.profilePicUrl}
                    alt="Preview"
                    className="w-24 h-24 rounded-full mx-auto mt-4 object-cover shadow-md"
                />
                )}
              <input
                name="occupation"
                placeholder="Occupation (optional)"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
              />
              <input
  name="dob"
  type="date"
  placeholder="Date of Birth"
  value={formData.dob}
  onChange={handleChange}
  className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
/>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white text-black shadow-[var(--input-shadow)] placeholder-gray-400 focus:outline-none"
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
          {/* {step === 2 && (
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
          )} */}


          {step === 2 && (
            <div className="w-full">
              <label htmlFor="interests" className="block mb-2 text-white/80">
                Select your interests (optional)
              </label>
              <select
                name="interests"
                id="interests"
                value={formData.interests}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[var(--input-bg)] text-[var(--input-text)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none appearance-none"
              >
                <option value="" className="text-black">Choose one</option>
                <option value="Music" className="text-black">Music</option>
                <option value="Volunteering" className="text-black">Volunteering</option>
                <option value="Bible Study" className="text-black">Bible Study</option>
                <option value="Tech & Media" className="text-black">Tech & Media</option>
                <option value="Sports" className="text-black">Sports</option>
                <option value="Creative Arts" className="text-black">Creative Arts</option>
                <option value="Youth Programs" className="text-black">Youth Programs</option>
                <option value="Prayer & Counseling" className="text-black">Prayer & Counseling</option>
                <option value="I'm just exploring" className="text-black">I'm just exploring</option>
              </select>
            </div>
          )}

          {step === 3 && (
            <textarea
              name="bio"
              placeholder="Short bio or testimony (optional)"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 rounded-xl bg-[var(--input-bg)] shadow-[var(--input-shadow)] placeholder-white/70 focus:outline-none"
            />
          )}
          {step === 3 && showOtpInput ? (
            <div className="mt-6 space-y-3">
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full p-3 rounded-xl bg-[var(--input-bg)] placeholder-white/70 focus:outline-none"
              />
              <button
                onClick={async () => {
                  try {
                    setLoading(true)
                    setLoadingText("verifing OTP..")
                    const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
                      userId,
                      otp
                    });
                    if (res.data.success) {
                      setAlert({
                        show: true,
                        message: res.data.message,
                        type: 'success',
                      });

                      // Login user into context and localStorage
                      login(res.data.user, res.data.token);

                    } else {
                      setAlert({
                        show: true,
                        message: res.data.message || 'OTP verification failed',
                        type: 'error',
                      });
                    }

                  } catch (err) {
                    setAlert({
                      show: true,
                      message: err.response?.data?.error || 'OTP verification failed',
                      type: 'error',
                    });
                  }
                  finally {
                    setLoading(false)
                  }
                }}
                className="btn w-full rounded-xl"
              >
                Verify OTP
              </button>
              <button
                type="button"
                className="w-full text-sm text-[var(--primary)] underline hover:text-white transition"
                onClick={async () => {
                  try {
                    setLoading(true);
                    setLoadingText("Resending OTP...");

                    const res = await axios.post("http://localhost:5000/api/auth/resend-otp", {
                      userId,
                    });

                    setAlert({
                      show: true,
                      message: res.data.message || "OTP resent successfully.",
                      type: 'success',
                    });
                  } catch (err) {
                    setAlert({
                      show: true,
                      message: err.response?.data?.message || "Failed to resend OTP.",
                      type: 'error',
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Didn’t receive OTP? Resend it
              </button>

            </div>
          ) :

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
                className={`btn ${step > 0 ? 'w-1/2' : 'w-full'}`}
              >
                {step < steps.length - 1 ? 'Next' : 'Finish'}
              </button>
            </div>
          }

          <p className="text-sm text-center text-white/60">
            Step {step + 1} of {steps.length}
          </p>
          <p className="text-center text-sm text-white/70">
            Already have an account?{" "}
            <button
              type="button"
              className="text-[var(--primary)] font-medium underline"
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