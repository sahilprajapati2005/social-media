import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import useDebounce from '../hooks/useDebounce'; // Code below
import { FaSearch } from 'react-icons/fa';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Custom hook to delay API calls until user stops typing
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const searchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/users/search?q=${debouncedQuery}`);
        setResults(data);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    };

    searchUsers();
  }, [debouncedQuery]);

  return (
    <div className="mx-auto max-w-2xl min-h-screen">
      <div className="sticky top-0 bg-gray-50 pb-4 pt-2 z-10">
        <h2 className="mb-4 text-2xl font-bold">Search</h2>
        <div className="relative">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for people..."
            className="w-full rounded-xl border-none bg-white py-3 pl-10 pr-4 shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {loading && <p className="text-gray-500 text-center">Searching...</p>}
        
        {!loading && results.length === 0 && debouncedQuery && (
          <p className="text-gray-500 text-center">No users found.</p>
        )}

        {results.map((user) => (
          <Link 
            to={`/profile/${user._id}`} 
            key={user._id}
            className="flex items-center gap-3 rounded-lg bg-white p-3 hover:bg-gray-100 shadow-sm"
          >
            <img 
              src={user.profilePicture || 'https://via.placeholder.com/40'} 
              alt={user.username}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-800">{user.username}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;