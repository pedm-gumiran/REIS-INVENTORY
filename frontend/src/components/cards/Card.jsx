import React from 'react';

export default function Card({ 
  children, 
  className = '', 
  title = null,
  padding = 'p-6',
  shadow = 'shadow-md',
  rounded = 'rounded-lg',
  border = 'border border-gray-200'
}) {
  return (
    <div className={`bg-white ${shadow} ${rounded} ${border} ${padding} ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}
