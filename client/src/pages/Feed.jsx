import {useState, useEffect} from 'react'
import Loading from '../component/shared/Loading'
import StoriesBar from '../component/StoriesBar'
import assets from '../assets/assets'

const Feed = () => {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  
  const fetchFeeds = async () =>{
    setFeeds(assets.dummyPostData);
    setLoading(false)
  }

  useEffect(() => {
  fetchFeeds();
}, []);

  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5
    flex items-start justify-center xl:gap-8">
       {/*Stories and post list */}
       <div>
         <StoriesBar/>
         <div className="p-4 space-y-6">
           List of Post
         </div>
        </div>

        {/* right sidebar */}
        <div>
          <div>
            <h1>Sponsored</h1>
          </div>
          <h1> Recent messages</h1>
        </div>
    </div>
  ):
  <Loading/>
}

export default Feed
