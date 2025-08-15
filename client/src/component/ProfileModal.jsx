import React, { useState } from 'react';
import assets from "../assets/assets";
import { Pencil } from 'lucide-react';

const ProfileModal = ({ setShowEdit }) => {
  const user = assets.currentUser;
  const [editForm, setEditForm] = useState({
    username:user.username,
    bio: user.bio,
    location: user.location,
    profile_image: user.profile_image,
    full_name: user.full_name,
  })

  const handleSaveProfile = async (e)=>{
    e.preventDefault();
  }
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0
    z-[110] h-screen overflow-y-scroll bg-black/50'>
      <div className='max-w-2xl sm:py-6 mx-auto'>
        <div className='bg-white rounded-lg shadow p-6'>
           <h1 className='text-2xl font-bold text-slate-900 mb-2'>Edit Profile</h1>
        
        <form className='space-y-4' onSubmit={handleSaveProfile}>
          {/* Profile Picture */}
          <div> 
            <label htmlFor='profile_image'
            className='block text-sm font-medium text-gray-700 mb-1'>
              Profile Picture
              <input type='file'accept='image/*'
               id="profile_image"
               className='w-full p-3 border border-gray-200 rounded-lg'
               onChange={(e)=>setEditForm({...editForm, profile_image:e.target.files[0]})}/>
               <div className='group/profile relative'>
              <img
                src={
                  editForm.profile_image instanceof File
                    ? URL.createObjectURL(editForm.profile_image)
                    : editForm.profile_image || user.profile_image
                }
                alt=""
                className="w-24 h-24 rounded-full object-cover mt-2"
              />
               
               <div className='absolute hidden group-hover/profile:flex top-0 
               left-0 right-0 bottom-0 bg-black/20 rounded-full items-center justify-center'>
                <Pencil className='w-5 h-5 text-white'/>
               </div>
               </div>
            </label>
          </div>
        </form>
        
        </div>
      </div>
                       {/* {!profileId && <button onClick={()=>setShowEdit(true)}
                 className='btn'> <PenBox className='w-4 h-4'/>Edit</button>
                } */}
    </div>
  )
}

export default ProfileModal
