import React from 'react';
import { FiSave } from 'react-icons/fi';

export default function Button({
  disabled,
  label,
  type = 'button',
  onClick,
  className = '',
  icon = null,
  title,
  isLoading = false,
  loadingText = 'Loading...',
  variant = 'primary', // 'primary', 'secondary', 'modal-primary', 'modal-secondary'
  size = 'md', // 'sm', 'md', 'lg'
}) {
  const getVariantClasses = () => {
    // Return empty classes if disabled to prevent hover effects
    if (disabled || isLoading) {
      return '';
    }
    
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500';
      case 'secondary':
        return 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-500';
      case 'modal-primary':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700';
      case 'modal-secondary':
        return 'border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const baseClasses = 'rounded-md transition-all flex items-center justify-center gap-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  const disabledClasses = (disabled || isLoading) ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60' : '';
  
  const buttonClasses = `
    ${baseClasses}
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${disabledClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Auto-add FiSave icon for modal-primary variant if no icon provided
  const buttonIcon = icon || (variant === 'modal-primary' ? <FiSave size={16} /> : null);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={buttonClasses}
      title={title}
    >
      {/* Show spinner if loading */}
      {isLoading && (
        <span
          className="inline-block h-4 w-4 rounded-full border-2 border-white/60 border-t-white animate-spin"
          aria-hidden="true"
        />
      )}

      {/* Optional icon (only show when not loading) */}
      {!isLoading && buttonIcon && <span className="flex items-center">{buttonIcon}</span>}

      {/* Change text depending on loading state */}
      <span>{isLoading ? loadingText : label}</span>
    </button>
  );
}
