import React from 'react';

const SkeletonPost = () => {
  return (
    <div className="mb-6 animate-pulse rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        <div className="flex flex-col gap-2">
          <div className="h-3 w-32 rounded bg-gray-200"></div>
          <div className="h-2 w-20 rounded bg-gray-200"></div>
        </div>
      </div>

      {/* Content Text */}
      <div className="mb-4 space-y-2">
        <div className="h-3 w-full rounded bg-gray-200"></div>
        <div className="h-3 w-3/4 rounded bg-gray-200"></div>
      </div>

      {/* Content Image */}
      <div className="mb-4 h-64 w-full rounded-lg bg-gray-200"></div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="h-6 w-16 rounded bg-gray-200"></div>
        <div className="h-6 w-16 rounded bg-gray-200"></div>
        <div className="h-6 w-16 rounded bg-gray-200"></div>
      </div>
    </div>
  );
};

export default SkeletonPost;