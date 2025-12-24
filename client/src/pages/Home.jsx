import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeed } from '../features/feed/feedSlice';

const Home = () => {
  const dispatch = useDispatch();
  
  // 1. Get the user/token from state
  const { user } = useSelector((state) => state.auth); 

  useEffect(() => {
    // 2. STOP THE FETCH if there is no user!
    if (!user) return; 

    dispatch(getFeed());
  }, [user, dispatch]); // 3. Add user to dependency array

  return (
    <div>
      {/* ... your feed UI ... */}
    </div>
  );
};

export default Home;