import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import useDebounce from '../hooks/useDebounce';
import { FaSearch, FaUser } from 'react-icons/fa';
import Avatar from '../components/ui/Avatar';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Wait 500ms after typing stops to prevent excessive API calls
  const debouncedQuery = useDebounce(query, 500);

  // Core search function
  const fetchUsers = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // ✅ Matches your backend req.query.query logic
      const { data } = await api.get(`/users/search?query=${searchTerm}`);
      setResults(data);
    } catch (error) {
      console.error("Search API failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when debounced value changes (as you type)
  useEffect(() => {
    fetchUsers(debouncedQuery);
  }, [debouncedQuery]);

  // ✅ Trigger search manually when user presses Enter
  const handleManualSearch = (e) => {
    e.preventDefault();
    fetchUsers(query);
  };

  return (
    <div className="mx-auto max-w-2xl min-h-screen px-4">
      {/* Search Header */}
      <div className="sticky top-0 bg-gray-50 pb-4 pt-6 z-10">
        <h2 className="mb-6 text-3xl font-extrabold text-gray-900">Search</h2>
        
        {/* Wrap in form to handle Enter key */}
        <form onSubmit={handleManualSearch} className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search for users (e.g., sahilprajapati)..."
            className="w-full rounded-2xl border-none bg-white py-4 pl-12 pr-4 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Results Section */}
      <div className="mt-6 space-y-3 pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-500 font-medium">Searching for users...</p>
          </div>
        ) : (
          <>
            {/* Empty State: Only shows if a query was made but 0 results found */}
            {results.length === 0 && query && (
              <div className="text-center py-20">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUser className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">No users found</h3>
                <p className="text-gray-500">Try searching for a different username.</p>
              </div>
            )}

            {/* Users List */}
            {results.map((user) => (
              <div 
                key={user._id}
                onClick={() => navigate(`/profile/${user._id}`)}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 hover:bg-blue-50 hover:scale-[1.02] cursor-pointer transition-all border border-transparent hover:border-blue-100 shadow-sm"
              >
                <Avatar 
                  src={user.profilePicture} 
                  alt={user.username} 
                  size="lg"
                />
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-gray-900 truncate">{user.username}</p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="text-blue-600 font-semibold text-sm px-3 py-1 bg-blue-50 rounded-full">
                  View Profile
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;