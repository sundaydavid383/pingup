import { BadgeCheck, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const StoryViewer = ({ viewStory, setViewStory }) => {
  const [progress, setProgress] = useState(0);
  const [musicUrl, setMusicUrl] = useState(null);
  const audioRef = useRef(null);

useEffect(() => {
  let timer;
  let progressInterval;

  if (viewStory) {
    setProgress(0);


    

    if (viewStory.media_type !== 'video') {
      const duration = 10000; // 10 seconds
      const setTime = 100;
      fetchMusic();

      const start = Date.now();
      progressInterval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - start;
        setProgress((elapsed / duration) * 100);
      }, setTime);

      timer = setTimeout(() => {
        setViewStory(null);
      }, duration);
    }
  }

  return () => {
    clearTimeout(timer);
    clearInterval(progressInterval);
    stopMusic();
  };
}, [viewStory, setViewStory]);
  const fetchMusic = async () => {
    try {
      const url = "https://filesamples.com/samples/audio/mp3/sample3.mp3";
      setMusicUrl(url);

      // Delay to allow <audio> to render before trying to play
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current
            .play()
            .catch(err => {
              console.warn("Autoplay blocked — waiting for user interaction", err);
            });
        }
      }, 200);
    } catch (error) {
      console.error("Failed to fetch music:", error);
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleClose = () => {
    stopMusic();
    setViewStory(null);
  };

  if (!viewStory) return null;

  const renderContent = () => {
    switch (viewStory.media_type) {
      case 'image':
        return (
          <img
            src={viewStory.media_url}
            alt={viewStory.title}
            className="max-w-full max-h-screen object-contain"
          />
        );
      case 'video':
        return (
          <video
            onEnded={() => setViewStory(null)}
            controls
            autoPlay
            playsInline
            className="max-h-screen object-contain"
          >
            <source src={viewStory.media_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'text':
        return (
          <div className="text-white text-2xl p-8 flex justify-center w-full h-full items-center">
            {viewStory.content}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 h-screen bg-black bg-opacity-90 z-50 flex items-center justify-center"
      style={{
        backgroundColor:
          viewStory.media_type === 'text'
            ? viewStory.background_color
            : '#000000',
      }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* User Info */}
      <div className="absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50">
        <img
          src={viewStory.user?.profile_image}
          alt="Profile"
          className="w-10 h-10 rounded-full ring ring-gray-100 shadow object-cover"
        />
        <div className="text-white font-medium flex items-center gap-1.5">
          <span>{viewStory.user?.username}</span>
          <BadgeCheck className="w-4 h-4 text-[var(--primary)]" />
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 focus:outline-none"
      >
        <X className="w-8 h-8 text-white hover:text-[var(--primary)] transition-colors duration-200" />
      </button>

      {/* Content wrapper */}
      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {renderContent()}
      </div>

      {/* Background music */}
      {musicUrl && (
        <audio ref={audioRef} src={musicUrl} loop />
      )}
    </div>
  );
};

export default StoryViewer;