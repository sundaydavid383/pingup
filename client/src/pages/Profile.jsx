import React, { useState, useEffect } from 'react'
import { Links, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';
import assets from '../assets/assets'
import '../styles/ui.css'
import Loading from '../component/shared/Loading'
import UserProfileInfo from '../component/UserProfileInfo'
import PostCard from '../component/PostCard'
import moment from 'moment'
import ProfileModal from '../component/ProfileModal';

const Profile = () => {
  const {profileId} = useParams()

  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)

  const fetchUser = async () =>{

    setUser(assets.currentUser);
    setPosts(assets.dummyPostData)
  }

  useEffect(() => {
    fetchUser()
  }, [])
  
  return  user ? (
    <div className='relative h-full 
    overflow-y-scroll bg-gray-50 p-6'>
      <div className='max-w-3xl mx-auto'>
        {/*Profile card */}
        <div className="bg-white rounded-2xl
         shadow overflow-hidden">
          {/* Cover photo */}
          <div className="h-40 md:h-56 bg-multi-gradient">
            {user.cover_photo && <img src={user.cover_photo} 
            alt=""
            className='w-full h-full object-cover'/> }
          </div>
          {/* User IUnfo */}
          <UserProfileInfo user={user}
          posts={posts} profileId={profileId}
          setShowEdit={setShowEdit}/>
        </div>

        {/* tabs */}
        <div className='mt-6'>
          <div className='bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'>
            {["posts", "media", "likes"].map((tab)=>(
              <button key={tab}
              onClick={()=> setActiveTab(tab)}
               className={`flex-1 px-4 py-2 text-sm font-medium
                rounded-lg transition-colors cursor-pointer 
              ${activeTab === tab ? "bg-[var(--accent)] text-[var(--white)]"
                :
              "bg-[var(--white)] text-gray-600 hover:text-gray-900"}`}>
               {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* posts */}
        {activeTab === 'posts' && (
          <div className='flex flex-col gap-3 mt-xl'>
            {
              posts.map((post)=> 
              <PostCard post={post} key={post._id}/>)
            }
          </div>
        )}
        {/* Media */}
        {activeTab === 'media' && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 max-w-6xl">
    {posts
      .filter((post) => post.image_urls.length > 0)
      .map((post) =>
        post.image_urls.map((image, index) => (
          <Link
            target="_blank"
            to={image}
            key={`${post.id}-${index}`}
            className="relative group overflow-hidden rounded-xl shadow-md"
          >
            <img
              src={image}
              alt="Post media"
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <p className="absolute bottom-0 right-0 text-xs px-3 py-1 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition duration-300">
              Posted {moment(post.createdAt).fromNow()}
            </p>
          </Link>
        ))
      )}
  </div>
)}
      </div>

      {/* edit user profile */}
      {showEdit && <ProfileModal setShowEdit={setShowEdit}/>}
    </div>
  ) : (<Loading/>)
}

export default Profile
