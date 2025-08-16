import React, { useState } from "react";
import assets from "../assets/assets";
import { X, Image, Video as VideoIcon } from "lucide-react";
import CustomAlert from "../component/shared/CustomAlert"; // adjust path if needed

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const user = assets.currentUser;

  const handleSubmit = async () => {
    if (!content && images.length === 0 && videos.length === 0) {
      setAlert({
        message: "Please add content, images, or videos",
        type: "warning",
      });
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setContent("");
      setImages([]);
      setVideos([]);
      setAlert({
        message: "Post published successfully!",
        type: "success",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Post</h1>
          <p className="text-slate-600">Share your thoughts with the world</p>
        </div>

        {/* Form */}
        <div className="max-w-xl bg-white p-4 sm:pb-3 rounded-xl shadow-md space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <img
              src={user.profile_image}
              alt="Profile"
              className="w-12 h-12 rounded-full shadow"
            />
            <div>
              <h2 className="font-semibold">{user.full_name}</h2>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            className="w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder-gray-400"
            placeholder="What's on your mind?"
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {images.map((image, i) => (
                <div key={i} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Upload"
                    className="h-20 rounded-md"
                  />
                  <div
                    onClick={() =>
                      setImages(images.filter((_, index) => index !== i))
                    }
                    className="absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer"
                  >
                    <X className="w-6 h-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Video Previews */}
          {videos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {videos.map((video, i) => (
                <div key={i} className="relative group">
                  <video
                    src={URL.createObjectURL(video)}
                    className="h-20 rounded-md"
                    controls
                    onError={() =>
                      setAlert({
                        message: `Video ${video.name} could not be loaded. Please try another file.`,
                        type: "error",
                      })
                    }
                  />
                  <button
                    onClick={() =>
                      setVideos(videos.filter((_, index) => index !== i))
                    }
                    className="absolute top-1 right-1 bg-black/60 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-300">
            {/* Image Upload */}
            <label
              htmlFor="images"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer"
            >
              <Image className="w-6 h-6" />
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              hidden
              multiple
              onChange={(e) => setImages([...images, ...e.target.files])}
            />

            {/* Video Upload */}
            <label
              htmlFor="videos"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer"
            >
              <VideoIcon className="w-6 h-6" />
            </label>
            <input
              type="file"
              id="videos"
              accept="video/*"
              hidden
              multiple
              onChange={(e) => {
                const selectedVideos = Array.from(e.target.files);
                const validVideos = [];
                let rejected = false;

                selectedVideos.forEach((file) => {
                  if (file.size <= 20 * 1024 * 1024) {
                    validVideos.push(file);
                  } else {
                    rejected = true;
                  }
                });

                if (rejected) {
                  setAlert({
                    message: "Each video must be less than 20MB",
                    type: "warning",
                  });
                }

                setVideos([...videos, ...validVideos]);
              }}
            />

            {/* Publish Button */}
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="btn flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                "Publish Post"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Alert */}
      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default CreatePost;