import React from 'react';

export default function LoadingSPinner(
  { label = 'Loading, please wait...' },
  small = false,
) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <div className=""></div>
      <div
        className={`animate-spin rounded-full  border-4 border-gray-300 border-t-green-700 ${
          small ? 'h-5 w-5' : 'h-12 w-12'
        }`}
      />
      {label && (
        <p className={`text-gray-500 ${small ? 'text-xs' : 'text-sm'}`}>
          {label}
        </p>
      )}
    </div>
  );
}
