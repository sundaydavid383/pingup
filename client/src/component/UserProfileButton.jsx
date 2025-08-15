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
    logout(); // call the logout function passed from context
    setShowNotifier(false);
  };

  const handleCancel = () => {
    setShowNotifier(false);
  };

  return (
    <div className="flex items-center justify-between w-full p-2">
      {/* Profile (Clickable Area) */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <img
          src={user.profilePicUrl}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border border-[var(--input-border)]"
        />
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