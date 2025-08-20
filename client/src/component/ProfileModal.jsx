import React, { useState, useMemo, useEffect } from "react";
import { Pencil } from "lucide-react";
import axiosBase from "axios";
import assets from "../assets/assets";
import CustomAlert from "./shared/CustomAlert"

const api = axiosBase.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

const RELATIONSHIP_OPTIONS = ["Single", "Married", "Prefer not to say"];
const CHURCH_ROLE_OPTIONS = [
  "Member", "Usher", "Choir", "Elder", "Pastor", "Leader",
  "Prayer Team", "Youth Leader", "Other"
];
const INTEREST_OPTIONS = [
  "Music", "Sports", "Bible Study", "Tech and Media",
  "Youth Programs", "Volunteering", "Prayer & Counseling",
  "I'm just exploring"
];

const ProfileModal = ({ setShowEdit }) => {
  const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const parsed = stored ? JSON.parse(stored) : {};
  const baseUser = Object.keys(parsed).length ? parsed : assets?.currentUser || {};

  const [formData, setFormData] = useState({ ...baseUser });
  const [preview, setPreview] = useState(baseUser.profilePicUrl || "");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 🟢 Handle alert message
  const setMsg = (message, type) => setAlert({ show: true, message, type });

  // 🟢 File upload handler
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\//.test(file.type)) return setMsg("Please select a valid image.", "error");
    if (file.size > 3 * 1024 * 1024) return setMsg("Image too large (max 3MB).", "error");

    const fd = new FormData();
    fd.append("profilePic", file);

    try {
      setUploading(true);
      const { data } = await api.post("/api/auth/upload-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = data?.url || data?.imageUrl || data?.imageUrlFull || "";
      if (!url) throw new Error("No image URL returned from server.");

      setFormData((p) => ({ ...p, profilePicUrl: url }));
      setPreview(url);
      setMsg("Image uploaded.", "success");
    } catch (err) {
      setMsg(err.response?.data?.message || "Image upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  // 🟢 Save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const userId = formData._id || baseUser._id;
      const payload = {
        ...formData,
        username: formData.username?.trim(),
        name: formData.name?.trim(),
        email: formData.email?.trim(),
      };

      const { data } = await api.put(`/api/auth/update/user/${userId}`, payload);
      setMsg(data?.message || "Profile updated!", "success");

      const updatedUser = data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setFormData(updatedUser);

      setTimeout(() => setShowEdit(false), 900);
    } catch (err) {
      setMsg(err.response?.data?.message || "Update failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const initials = useMemo(() => {
    const n = (formData.name || "").trim();
    if (!n) return "DP";
    const parts = n.split(/\s+/);
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  }, [formData.name]);

  return (
    <div className="fixed inset-0 z-[110] h-screen overflow-y-auto bg-black/50">
      <div className="max-w-2xl sm:py-6 mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Edit Profile</h1>

       {alert.show && (
  <CustomAlert
    message={alert.message}
    type={alert.type}
    onClose={() => setAlert({ show: false, message: "", type: "" })}
  />
)}

          <form className="space-y-4" onSubmit={handleSaveProfile}>
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <label className="group/profile relative cursor-pointer">
                <img
                  src={preview || "/placeholder-profile.png"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-xs text-white">
                    Uploading...
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
                <div className="absolute hidden group-hover/profile:flex top-2 left-2 right-2 bottom-2 bg-black/25 rounded-full items-center justify-center">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
              </label>
            </div>

            {/* Editable fields */}
            {[
              { key: "username", label: "Username" },
              { key: "name", label: "Full Name" },
              { key: "email", label: "Email" },
              { key: "bio", label: "Bio", textarea: true },
              { key: "occupation", label: "Occupation" },
              { key: "location", label: "Location" },
              { key: "homeTown", label: "Home Town" },
              { key: "currentCity", label: "Current City" },
              { key: "relationshipStatus", label: "Relationship Status", select: RELATIONSHIP_OPTIONS },
              { key: "workplace", label: "Workplace" },
              { key: "churchName", label: "Church Name" },
              { key: "churchRole", label: "Church Role", select: CHURCH_ROLE_OPTIONS },
              { key: "interests", label: "Interests", select: INTEREST_OPTIONS },
            ].map(({ key, label, textarea, select }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                {textarea ? (
                  <textarea
                    rows={2}
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    value={formData[key] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                  />
                ) : select ? (
                  <select
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    value={formData[key] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                  >
                    <option value="">Select {label.toLowerCase()}</option>
                    {select.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    value={formData[key] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn"
                disabled={loading || uploading}
              >
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;