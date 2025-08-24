import React, { useState } from 'react' 
import Sidebar from '../component/Sidebar'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Loading from '../component/shared/Loading';

const Layout = () => {
  const {user} = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return user ? (
    <div className='w-full flex h-screen relative'>
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        className={`
          fixed top-0 left-0 h-full z-50 bg-white shadow-lg transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          sm:relative sm:translate-x-0 sm:w-60 xl:w-72
        `}
      />

      {/* Main Content */}
      <div className="flex-1 bg-slate-50 transition-all duration-300 sm:ml-60 xl:ml-72">
        <Outlet />
      </div>

      {/* Toggle Button (only visible on mobile) */}
      {sidebarOpen ? (
        <X
          className="absolute top-3 right-3 p-2 z-50 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      ) : (
        <Menu
          className="absolute top-3 right-3 p-2 z-50 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        />
      )}
    </div>
  ) : (
    <Loading/>
  )
}

export default Layout