import React, { useState } from 'react';
import axios from 'axios';

const fields = [
  'name', 'email', 'dob', 'gender', 'bio', 'occupation',
  'location', 'homeTown', 'currentCity', 'relationshipStatus',
  'school', 'workplace', 'churchName', 'churchRole',
  'interests', 'prayerRequest',
];

import {
  UserRound,
  Mail,
  CalendarDays,
  Info,
  Briefcase,
  MapPin,
  Home,
  Landmark,
  Heart,
  GraduationCap,
  Building2,
  Church,
  Users,
  Sparkles,
  HandHelping,
} from 'lucide-react';

const fieldLabels = {
  name: "Full Name",
  email: "Email",
  dob: "Date of Birth",
  gender: "Gender",
  bio: "Bio",
  occupation: "Occupation",
  location: "Location",
  homeTown: "Home Town",
  currentCity: "Current City",
  relationshipStatus: "Relationship Status",
  school: "School",
  workplace: "Workplace",
  churchName: "Church Name",
  churchRole: "Church Role",
  interests: "Interests",
  prayerRequest: "Prayer Request",
};
const fieldIcons = {
  name: <UserRound size={16} className="mr-2" />,
  email: <Mail size={16} className="mr-2" />,
  dob: <CalendarDays size={16} className="mr-2" />,
  gender: <Users size={16} className="mr-2" />,
  bio: <Info size={16} className="mr-2" />,
  occupation: <Briefcase size={16} className="mr-2" />,
  location: <MapPin size={16} className="mr-2" />,
  homeTown: <Home size={16} className="mr-2" />,
  currentCity: <MapPin size={16} className="mr-2" />,
  relationshipStatus: <Heart size={16} className="mr-2" />,
  school: <GraduationCap size={16} className="mr-2" />,
  workplace: <Building2 size={16} className="mr-2" />,
  churchName: <Church size={16} className="mr-2" />,
  churchRole: <Users size={16} className="mr-2" />,
  interests: <Sparkles size={16} className="mr-2" />,
  prayerRequest: <HandHelping size={16} className="mr-2" />,
};


const UserModal = ({ user, onClose }) => {
  const [formData, setFormData] = useState({ ...user });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(user.profilePicUrl || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, dob } = formData;
    if (!name || name.trim().length < 3) return "Name must be at least 3 characters";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email address";
    if (!dob) return "Date of birth is required";
    return null;
  };

const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const form = new FormData();
  form.append('file', file);

  try {
    setUploading(true);
    // 👇 Replace this with your own backend endpoint
    const res = await axios.post('http://localhost:5000/api/upload', form);
    
    const url = res.data.url;
    setFormData(prev => ({ ...prev, profilePicUrl: url }));
    setPreview(url);
  } catch (err) {
    console.error('Upload failed:', err);
    setAlert({ show: true, message: 'Image upload failed', type: 'error' });
  } finally {
    setUploading(false);
  }
};

  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      setAlert({ show: true, message: error, type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`http://localhost:5000/api/users/${user._id}`, formData);
      setAlert({ show: true, message: res.data.message || "Profile updated!", type: 'success' });
      setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
        onClose();
      }, 1500);
    } catch (err) {
      setAlert({ show: true, message: err.response?.data?.message || "Update failed", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const  toTitleCase = (str) => {
    return str
    ?.toLowerCase()
    .split(" ")
    .map(word=> word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4">
      <div
        className="relative bg-[var(--form-bg)] w-full max-w-3xl rounded-lg shadow-lg text-[var(--text-main)] flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 w-9 h-9 text-lg font-bold bg-[var(--input-bg)] hover:bg-[var(--error)] hover:text-white rounded-full flex items-center justify-center transition duration-200"
          title="Close"
        >
          ×
        </button>

        {/* Alert */}
        {alert.show && (
          <div
            className={`p-3 text-sm text-center ${
              alert.type === 'success' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto p-6 pb-32">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--input-border)] mb-2">
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-xs text-white">
                  Uploading...
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="text-sm"
            />
          </div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {fields.map((field) => (
    <div key={field} className="flex flex-col">
      <label className="text-sm mb-1 text-[var(--btn-bg)] flex items-center font-medium">
        {fieldIcons[field]}
        {fieldLabels[field]}
      </label>

      {field === "bio" || field === "prayerRequest" ? (
        <textarea
          name={field}
          value={formData[field] || ""}
          onChange={handleChange}
          rows="3"
          className="p-2 rounded-md bg-[var(--input-bg)] text-white placeholder-white/60 focus:outline-none"
        />
      ) : field === "dob" ? (
        <input
          type="date"
          name={field}
          value={formData[field]?.substring(0, 10) || ""}
          onChange={handleChange}
          className="p-2 rounded-md bg-[var(--input-bg)] text-white placeholder-white/60 focus:outline-none"
        />
      ) : field === "gender" ? (
        <select
          name="gender"
          value={formData.gender || ""}
          onChange={handleChange}
          className="p-2 rounded-md bg-[var(--input-bg)] text-white focus:outline-none"
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      ) : field === "name" ? (
  <input
    type="text"
    name="name"
    value={toTitleCase(formData.name || "")}
    onChange={handleChange}
    className="p-2 rounded-md bg-[var(--input-bg)] text-white placeholder-white/60 focus:outline-none"
  />
) : (
  <input
    type="text"
    name={field}
    value={formData[field] || ""}
    onChange={handleChange}
    className="p-2 rounded-md bg-[var(--input-bg)] text-white placeholder-white/60 focus:outline-none"
  />
)}
    </div>
  ))}
</div>
        </div>

        {/* Save Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--form-bg)] border-t border-[var(--input-border)]">
          <button
            className="btn w-full"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;