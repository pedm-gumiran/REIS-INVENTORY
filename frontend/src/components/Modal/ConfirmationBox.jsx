import React, { useEffect } from 'react';
import Button from '../Buttons/Button';

export default function ConfirmationBox({
  message,
  onConfirm,
  onCancel,
  title,
  label,
  disabled,
  isLoading = false,
  loadingText,
}) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (message) { // Modal is open when message exists
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [message]);

  //  Dynamically choose loading text based on the title
  const effectiveLoadingText = loadingText
    ? loadingText
    : title?.toLowerCase().includes('restore')
    ? 'Restoring...'
    : 'Deleting...';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-gray-50 border border-gray-300 rounded-lg shadow-lg p-6 mx-3 w-full max-w-sm space-y-3">
        <p className="text-gray-800 text-xl font-semibold">{title}</p>
        <p className="text-gray-800 text-sm">{message}</p>
        <div className="flex justify-end gap-4 mt-4">
          <Button
            onClick={onCancel}
            label="Cancel"
            variant="modal-secondary"
            disabled={isLoading}
          />
          <button
            onClick={onConfirm}
            className={`btn bg-red-600 hover:bg-red-700 text-white cursor-pointer text-sm flex items-center gap-2 ${
              isLoading ? 'opacity-90 cursor-not-allowed' : ''
            }`}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
          >
            {/* Show spinner if loading */}
            {isLoading && (
              <span
                className="inline-block h-4 w-4 rounded-full border-2 border-white/60 border-t-white animate-spin"
                aria-hidden="true"
              />
            )}
            {isLoading ? effectiveLoadingText : label}
          </button>
        </div>
      </div>
    </div>
  );
}
