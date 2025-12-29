import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  AiOutlineHome, 
  AiOutlineMessage, 
  AiOutlineUser, 
  AiOutlineLogout, 
  AiOutlineSearch, 
  AiOutlineBell, 
  AiOutlineSetting 
} from 'react-icons/ai';
import { logout } from '../features/auth/authSlice';
import Avatar from '../components/ui/Avatar';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`); 
      setSearchTerm('');
    }
  };

  return (
    <div className="sticky top-0 z-50 h-16 bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-full max-w-7xl mx-auto items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="text-xl md:text-2xl font-bold text-blue-600 tracking-tighter">
          SocialApp
        </Link>

        {/* Search Bar - Hidden on mobile top bar (it's in bottom nav or separate page) */}
        <form 
          onSubmit={handleSearch} 
          className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 lg:w-96 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
        >
          <AiOutlineSearch className="text-gray-500 text-xl" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-6">
          {/* Desktop Only Icons */}
          <div className="hidden md:flex items-center gap-6 pr-4 border-r border-gray-200">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition text-2xl" title="Home"><AiOutlineHome /></Link>
            <Link to="/notifications" className="text-gray-600 hover:text-blue-600 transition text-2xl" title="Notifications"><AiOutlineBell /></Link>
            <Link to="/chat" className="text-gray-600 hover:text-blue-600 transition text-2xl" title="Messages"><AiOutlineMessage /></Link>
          </div>

          {/* Settings & Logout - ALWAYS at top (Mobile & Desktop) */}
          <Link to="/settings" className="text-gray-500 hover:text-blue-600 transition text-2xl" title="Settings">
            <AiOutlineSetting />
          </Link>
          
          <Link to={`/profile/${user?._id}`} className="flex items-center gap-2">
            <Avatar src={user?.profilePicture} size="sm" />
            <span className="hidden lg:block font-medium text-sm text-gray-700">{user?.username}</span>
          </Link>

          <button 
            onClick={() => dispatch(logout())} 
            className="text-gray-500 hover:text-red-500 transition text-2xl"
            title="Logout"
          >
            <AiOutlineLogout />
          </button>
        </div>
      </div>
    </div>
  );
};

const BottomNav = () => {
  const location = useLocation();
  const navItems = [
    { to: "/", icon: <AiOutlineHome />, label: "Home" },
    { to: "/search", icon: <AiOutlineSearch />, label: "Search" },
    { to: "/notifications", icon: <AiOutlineBell />, label: "Alerts" },
    { to: "/chat", icon: <AiOutlineMessage />, label: "Chat" },
    { to: "/profile/me", icon: <AiOutlineUser />, label: "Profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || (item.to === "/profile/me" && location.pathname.includes('/profile'));
          return (
            <Link 
              key={item.to}
              to={item.to} 
              className={`flex flex-col items-center justify-center ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[10px] font-bold mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto flex flex-1 w-full pt-2 md:pt-6 pb-20 md:pb-6 px-0 md:px-4">
        
        {/* Left Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-1/4 pr-4">
          <div className="sticky top-24 space-y-1">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm text-gray-700 font-semibold transition group">
              <AiOutlineHome className="text-xl text-blue-600" /> <span>Feed</span>
            </Link>
            <Link to="/notifications" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm text-gray-700 font-semibold transition">
              <AiOutlineBell className="text-xl text-orange-500" /> <span>Notifications</span>
            </Link>
            <Link to="/chat" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm text-gray-700 font-semibold transition">
              <AiOutlineMessage className="text-xl text-green-500" /> <span>Messages</span>
            </Link>
            <Link to="/search" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm text-gray-700 font-semibold transition">
              <AiOutlineSearch className="text-xl text-purple-500" /> <span>Search</span>
            </Link>
          </div>
        </aside>

        {/* Main Feed Content */}
        <main className="w-full lg:w-1/2 px-2 md:px-0">
           <Outlet />
        </main>

        {/* Right Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-1/4 pl-4">
           <div className="sticky top-24 bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-4">Suggested for you</h3>
              <div className="text-sm text-gray-400 text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
                No suggestions yet
              </div>
           </div>
        </aside>
      </div>

      {/* Visible ONLY on small screens */}
      <BottomNav />
    </div>
  );
};

export default MainLayout;