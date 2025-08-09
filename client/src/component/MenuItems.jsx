import React from 'react';
import { NavLink } from 'react-router-dom';
import assets from '../assets/assets';
import "../styles/ui.css"; // includes the .custom-gradient class

const MenuItems = ({ setSidebarOpen }) => {
  return (
    <div className="px-3 space-y-0.5 font-medium text-[var(--text-light)]">
      {assets.menuItemsData.map(({ to, label, icon: Icon }) => (
   <NavLink
  key={to}
  to={to}
  end={to === '/'}
  onClick={() => setSidebarOpen(false)}
  className={({ isActive }) =>
    `pl-3 py-[7px] flex items-center gap-2 rounded-md text-sm transition-transform duration-500 ease-in-out ${
      isActive
        ? 'translate-x-3 custom-gradient text-[var(--text-accent-dark)] font-semibold'
        : 'hover:translate-x-3 gradient-hover hover:text-[var(--text-accent-dark)] hover:shadow-sm'
    }`
  }
>
  {Icon && <Icon className="w-4 h-4" />}
  <span className="truncate">{label}</span>
</NavLink>
      ))}
    </div>
  );
};

export default MenuItems;