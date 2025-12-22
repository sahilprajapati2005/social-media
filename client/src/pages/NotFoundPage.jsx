import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-9xl font-bold text-blue-600">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-800">Page Not Found</h2>
      <p className="mt-2 text-gray-600">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;