import React, { useState, useEffect } from 'react';
import { FiX, FiPackage } from 'react-icons/fi';
import Button from '../../Buttons/Button';
import Button_Clear from '../../Buttons/Button_Clear';
import Input_Text from '../../Input_Fields/Input_Text';
import TextArea from '../../Input_Fields/TextArea';

export default function ReturnEquipmentModal({
  isOpen,
  onClose,
  selectedItems,
  borrowedItems,
  onReturnQuantityChange,
  returnNotes,
  setReturnNotes,
  inspectedBy,
  setInspectedBy,
  onSubmit,
  itemReturnQuantities,
  onClearData // New prop to handle checkbox clearing
}) {
  const [localReturnNotes, setLocalReturnNotes] = useState(returnNotes);
  const [localInspectedBy, setLocalInspectedBy] = useState(inspectedBy);
  const [saving, setSaving] = useState(false);

  // Sync with parent state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalReturnNotes(returnNotes);
      setLocalInspectedBy(inspectedBy);
    }
  }, [isOpen, returnNotes, inspectedBy]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Set parent state first
      setReturnNotes(localReturnNotes);
      setInspectedBy(localInspectedBy);
      // Pass the local values directly to onSubmit to ensure they're available immediately
      await onSubmit(e, localReturnNotes, localInspectedBy);
    } catch (error) {
      console.error('Error submitting return:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    // Reset local state when closing
    setLocalReturnNotes(returnNotes);
    setLocalInspectedBy(inspectedBy);
    // Clear the selected items (uncheck checkboxes)
    if (onClearData) onClearData('return');
    onClose();
  };

  if (!isOpen) return null;

  const selectedBorrowedItems = borrowedItems.filter(item => selectedItems.includes(item.et_id));

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-2 md:p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full overflow-hidden transition-all duration-300 ${
        selectedBorrowedItems.length > 5 ? 'max-w-6xl' :
        selectedBorrowedItems.length > 3 ? 'max-w-5xl' :
        selectedBorrowedItems.length > 1 ? 'max-w-4xl' : 'max-w-3xl'
      } max-h-[95vh] md:max-h-[90vh]`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiPackage size={20} />
            <h2 className="text-xl font-semibold">Return Equipment</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected Items Section */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4 text-sm md:text-base">Selected Items ({selectedItems.length})</h4>
              <div className={`space-y-3 overflow-y-auto ${
                selectedBorrowedItems.length > 8 ? 'max-h-40' :
                selectedBorrowedItems.length > 5 ? 'max-h-48' :
                selectedBorrowedItems.length > 3 ? 'max-h-56' : 'max-h-64'
              }`}>
                {selectedBorrowedItems.map(item => (
                  <div key={item.et_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate text-sm md:text-base">{item.item_description}</div>
                      <div className="text-xs md:text-sm text-gray-600">{item.product_id}</div>
                      <div className="text-xs text-gray-500">Borrowed: {item.borrowed_quantity}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <label className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Return Qty:</label>
                      <Input_Text
                        type="number"
                        value={itemReturnQuantities[item.et_id] || ''}
                        onChange={(e) => onReturnQuantityChange(item.et_id, e.target.value)}
                        className="w-16 md:w-20 text-center flex-shrink-0 text-sm"
                        text_ClassName="text-center"
                        min="0"
                        max={item.borrowed_quantity}
                        required
                      />
                      <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">/ {item.borrowed_quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Return Notes */}
              <div>
                <TextArea
                  label="Return Notes"
                  name="returnNotes"
                  value={localReturnNotes}
                  onChange={(e) => setLocalReturnNotes(e.target.value)}
                  placeholder="Enter any damage notes or observations..."
                  rows="3"
                  minHeight="80px"
                  resize="vertical"
                />
              </div>

              {/* Inspected By */}
              <div>
                <Input_Text
                  label="Inspected By"
                  value={localInspectedBy}
                  onChange={(e) => setLocalInspectedBy(e.target.value)}
                  placeholder="Enter name of inspector"
                  required
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <Button
            label="Cancel"
            type="button"
            onClick={handleClose}
            variant="modal-secondary"
          />
          <Button
            label="Save"
            onClick={handleSubmit}
            disabled={!localInspectedBy.trim()}
            isLoading={saving}
            loadingText="Saving..."
            variant="modal-primary"
          />
        </div>
      </div>
    </div>
  );
}
