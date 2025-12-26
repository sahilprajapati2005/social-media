import React, { useState } from 'react'; // Added useState
import { Outlet, Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineHome, AiOutlineMessage, AiOutlineUser, AiOutlineLogout, AiOutlineSearch } from 'react-icons/ai';
import { logout } from '../features/auth/authSlice';
import Avatar from '../components/ui/Avatar';

// Navbar Component
const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate hook
  const [searchTerm, setSearchTerm] = useState(''); // State to handle input text

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Redirect to the search page. 
      // Option: navigate(`/search?query=${searchTerm}`) if you want to pass the term
      navigate('/search'); 
      setSearchTerm(''); // Clear the bar after navigating
    }
  };

  return (
    <div className="sticky top-0 z-50 h-16 bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-full max-w-7xl mx-auto items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tighter">
          SocialApp
        </Link>

        {/* Search Bar - Now Functional */}
        <form 
          onSubmit={handleSearch} 
          className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-96 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
        >
          <AiOutlineSearch className="text-gray-500 text-xl" />
          <input 
            type="text" 
            placeholder="Search for friends..." 
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Icons & Profile */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition text-2xl">
            <AiOutlineHome />
          </Link>
          <Link to="/chat" className="text-gray-600 hover:text-blue-600 transition text-2xl">
            <AiOutlineMessage />
          </Link>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
             <Link to={`/profile/${user?._id}`} className="flex items-center gap-2 hover:opacity-80">
                <Avatar src={user?.profilePicture} size="sm" />
                <span className="hidden md:block font-medium text-sm text-gray-700">{user?.username}</span>
             </Link>
             <button 
               onClick={() => dispatch(logout())} 
               className="text-gray-500 hover:text-red-500 transition text-xl ml-2"
               title="Logout"
             >
               <AiOutlineLogout />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto flex pt-6 px-0 md:px-4">
        
        {/* Left Sidebar */}
        <div className="hidden lg:block w-1/4 pr-4">
          <div className="sticky top-24 space-y-2">
             <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:shadow-sm transition text-gray-700 font-medium">
                <AiOutlineHome className="text-xl" /> Feed
             </Link>
             <Link to="/chat" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:shadow-sm transition text-gray-700 font-medium">
                <AiOutlineMessage className="text-xl" /> Messages
             </Link>
             <Link to="/search" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:shadow-sm transition text-gray-700 font-medium">
                <AiOutlineSearch className="text-xl" /> Search
             </Link>
             <Link to="/profile/me" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:shadow-sm transition text-gray-700 font-medium">
                <AiOutlineUser className="text-xl" /> My Profile
             </Link>
          </div>
        </div>

        {/* Middle Content */}
        <div className="w-full lg:w-1/2">
           <Outlet />
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-1/4 pl-4">
           <div className="sticky top-24 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <h3 className="font-bold text-gray-500 text-sm mb-4">Sponsored</h3>
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                Ad Space
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default MainLayout;