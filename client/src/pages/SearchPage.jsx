import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineVideoCamera, AiOutlineUser } from 'react-icons/ai';

// App Logic
import api from '../utils/axios';
import useDebounce from '../hooks/useDebounce';

// Components
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Wait 500ms after typing stops to prevent excessive API calls
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults({ users: [], posts: [] });
        return;
      }

      setLoading(true);
      try {
        // Fetch users (and optionally posts) matching the query
        // Matches your userController.js searchUsers logic
        const { data: users } = await api.get(`/users/search?query=${debouncedQuery}`);
        
        // If you also have a post search endpoint, you can Promise.all them here
        setResults({ users, posts: [] }); 
      } catch (error) {
        console.error("Search API failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery]);

  const handleManualSearch = (e) => {
    e.preventDefault();
    // Logic is handled by the useEffect watching debouncedQuery
  };

  return (
    <div className="mx-auto max-w-2xl min-h-screen px-4 py-8">
      {/* Search Header */}
      <div className="sticky top-0 bg-gray-50/95 backdrop-blur-sm pb-4 pt-2 z-10">
        <h2 className="mb-6 text-3xl font-extrabold text-gray-900">Search</h2>
        
        <form onSubmit={handleManualSearch} className="relative group">
          <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search for people or topics..."
            className="w-full rounded-2xl border-none bg-white py-4 pl-12 pr-4 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Results Section */}
      <div className="mt-6 space-y-6 pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500 font-medium">Searching...</p>
          </div>
        ) : (
          <>
            {/* User Results Section */}
            {results.users.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 px-1">People</h3>
                {results.users.map((user) => (
                  <div 
                    key={user._id}
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className="flex items-center gap-4 rounded-2xl bg-white p-4 hover:bg-blue-50 hover:scale-[1.01] cursor-pointer transition-all border border-gray-100 hover:border-blue-100 shadow-sm"
                  >
                    <Avatar 
                      src={user.profilePicture} 
                      alt={user.username} 
                      size="lg"
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-gray-900 truncate">{user.username}</p>
                      <p className="text-sm text-gray-500 truncate">{user.bio || user.email}</p>
                    </div>
                    <div className="hidden sm:block text-blue-600 font-semibold text-sm px-4 py-1 bg-blue-50 rounded-full group-hover:bg-blue-100">
                      View Profile
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {debouncedQuery && results.users.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AiOutlineUser className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">No results found</h3>
                <p className="text-gray-500">Try searching for a different username or keyword.</p>
              </div>
            )}
            
            {/* Welcome State (No query yet) */}
            {!query && (
              <div className="text-center py-20 text-gray-400">
                <AiOutlineSearch className="text-6xl mx-auto mb-4 opacity-20" />
                <p>Enter a name to find friends and creators</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;