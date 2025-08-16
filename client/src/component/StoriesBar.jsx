import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import "../styles/ui.css";
import assets from "../assets/assets";
import moment from "moment";
import StoryModal from "./StoryModal";
import StoryViewer from "./StoryViewer";

export default function StoriesBar() {
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewStory, setViewStory] = useState(null);

  useEffect(() => {
    setStories(assets.dummyStoriesData);
  }, []);

  const handleAddStoryClick = () => setShowModal(true);
  const handleViewStoryClick = (story) => setViewStory(story);

  return (
    <div className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4">
      <div className="flex gap-4 pb-5">
        {/* Add Story Card */}
        <div
          onClick={handleAddStoryClick}
          className="rounded-lg shadow-sm min-w-30 max-w-30 max-h-40 aspect-[3/4]
            cursor-pointer hover:shadow-lg transition-all duration-200 
            border-2 border-dashed border-[var(--input-border)] flex items-center justify-center"
          style={{ background: "var(--hover-gradient)" }}
        >
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="size-10 bg-[var(--primary)] rounded-full flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-[var(--text-main)]" />
            </div>
            <p className="text-sm font-medium text-slate-700 text-center">
              Add Story
            </p>
          </div>
        </div>

        {/* Story Cards */}
        {stories.map((story) => {
          const isImage = story.media_type === "image";
          const isVideo = story.media_type === "video";

          return (
            <div
              key={story.id}
              onClick={() => handleViewStoryClick(story)}
              className="relative rounded-lg shadow min-w-33 max-w-33 max-h-42 cursor-pointer 
                transition-all duration-200 active:scale-95 hover:shadow-lg story-gradient overflow-hidden"
            >
              {/* Background media */}
              {story.media_type !== "text" && (
                <>
                  {isImage && (
                    <img
                      src={story.media_url}
                      alt={story.title}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-70 hover:opacity-90 transition duration-300"
                    />
                  )}
                  {isVideo && (
                    <video
                      src={story.media_url}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover opacity-70 hover:opacity-90 transition duration-300"
                    />
                  )}
                </>
              )}

              {/* Profile image */}
              <div className="absolute top-1 left-1 z-10">
                <div className="w-10 h-10 rounded-full ring ring-gray-100 shadow overflow-hidden flex items-center justify-center">
                  <img
                    src={story.user?.profile_image}
                    alt={`${story.title} profile`}
                    className="w-10 h-10 object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <p className="absolute top-18 left-3 z-10 text-[var(--text-main)] text-sm truncate max-w-24">
                {story.content}
              </p>

              {/* Timestamp */}
              <p className="text-[var(--text-main)] absolute bottom-1 right-2 z-10 text-xs">
                {moment(story.createdAt).fromNow()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {showModal && (
        <StoryModal
          setShowModal={setShowModal}
          fetchStories={() => setStories(assets.dummyStoriesData)}
        />
      )}
      {viewStory && (
        <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
      )}
    </div>
  );
}