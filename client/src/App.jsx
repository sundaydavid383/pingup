import {useEffect } from 'react';
import "./styles/ui.css"
import { Routes, Route } from 'react-router-dom';
import AuthContainer  from './pages/AuthContainer';
import Feed from './pages/Feed';
import Messages from './pages/Messages';
import ChatBox from './pages/ChatBox';
import Connections from './pages/Connections';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import { useAuth } from "./context/AuthContext";
import Layout from './pages/Layout';
import UserModal from "./component/UserModal";
import {Toaster} from 'react-hot-toast';
import StoriesBar from './component/StoriesBar';
const App = () => {
  const { user, modalOpen, setModalOpen } = useAuth();
  

   const  toTitleCase = (str) => {
    return str
    ?.toLowerCase()
    .split(" ")
    .map(word=> word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    };


  useEffect(() => {
   document.title = modalOpen ? toTitleCase(user?.name) : "SpringsConnect – News Feed";
  document.body.style.overflow = modalOpen ? 'hidden' : 'auto';
  return () => (document.body.style.overflow = 'auto');
}, [modalOpen, user]);
  return (
    <>
      {modalOpen && <UserModal user={user} onClose={() => setModalOpen(false)} />}
    <Toaster/>
   
   <Routes>
  {/* Public or Auth route */}
  <Route path="/" element={!user ? <AuthContainer /> : <Layout />}>
    {/* All protected routes go here as children of Layout */}
    
    <Route index element={<Feed />} />
    <Route path="messages" element={<Messages />} />
    <Route path="chatbox/:userId" element={<ChatBox />} />
    <Route path="connections" element={<Connections />} />
    <Route path="discover" element={<Discover />} />
    <Route path="profile" element={<Profile />} />
    <Route path="profile/:profileId" element={<Profile />} />
    <Route path="create-post" element={<CreatePost />} />
  </Route>
</Routes>
    </>
  );
};

export default App;