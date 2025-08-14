import { Eye, MessageSquare } from 'lucide-react'
import React, {useState, useEffect} from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Messages = () => {
  const [messages, setMessages] = useState([])

  const fetchMessages = async () => {
     setMessages(assets.dummyMessageData)
  }
  useEffect(() => {
     fetchMessages()
  }, [])

  const navigate = useNavigate()  
  return (
    <div className='min-h-screen relative bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
         {/* Title */}
         <div className='mb-8'>
          <h1 className='text-2xl font-bold text-slate-900 mb-2'>Messages</h1>
          <p className='text-slate-600'>Recent messages from your church community</p>
      </div>

      {/* Connected Users */}
      <div className='flex flex-col gap-3'>
        {messages.map((user)=>(
          <div key={user._id} className='max-w-xl flex flex-warp gap-5
          p-6 bg-white shadow rounded-md'>
            <img src={user.profile_image} alt='' 
            className='rounded-full size-12 mx-auto'
            />
            <div className='flex-1'>
              <p className='font-medium text-slate-700'>{user.full_name}</p>
              <p  className='text-slate-500'>
                @{user.username}</p>
              <p className='text-s, text-gray-600'>
                {user.bio}</p>
            </div>

            <div className='flex flex-col gap-2 mt-4'>
              <button onClick={()=> navigate(`/chatbox/${user._id}`)} className='size-10 flex items-center
              justify-center text-sm rounded bg-slate-100 hover:bg-slate-200
              text-slate-800 active:scale-95 transition cursor-pointer
              gap-1'>
                <MessageSquare  className='w-4 h-4'/>
            </button>
            <button 
            onClick={()=> navigate(`/profile/${user._id}`)}
             className='size-10 flex items-center
              justify-center text-sm rounded bg-slate-100 hover:bg-slate-200
              text-slate-800 active:scale-95 transition cursor-pointer
              '>
                <Eye  className='w-4 h-4'/>
            </button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

export default Messages
