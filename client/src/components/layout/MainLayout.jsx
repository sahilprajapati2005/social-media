import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

// Icons
import { 
  AiFillHome, AiOutlineHome, 
  AiFillMessage, AiOutlineMessage, 
  AiFillHeart, AiOutlineHeart,
  AiOutlineLogout, AiOutlineSetting 
} from 'react-icons/ai';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import { BsPersonFill, BsPerson } from 'react-icons/bs';

// Components
import RightSidebar from './RightSidebar';
import Avatar from '../ui/Avatar'; 

const MainLayout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // Assuming you added notificationSlice to your store
  const { unreadCount } = useSelector((state) => state.notifications || { unreadCount: 0 });

  // Helper for NavLink active styling
  const navClass = ({ isActive }) => 
    `group flex items-center space-x-3 rounded-xl px-4 py-3 transition-all duration-200 ${
      isActive 
        ? 'bg-blue-50 text-blue-600 font-bold' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      
      {/* =======================
          LEFT SIDEBAR (Desktop)
         ======================= */}
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
        
        {/* Logo */}
        <div className="flex h-16 items-center px-8">
          <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
            SocialApp
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2 px-4 py-4">
          
          <NavLink to="/" className={navClass}>
            {({ isActive }) => (
              <>
                {isActive ? <AiFillHome className="text-2xl" /> : <AiOutlineHome className="text-2xl" />}
                <span className="text-lg">Home</span>
              </>
            )}
          </NavLink>

          <NavLink to="/search" className={navClass}>
            <FaSearch className="text-2xl" />
            <span className="text-lg">Explore</span>
          </NavLink>

          <NavLink to="/notifications" className={navClass}>
            {({ isActive }) => (
              <div className="relative flex items-center space-x-3">
                {isActive ? <AiFillHeart className="text-2xl" /> : <AiOutlineHeart className="text-2xl" />}
                <span className="text-lg">Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute left-3 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
            )}
          </NavLink>

          <NavLink to="/chat" className={navClass}>
            {({ isActive }) => (
              <>
                {isActive ? <AiFillMessage className="text-2xl" /> : <AiOutlineMessage className="text-2xl" />}
                <span className="text-lg">Messages</span>
              </>
            )}
          </NavLink>

          <NavLink to={`/profile/${user?._id}`} className={navClass}>
             {({ isActive }) => (
              <>
                {isActive ? <BsPersonFill className="text-2xl" /> : <BsPerson className="text-2xl" />}
                <span className="text-lg">Profile</span>
              </>
            )}
          </NavLink>

          <NavLink to="/settings" className={navClass}>
            <AiOutlineSetting className="text-2xl" />
            <span className="text-lg">Settings</span>
          </NavLink>
        </nav>

        {/* User Mini Profile (Bottom) */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-gray-50 cursor-pointer transition">
            <Link to={`/profile/${user?._id}`}>
               <Avatar src={user?.profilePicture} size="md" />
            </Link>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-gray-900">{user?.username}</p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
            <button 
              onClick={() => dispatch(logout())} 
              className="text-gray-400 hover:text-red-500 transition"
              title="Logout"
            >
              <AiOutlineLogout className="text-xl" />
            </button>
          </div>
        </div>
      </aside>


      {/* =======================
          MAIN CONTENT AREA
         ======================= */}
      <main className="flex flex-1 flex-col overflow-hidden relative">
        
        {/* Mobile Header (Visible only on small screens) */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md md:hidden">
          <Link to={`/profile/${user?._id}`}>
            <Avatar src={user?.profilePicture} size="sm" />
          </Link>
          <span className="text-lg font-bold text-blue-600">SocialApp</span>
          <Link to="/chat" className="text-gray-600 hover:text-blue-600">
            <AiOutlineMessage className="text-2xl" />
          </Link>
        </header>

        {/* Scrollable Feed Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="mx-auto w-full max-w-2xl p-4 pb-24 md:p-6 md:pb-6">
            <Outlet />
          </div>
        </div>

      </main>


      {/* =======================
          RIGHT SIDEBAR (Suggestions)
         ======================= */}
      {/* Hidden on Mobile/Tablet, Visible on Large Screens */}
      <aside className="hidden w-80 border-l border-gray-200 bg-white lg:block overflow-y-auto">
        <RightSidebar />
      </aside>


      {/* =======================
          MOBILE BOTTOM NAV
         ======================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-gray-200 bg-white px-2 md:hidden">
        
        <NavLink to="/" className={({ isActive }) => `p-2 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
          {({ isActive }) => isActive ? <AiFillHome className="text-2xl" /> : <AiOutlineHome className="text-2xl" />}
        </NavLink>
        
        <NavLink to="/search" className={({ isActive }) => `p-2 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
          <FaSearch className="text-2xl" />
        </NavLink>

        {/* Center: Notifications (Badge included) */}
        <NavLink to="/notifications" className={({ isActive }) => `relative p-2 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
           {({ isActive }) => isActive ? <AiFillHeart className="text-2xl" /> : <AiOutlineHeart className="text-2xl" />}
           {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
           )}
        </NavLink>

        <NavLink to="/chat" className={({ isActive }) => `p-2 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
           {({ isActive }) => isActive ? <AiFillMessage className="text-2xl" /> : <AiOutlineMessage className="text-2xl" />}
        </NavLink>

        <NavLink to={`/profile/${user?._id}`} className={({ isActive }) => `p-2 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
          {({ isActive }) => isActive ? <BsPersonFill className="text-2xl" /> : <BsPerson className="text-2xl" />}
        </NavLink>
      </nav>

    </div>
  );
};

export default MainLayout;