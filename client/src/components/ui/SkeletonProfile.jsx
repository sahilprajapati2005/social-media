import React from 'react';

const SkeletonProfile = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Cover */}
      <div className="h-48 w-full rounded-b-lg bg-gray-300 md:h-64"></div>
      
      {/* Avatar & Info */}
      <div className="px-4 md:px-8">
        <div className="relative -mt-16 mb-4 md:-mt-20">
          <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 md:h-40 md:w-40"></div>
        </div>
        
        <div className="space-y-3">
          <div className="h-6 w-48 rounded bg-gray-200"></div>
          <div className="h-4 w-32 rounded bg-gray-200"></div>
          <div className="h-4 w-full max-w-lg rounded bg-gray-200"></div>
        </div>

        {/* Stats */}
        <div className="mt-6 flex gap-8">
          <div className="h-8 w-16 rounded bg-gray-200"></div>
          <div className="h-8 w-16 rounded bg-gray-200"></div>
          <div className="h-8 w-16 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProfile;