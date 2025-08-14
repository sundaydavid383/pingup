import { MapPin, MessageCircle, Plus, UserPlus } from 'lucide-react'
import React from 'react'
import assets from '../assets/assets'

const UserCard = ({ user }) => {
  const currentUser = assets.currentUser
  // JSON.parse(localStorage.getItem('User'))

  const handleFollow = async () => { }
  const handleConnectionRequest = async () => { }

  return (
    <div
      key={user._id}
      className="p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-200 rounded-md"
    >
      {/* Profile Info */}
      <div className="text-center">
       <img
  src={user.profile_image || "https://via.placeholder.com/150"}
  onError={(e) => e.target.src = "https://via.placeholder.com/150"}
  alt={user.full_name}
  className="w-20 h-20 object-cover rounded-full shadow-md mx-auto"
/>
        <p className="mt-4 font-semibold">{user.full_name}</p>
        {user.username && (
          <p className="text-gray-500 font-light">@{user.username}</p>
        )}
        {user.bio && (
          <p className="text-gray-600 mt-2 text-center text-sm px-4">
            {user.bio}
          </p>
        )}
      </div>

      {/* Location & Followers */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-600">
        <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1">
          <MapPin className="w-4 h-4" /> {user.location}
        </div>
        <div className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1">
          <span>{user.followers.length} Followers</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center mt-5 gap-3">
        {/* Follow Button */}
        <button
          onClick={handleFollow}
          disabled={currentUser?.following.includes(user._id)}
          className="btn"
        >
          <UserPlus className="w-4 h-4" />
          {currentUser?.following.includes(user._id) ? 'Following' : 'Follow'}
        </button>

        {/* Connection Request / Message Button */}
        <button
          onClick={handleConnectionRequest}
          className="btn"
        >
          {currentUser?.connections.includes(user._id) ? (
            <MessageCircle className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  )
}

export default UserCard