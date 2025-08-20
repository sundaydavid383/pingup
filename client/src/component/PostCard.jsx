import { BadgeCheck, Heart, Share2, MessageCircle } from 'lucide-react';
import moment from 'moment';
import DOMPurify from "dompurify";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PostSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl animate-pulse">
      {/* User Info skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="flex-1 space-y-2">
          <div className="w-32 h-4 bg-gray-300 rounded"></div>
          <div className="w-24 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-2">
        <div className="w-full h-3 bg-gray-300 rounded"></div>
        <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
      </div>

      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-300 rounded-lg"></div>

      {/* Actions skeleton */}
      <div className="flex items-center gap-6 pt-2 border-t border-gray-200">
        <div className="w-8 h-4 bg-gray-300 rounded"></div>
        <div className="w-8 h-4 bg-gray-300 rounded"></div>
        <div className="w-8 h-4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  if (!post) {
    return <PostSkeleton />; // show skeleton if no post
  }

  const [likes, setLikes] = useState(post.likes || []);
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  // Highlight hashtags
  const postWithHashtags = DOMPurify.sanitize(
    post.content?.replace(/(#\w+)/g, '<span class="text-[var(--primary)]">$1</span>') || ""
  );

  const handleLike = () => {
    if (!currentUser._id) return;
    if (likes.includes(currentUser._id)) {
      setLikes(likes.filter(id => id !== currentUser._id));
    } else {
      setLikes([...likes, currentUser._id]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl">
      {/* User Info */}
      <div 
        onClick={() => navigate(`/profile/${post.user._id}`)}  
        className="inline-flex items-center gap-3 cursor-pointer"
      >
        <img
          src={post.user.profile_image}
          alt="User"
          className="w-10 h-10 rounded-full shadow"
        />
        <div>
          <div className="flex items-center space-x-1">
            <span>{post.user.full_name}</span>
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-gray-500 text-sm">
            @{post.user.username} ● {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* Text Content */}
      {post.content && (
        <div
          className="text-gray-800 text-sm whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: postWithHashtags }}
        />
      )}

      {/* Images */}
      {post.image_urls?.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {post.image_urls.map((img, index) => (
            <img
              src={img}
              key={index}
              className={`w-full h-48 object-cover rounded-lg ${
                post.image_urls.length === 1 && 'col-span-2 h-auto'
              }`}
              alt=""
            />
          ))}
        </div>
      )}

      {/* Videos */}
      {post.video_urls?.length > 0 && (
        <div className="space-y-3">
          {post.video_urls.map((video, index) => {
            const isYouTube = video.includes("youtube.com") || video.includes("youtu.be");
            return (
              <div key={index} className="w-full">
                {isYouTube ? (
                  <iframe
                    className="w-full rounded-lg"
                    height="315"
                    src={video.replace("watch?v=", "embed/")}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <video
                    src={video}
                    controls
                    className="w-full rounded-lg"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300">
        <div className="flex items-center gap-1">
          <Heart
            className={`w-4 h-4 cursor-pointer ${
              likes.includes(currentUser._id) && 'text-red-500 fill-red-500'
            }`}
            onClick={handleLike}
          />
          <span className="ml-1">{likes.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4 cursor-pointer" />
          <span className="ml-1">{post.comments_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4 cursor-pointer" />
          <span className="ml-1">{post.shared_count}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;