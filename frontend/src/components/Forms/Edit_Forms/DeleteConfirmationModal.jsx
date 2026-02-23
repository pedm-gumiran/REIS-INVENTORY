import React, { useState } from 'react';
import { FiX, FiAlertTriangle, FiDownload } from 'react-icons/fi';
import Button from '../../Buttons/Button';

export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  selectedItems = [],
  title = "Delete Confirmation"
}) {
  const handleConfirm = () => {
    onConfirm(selectedItems);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiAlertTriangle size={20} />
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <FiAlertTriangle className="text-red-600 mr-3" size={24} />
              <div>
                <p className="text-lg font-medium text-red-800">
                  Are you sure you want to delete {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''}?
                </p>
                <p className="text-sm text-red-600 mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Selected Items Preview */}
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Items to be deleted:</p>
              <ul className="space-y-1">
                {selectedItems.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <span className="font-medium">{item.Item_Description || item}</span>
                    <span className="ml-2 text-xs text-gray-500">({item.Consumable_Product_ID})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <Button
            label="Cancel"
            type="button"
            onClick={onClose}
            variant="modal-secondary"
          />
          <Button
            label={`Delete ${selectedItems.length} Item${selectedItems.length > 1 ? 's' : ''}`}
            onClick={handleConfirm}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          />
        </div>
      </div>
    </div>
  );
}
