import logo from './logo.png';
import groupuser from "./plan-a-visit-intro.jpg"
import user1 from "./user2.jpg"
import user2 from "./user3.jpg"
import user3 from "./user4.jpg"
import church1 from "./church1.jpg"
import church2 from "./church2.jpg"
import church3 from "./church3.jpg"
import church4 from "./church4.jpg"
import church5 from "./church5.jpg"
import church6 from "./church6.jpg"
import church7 from "./church7.jpg"
import church8 from "./church8.jpg"
import church9 from "./church9.jpg"

import { FaHome, FaInfoCircle, FaEnvelope, FaBlog, FaTachometerAlt } from 'react-icons/fa';

// ...add all your image imports here

const menuItemsData = [
  { to: '/', label: 'Home', icon: FaHome },
  { to: '/about', label: 'About', icon: FaInfoCircle },
  { to: '/contact', label: 'Contact', icon: FaEnvelope },
  { to: '/blog', label: 'Blog', icon: FaBlog },
  { to: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
];
 const dummyStoriesData = [
  {
    id: 1,
    title: "Youth Revival",
    content: "What a powerful night of worship!",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    profile_image: new URL('./user2.jpg', import.meta.url).href
  },
  {
    id: 2,
    title: "Bible Study",
    content: "Today's word was 🔥🔥🔥",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    media_type: "video",
    media_url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    profile_image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Teens Fellowship",
    content: "So much joy with the teens 🙌",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop",
    profile_image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Sunday Worship",
    content: "Hearts lifted, hands raised!",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    media_type: "video",
    media_url: "https://www.w3schools.com/html/mov_bbb.mp4",
    profile_image: new URL('./user3.jpg', import.meta.url).href
  },
  {
    id: 5,
    title: "Choir Rehearsal",
    content: "Preparing for Sunday service 🎶",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800&auto=format&fit=crop",
    profile_image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Outreach Mission",
    content: "Sharing the Word in the community 💖",
    createdAt: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(),
    media_type: "video",
    media_url: "https://filesamples.com/samples/video/mp4/sample_640x360.mp4",
    profile_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop"
  },
  {
    id: 7,
    title: "Prayer Night",
    content: "An atmosphere of miracles!",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    media_type: "image",
    media_url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop",
    profile_image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop"
  },
  {
    id: 8,
    title: "Children’s Service",
    content: "Teaching the next generation 🌱",
    createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    media_type: "video",
    media_url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_5mb.mp4",
    profile_image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&auto=format&fit=crop"
  }
];
const dummyPostData = [
  {
    id: 1,
    author: {
      name: "David Sunday",
      profileImage: church4,
    },
    content: "God is good all the time! Just shared the Word with amazing teens today 🙌",
    image: church7,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    likes: 12,
    comments: 4,
  },
  {
    id: 2,
    author: {
      name: "Mary Grace",
      profileImage: church5,
    },
    content: "We had an amazing youth worship session today 💖 #SpringsConnect",
    image: church6,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    likes: 30,
    comments: 10,
  },
  {
    id: 3,
    author: {
      name: "John Praise",
      profileImage: church8,
    },
    content: "“Blessed are the pure in heart: for they shall see God.” – Matthew 5:8 ✨",
    image: church9,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    likes: 8,
    comments: 1,
  }
];

const assets = {
    logo,
    groupuser,
    user1,
    user2,
    user3,
    menuItemsData,
    dummyPostData,
    dummyStoriesData,

    // ...list all images
};

export default assets;