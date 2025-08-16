import React, { useState } from "react";
import axios from "axios";
import {
  UserRound,
  Mail,
  Info,
  Briefcase,
  MapPin,
  Home,
  Heart,
  GraduationCap,
  Building2,
  Church,
  Users,
  Sparkles,
} from "lucide-react";

const fields = [
  "username",
  "name",
  "email",
  "gender",
  "bio",
  "occupation",
  "location",
  "homeTown",
  "currentCity",
  "relationshipStatus",
  "school",
  "workplace",
  "churchName",
  "churchRole",
  "interests",
];

const fieldLabels = {
  username: "Username",
  name: "Full Name",
  email: "Email",
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
};

const fieldIcons = {
  username: <UserRound size={16} className="mr-2" />,
  name: <UserRound size={16} className="mr-2" />,
  email: <Mail size={16} className="mr-2" />,
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
};

const UserModal = ({ user = {}, onClose }) => {
  const [formData, setFormData] = useState(() => ({ ...user }));
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(user.profilePicUrl || "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toTitleCase = (str) =>
    str
      ?.toLowerCase()
      .split(" ")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
      .join(" ");

  const validateForm = () => {
    const { name, email, username } = formData;
    if (!username || username.trim().length < 3)
      return "Username must be at least 3 characters";
    if (!name || name.trim().length < 3) return "Name must be at least 3 characters";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email address";
    return null;
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("profilePic", file);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/api/auth/upload-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // support multiple response shapes
      const url = res.data?.url || res.data?.imageUrl || res.data?.imageUrlFull || "";
      if (!url) throw new Error("No image URL returned from server");
      setFormData((p) => ({ ...p, profilePicUrl: url }));
      setPreview(url);
      setAlert({ show: true, message: "Image uploaded", type: "success" });
    } catch (err) {
      console.error("Upload failed:", err);
      setAlert({ show: true, message: "Image upload failed", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      setAlert({ show: true, message: error, type: "error" });
      return;
    }

    try {
      setLoading(true);
      const userId = formData._id || user._id;
      // NOTE: make sure your backend exposes PUT /api/auth/update/user/:userId
      const res = await axios.put(`http://localhost:5000/api/auth/update/user/${userId}`, formData);
      setAlert({ show: true, message: res.data.message || "Profile updated!", type: "success" });

      setTimeout(() => {
        setAlert({ show: false, message: "", type: "" });
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Update error:", err);
      setAlert({
        show: true,
        message: err.response?.data?.message || "Update failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hidden_scrollbar fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4">
      <div
        className="relative bg-[var(--form-bg)] w-full max-w-3xl rounded-lg shadow-lg text-[var(--text-main)] flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 w-9 h-9 text-lg font-bold bg-[var(--input-bg)] hover:bg-[var(--error)] hover:text-white rounded-full flex items-center justify-center transition duration-200"
          title="Close"
        >
          ×
        </button>

        {alert.show && (
          <div className={`p-3 text-sm text-center ${alert.type === "success" ? "text-green-500" : "text-red-500"}`}>
            {alert.message}
          </div>
        )}

        <div className="overflow-y-auto p-6 pb-32">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--input-border)] mb-2">
              <img src={preview || "/placeholder-profile.png"} alt="Profile" className="w-full h-full object-cover" />
              {uploading && <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-xs text-white">Uploading...</div>}
            </div>
            <input type="file" accept="image/*" onChange={handleUpload} className="text-sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => {
              const id = `${field}-input`;
              return (
                <div key={field} className="flex flex-col">
                  <label htmlFor={id} className="text-sm mb-1 text-[var(--btn-bg)] flex items-center font-medium">
                    {fieldIcons[field]}
                    <span className="ml-1">{fieldLabels[field]}</span>
                  </label>

                  {field === "churchRole" ? (
                    <select id={id} name="churchRole" value={formData.churchRole || ""} onChange={handleChange} className="p-2 rounded-md bg-[var(--input-bg)] text-white focus:outline-none">
                      <option value="">Select Role</option>
                      <option value="Member">Member</option>
                      <option value="Choir">Choir</option>
                      <option value="Usher">Usher</option>
                      <option value="Sunday School Teacher">Sunday School Teacher</option>
                      <option value="Prayer Team">Prayer Team</option>
                      <option value="Pastor">Pastor</option>
                      <option value="Deacon">Deacon</option>
                      <option value="Elder">Elder</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : field === "gender" ? (
                    <select id={id} name="gender" value={formData.gender || ""} onChange={handleChange} className="p-2 rounded-md bg-[var(--input-bg)] text-white focus:outline-none">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  ) : field === "bio" ? (
                    <textarea id={id} name={field} value={formData[field] || ""} onChange={handleChange} rows="3" className="p-2 rounded-md bg-[var(--input-bg)] text-white placeholder-white/60 focus:outline-none" />
                  ) : field === "name" ? (
                    <input id={id} type="text" name="name" value={formData.name || ""} onChange={handleChange} onBlur={() => setFormData((p) => ({ ...p, name: toTitleCase(p.name || "") }))} className="p-2 rounded-md bg-[var(--input-bg)] text-white placeholder-white/60 focus:outline-none" />
                  ) : (
                    <input id={id} type={field === "email" ? "email" : "text"} name={field} value={formData[field] || ""} onChange={handleChange} className="p-2 rounded-md bg-[var(--input-bg)] text-white placeholder-white/60 focus:outline-none" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--form-bg)] border-t border-[var(--input-border)]">
          <button className="btn w-full" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;