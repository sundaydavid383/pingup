import React, { useState } from 'react'
import {Users, UserPlus, UserCheck, UserRoundPen, MessageSquare, UsersRound} from "lucide-react"
import { useNavigate } from 'react-router-dom'
import assets  from '../assets/assets';
import "../styles/ui.css";

const Connections = () => {
  let followers = assets.dummyFollowersData;
  let following = assets.dummyFollowingData;
  let pendingConnections = assets.dummyPendingConnectionsData
  let connections = assets.dummyConnectionsData;



  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('Followers');
  const dataArray = [
    {label: 'Followers', value: followers, icon: Users},
    {label: 'Following', value: following, icon: UserCheck},
    {label: 'Pending', value: pendingConnections, icon: UserRoundPen},
    {label: 'Connections', value: connections, icon: UserPlus},
  ]
  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
       
        {/* Title */}
         <div className='mb-8'>
          <h1 className='text-2xl font-bold text-slate-900 mb-2'>Connections</h1>
          <p className='text-slate-600'>Manage your network and discover new 
            connections
          </p>
      </div>

{/* Counts */}
<div className="mb-8 flex flex-wrap gap-6 justify-center">
  {dataArray.map((item, index) => (
    <div
      key={index}
      className="flex flex-col items-center justify-center gap-1 
                 border h-24 w-40 border-gray-200 bg-white shadow 
                 rounded-md p-4 text-center"
    >
      <b className="text-[20px] text-slate-900">{item.value.length}</b>
      <p className="text-slate-600 text-[18px]">{item.label}</p>
    </div>
  ))}
</div>

     {/* Tabs */}
<div className='inline-flex flex-wrap items-center
  border border-gray-200 rounded-md p-1 bg-[var(--white)] shadow-sm'>
  {dataArray.map((tab) => (
    <button
      onClick={() => setCurrentTab(tab.label)}
      key={tab.label}
      className={`flex items-center px-3 
        py-1 text-sm rounded-md transition-colors
        ${currentTab === tab.label ? 'bg-[var(--white)] font-medium text-black' : 'text-gray-500 hover:text-black'}
      `}
    >
      <tab.icon className='w-4 h-4 mr-1' />
      {tab.label}
      {tab.count !== undefined && (
        <span className='ml-2 text-xs bg-gray-100 
          text-gray-700 px-2 py-0.5 rounded-full'>
          {tab.count}
        </span>
      )}
    </button>
  ))}
</div>

      {/* Connections List */}
      <div className='flex flex-wrap gap-6 mt-6'>
        {dataArray.find((item)=> item.label === currentTab)?.value.map((user)=>(
          <div key={user._id} className='w-full max-w-88 flex gap-5 
          p-6 bg-[var(--white)] shadow rounded-md'>
            <img src={user.profile_image} alt='' 
            className='rounded-full w-12 h-12 shadow-md mx-auto' />
            <div className='flex-1'>
              <p className='font-medium text-slate-700'>{user.full_name}</p>
              <p className='text-slate-500'>@{user.username}</p>
              <p className='text-sm text-gray-600'>{user.bio.slice(0, 30)}...</p>
            <div className='flex max-sm:flex-col gap-2 mt-4'>
  <button onClick={() => navigate(`/profile/${user._id}`)} className='btn'>
    View Profile
  </button>

  {currentTab === 'Following' && (
    <button className='btn'>Unfollow</button>
  )}
  {currentTab === 'Pending' && (
    <button className='btn'>Accept</button>
  )}
  {currentTab === 'Connections' && (
    <button onClick={() => navigate(`/chatbox/${user._id}`)} className='btn'>
      <MessageSquare className='w-4 h-4' />
      Message
    </button>
  )}
</div>
            </div>
          </div>
          ))}
      </div>

      </div>
    </div>
  )
}

export default Connections
