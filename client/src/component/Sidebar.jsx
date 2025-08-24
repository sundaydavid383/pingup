import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import "../styles/ui.css";
import MenuItems from './MenuItems';
import { CirclePlus } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import UserProfileButton from './UserProfileButton';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
<div
  className={`w-60 xl:w-72 flex flex-col justify-between items-center 
  max-sm:fixed sm:fixed top-0 bottom-0 z-20 ${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  } transition-all duration-300 ease-in-out`}
  style={{
    backgroundColor: 'var(--form-bg)',
    borderRight: '1px solid var(--input-border)',
    color: 'var(--text-main)',
    height: '100vh',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  }}
>
      {/* TOP SECTION */}
      <div className="w-full px-4 pt-4 overflow-y-auto flex-1">
        <img
          onClick={() => navigate('/')}
          src={assets.logo}
          alt="Logo"
          className="w-20 cursor-pointer mb-2"
        />
        <hr
          style={{ borderColor: 'var(--input-border)' }}
          className="mb-2"
        />

        <MenuItems setSidebarOpen={setSidebarOpen} />

        <Link
          to="/create-post"
          className="btn w-full mt-5 flex gap-2 justify-center items-center"
        >
          <CirclePlus className="w-5 h-5" />
          <span>Create Post</span>
        </Link>
      </div>

      {/* BOTTOM SECTION */}
      <div className="w-full border-t border-[var(--input-border)] p-4 px-7">
        <UserProfileButton user={user} />
      </div>
    </div>
  );
};

export default Sidebar;