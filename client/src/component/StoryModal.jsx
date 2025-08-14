import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react'
import React, { useState } from 'react'
import Loading from './shared/Loading';
import CustomAlert from './shared/CustomAlert';

const StoryModal = ({setShowModal, fetchStories}) => {

    const bgColors = [
  "linear-gradient(135deg, #4f46e5, #1e40af)", // gradient example
  "#db2777",
  "#e11d48",
  "#ca8a04",
  "#0d9488",
  "#0f172a",
];

   const [alert, setAlert] = useState(null); // { message: '', type: '' }
   const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("text")
    const [background, setBackground] = useState(bgColors[0])
  const [text, setText] = useState("")
  const [media, setMedia] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

const handleMediaUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const maxSize = 10; // MB
    const fileSizeInMB = file.size / (1024 * 1024);

    if (fileSizeInMB > maxSize) {
      setAlert({ message: `File size exceeds ${maxSize}MB limit.`, type: "error" });
      return;
    }

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setAlert({ message: "Only images and videos are allowed.", type: "error" });
      return;
    }

    setMedia(file);
    setPreviewUrl(URL.createObjectURL(file));
  }
};

 const handleCreateStory = async () => {
  setLoading(true);
  try {
    // Simulate upload or API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    fetchStories();
    setShowModal(false);

    setAlert({ message: "Story created successfully!", type: "success" });
  } catch (err) {
    setAlert({ message: `Error creating story: ${err.message}`, type: "error" });
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur
    text-[var(--text-main)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className='text-center mb-4 flex items-center justify-between'>
            <button onClick={()=> setShowModal(false)} 
            className='text-[var(--text-main)] p-2 cursor-pointer'>
                <ArrowLeft/>
            </button>
            <h2 className="text-lg font-semibold">
                Create Story
            </h2>
            <span className="w-10"></span>
        </div>

     <div
  className="rounded-lg h-96 p-6 flex items-center justify-center relative"
  style={{ background: background }} // use "background", not "backgroundColor"
>
  {mode === "text" && (
    <textarea
      className="bg-transparent text-[var(--text-main)] w-full h-full text-lg resize-none focus:outline-none"
      placeholder="What's on your mind?"
      onChange={(e) => setText(e.target.value)}
      value={text}
    />
  )}{ mode === "media" && previewUrl && (
    media?.type.startsWith("image") ? (
      <img src={previewUrl} alt="Story Preview" className="object-contain max-h-full" />
  ) : (
      <video
  src={previewUrl}
  type={media?.type}
  controls
  className="max-h-full max-w-full object-contain"
/>
    )
  )}
</div>

<div className="flex gap-2 mt-4">
   {
bgColors.map((color, index) => (
      <button
        key={index}
        className="w-6 h-6 rounded-full ring
         cursor-pointer"
        style={{ background: color }}
        onClick={() => setBackground(color)}
      />
    ))}
   
</div>

<div className="flex gap-2 mt-4">
  <button onClick={()=> {setMode('text'); setMedia(null)}} className={`flex-1 flex items-center justify-center gap-2
  p-2 rounded cursor-pointer ${mode === "text" ? 
    "bg-white text-black" : "bg-zinc-800"}`}>
      <TextIcon size={18}/> Text
    </button>

    <label htmlFor="storyFile" className={`flex-1 flex items-center justify-center gap-2
  p-2 rounded cursor-pointer ${mode === 'media' ? "bg-white text-black" : "bg-zinc-800"}`}>
  
  <input 
    id="storyFile"
    onChange={(e)=>{handleMediaUpload(e); setMode('media')}} 
    type="file" 
    accept="image/* video/*"
    className="hidden"
  />
  <Upload size={18}/> Images/Videos
</label>
</div>

<button onClick={handleCreateStory}
 className="btn w-full mt-3">
  <Sparkle size={18}/> Create Now
  </button>
      </div>
      {loading && <Loading text="Creating story..." />}
{alert && (
  <CustomAlert
    message={alert.message}
    type={alert.type}
    onClose={() => setAlert(null)}
  />
)}
    </div>
  )
}

export default StoryModal
