import { useState, useEffect } from 'react';
import Loading from '../component/shared/Loading';
import StoriesBar from '../component/StoriesBar';
import assets from '../assets/assets';
import PostCard from '../component/PostCard';
import RecentMessages from '../component/RecentMessages';

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sponsors, setSponsors] = useState(null);
  const [error, setError] = useState(null);

  const fetchFeeds = async () => {
    setFeeds(assets.dummyPostData);
    setLoading(false);
  };

  const fetchSponsors = async () => {
    setSponsors(assets.advisite_brand);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeds();
    fetchSponsors();
  }, []);

  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 
    flex items-start justify-center xl:gap-8">
      {/* Stories and post list */}
      <div>
        <StoriesBar />
        <div className="p-4 space-y-6">
          {feeds.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Right sidebar */}
<div className="max-xl:hidden top-0 sticky">
  {sponsors && (
    <a
      href={sponsors.link}
      target="_blank"
      rel="noopener noreferrer"
      className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow 
                 hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out"
    >
      <h3 className="text-slate-800 font-semibold">{sponsors.title}</h3>
      <img
        src={sponsors.image}
        alt={sponsors.brand}
        className="w-full h-full rounded-md"
      />
      <p className="text-slate-600 font-medium">{sponsors.brand}</p>
      <p className="text-slate-600">{sponsors.description}</p>
    </a>
  )}
  <RecentMessages/>
</div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;


