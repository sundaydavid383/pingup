import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ActionNotifier from './shared/ActionNotifier';

const UserProfileButton = () => {
  const { user, setModalOpen, logout } = useAuth();
  const [showNotifier, setShowNotifier] = useState(false);

  const handleLogoutClick = () => {
    setShowNotifier(true);
  };

  const handleConfirm = () => {
    logout(); 
    setShowNotifier(false);
  };

  const handleCancel = () => {
    setShowNotifier(false);
  };

  

const getFirstLetterOfNameForFallbackAvatar  = (name) => {
  if (!name) return '?';

  const parts = name.trim().split(" "); // split by space
  if (parts.length === 1) {
    // only one name (e.g. "Sunday")
    return parts[0].charAt(0).toUpperCase();
  } else {
    // at least two parts (e.g. "Sunday David")
    const firstInitial = parts[0].charAt(0).toUpperCase();
    const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  }
};

  return (
    <div className="flex items-center justify-between w-full p-2">
      {/* Profile (Clickable Area) */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
          {user?.profilePicUrl ? (
          <img
            src={user.profilePicUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-[var(--input-border)]"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--primary)] text-white font-semibold border border-[var(--input-border)]"
          >
            {getFirstLetterOfNameForFallbackAvatar(user?.name)}
          </div>
        )}
        <div className="flex flex-col overflow-hidden">
          <p className="text-sm font-semibold truncate text-[var(--text-main)] capitalize">
            {user.name}
          </p>
          <p className="text-xs text-[var(--text-secondary)] truncate">
            {user.email}
          </p>
        </div>
      </div>

      {/* Logout Icon */}
      <button
        onClick={handleLogoutClick}
        title="Logout"
        className="text-[var(--text-secondary)] hover:text-[var(--text-main)] transition duration-200 ml-3"
      >
        <LogOut className="w-5 h-5" />
      </button>

      {/* ActionNotifier Modal */}
      {showNotifier && (
        <ActionNotifier
          action="logout"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default UserProfileButton;