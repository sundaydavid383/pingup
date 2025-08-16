import React, { useMemo, useState } from 'react';
import { Pencil } from 'lucide-react';
import assets from "../assets/assets";

const ProfileModal = ({ setShowEdit }) => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const parsed = stored ? JSON.parse(stored) : {};
  const baseUser = Object.keys(parsed).length ? parsed : (assets?.currentUser || {});

  const [editForm, setEditForm] = useState({
    name: baseUser.name || "",
    bio: baseUser.bio || "",
    location: baseUser.location || "",
    churchName: baseUser.churchName || "",
    churchRole: baseUser.churchRole || "",
    occupation: baseUser.occupation || "",
    interests: baseUser.interests || "",
    prayerRequest: baseUser.prayerRequest || "",
    relationshipStatus: baseUser.relationshipStatus || "",
    school: baseUser.school || "",
    workplace: baseUser.workplace || "",
    homeTown: baseUser.homeTown || "",
    currentCity: baseUser.currentCity || "",
    profilePicFile: null,
    coverPhotoFile: null,
  });

  const avatarSrc = useMemo(() => {
    if (editForm.profilePicFile instanceof File) return URL.createObjectURL(editForm.profilePicFile);
    return baseUser.profilePicUrl || null;
  }, [editForm.profilePicFile, baseUser.profilePicUrl]);

  const coverSrc = useMemo(() => {
    if (editForm.coverPhotoFile instanceof File) return URL.createObjectURL(editForm.coverPhotoFile);
    return baseUser.coverPhotoUrl || null;
  }, [editForm.coverPhotoFile, baseUser.coverPhotoUrl]);

  const initials = useMemo(() => {
    const n = (editForm.name || baseUser.name || "").trim();
    if (!n) return "DP";
    const parts = n.split(/\s+/);
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  }, [editForm.name, baseUser.name]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    console.log("Updated Data:", editForm);
    setShowEdit(false);
  };

  return (
    <div className="fixed inset-0 z-[110] h-screen overflow-y-auto bg-black/50">
      <div className="max-w-2xl sm:py-6 mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Edit Profile</h1>

          <form className="space-y-4" onSubmit={handleSaveProfile}>
            {/* Profile Picture */}
            <div>
              <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
              <input
                id="profile_image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setEditForm((s) => ({ ...s, profilePicFile: e.target.files?.[0] || null }))}
              />
              <label htmlFor="profile_image" className="group/profile relative inline-block cursor-pointer">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Profile" className="w-24 h-24 rounded-full object-cover mt-2" />
                ) : (
                  <div className="w-24 h-24 rounded-full mt-2 bg-multi-gradient flex items-center justify-center text-white font-semibold">
                    {initials.toUpperCase()}
                  </div>
                )}
                <div className="absolute hidden group-hover/profile:flex top-2 left-2 right-2 bottom-2 bg-black/25 rounded-full items-center justify-center">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
              </label>
            </div>

            {/* Cover Photo */}
            <div>
              <label htmlFor="cover_photo" className="block text-sm font-medium text-gray-700 mb-1">Cover Photo</label>
              <input
                id="cover_photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setEditForm((s) => ({ ...s, coverPhotoFile: e.target.files?.[0] || null }))}
              />
              <label htmlFor="cover_photo" className="group/cover relative block cursor-pointer">
                {coverSrc ? (
                  <img src={coverSrc} alt="Cover" className="w-full h-40 md:h-56 rounded-lg object-cover mt-2" />
                ) : (
                  <div className="w-full h-40 md:h-56 rounded-lg bg-multi-gradient mt-2" />
                )}
                <div className="absolute hidden group-hover/cover:flex top-2 left-2 right-2 bottom-2 rounded-lg bg-black/20 items-center justify-center">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
              </label>
            </div>

            {/* Editable text fields */}
            {[
              { key: "name", label: "Full Name" },
              { key: "bio", label: "Bio", textarea: true },
              { key: "location", label: "Location" },
              { key: "churchName", label: "Church Name" },
              { key: "churchRole", label: "Church Role" },
              { key: "occupation", label: "Occupation" },
              { key: "interests", label: "Interests" },
              { key: "prayerRequest", label: "Prayer Request", textarea: true },
              { key: "relationshipStatus", label: "Relationship Status" },
              { key: "school", label: "School" },
              { key: "workplace", label: "Workplace" },
              { key: "homeTown", label: "Home Town" },
              { key: "currentCity", label: "Current City" },
            ].map(({ key, label, textarea }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                {textarea ? (
                  <textarea
                    rows={2}
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    value={editForm[key]}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                  />
                ) : (
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg"
                    value={editForm[key]}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
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
              <button type="submit" className="btn">Save changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;