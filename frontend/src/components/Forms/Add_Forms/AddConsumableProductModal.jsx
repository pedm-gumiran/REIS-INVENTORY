import React, { useState, useEffect } from 'react';
import { FiX, FiPackage } from 'react-icons/fi';
import Input_Text from '../../Input_Fields/Input_Text';
import Button from '../../Buttons/Button';

export default function AddConsumableProductModal({ 
  isOpen, 
  onClose, 
  onSave, 
  title = "Add Consumable Product"
}) {
  const [formData, setFormData] = useState({
    Consumable_Product_ID: '',
    Category_Name: '',
    Item_Description: '',
    Unit: '',
    Quantity: '',
    Unit_Cost: ''
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        Consumable_Product_ID: '',
        Category_Name: '',
        Item_Description: '',
        Unit: '',
        Quantity: '',
        Unit_Cost: ''
      });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      Quantity: parseInt(formData.Quantity) || 0,
      Unit_Cost: parseFloat(formData.Unit_Cost) || 0
    });
    onClose();
  };

  if (!isOpen) return null;

  const isFormValid = formData.Consumable_Product_ID.trim() &&
    formData.Category_Name.trim() &&
    formData.Item_Description.trim() &&
    formData.Unit.trim() &&
    formData.Quantity &&
    parseFloat(formData.Quantity) > 0 &&
    formData.Unit_Cost &&
    parseFloat(formData.Unit_Cost) > 0;

  const totalCost = formData.Quantity && formData.Unit_Cost 
    ? (parseFloat(formData.Quantity) * parseFloat(formData.Unit_Cost)).toFixed(2)
    : '0.00';

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiPackage size={20} />
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Product ID */}
              <div>
                <Input_Text
                  label="Product ID *"
                  name="Consumable_Product_ID"
                  value={formData.Consumable_Product_ID}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., CP001"
                />
              </div>

              {/* Category */}
              <div>
                <Input_Text
                  label="Category *"
                  name="Category_Name"
                  value={formData.Category_Name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Stationery"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Input_Text
                label="Item Description *"
                name="Item_Description"
                value={formData.Item_Description}
                onChange={handleInputChange}
                required
                placeholder="Enter detailed product description..."
                text_ClassName="resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Unit */}
              <div>
                <Input_Text
                  label="Unit *"
                  name="Unit"
                  value={formData.Unit}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., per ream"
                />
              </div>

              {/* Quantity */}
              <div>
                <Input_Text
                  label="Quantity *"
                  name="Quantity"
                  value={formData.Quantity}
                  onChange={handleInputChange}
                  required
                  type="number"
                  min="0"
                  placeholder="0"
                />
              </div>

              {/* Unit Cost */}
              <div>
                <Input_Text
                  label="Unit Cost (₱) *"
                  name="Unit_Cost"
                  value={formData.Unit_Cost}
                  onChange={handleInputChange}
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Total Cost Preview */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-700">Total Cost (Preview):</span>
                <span className="text-lg font-bold text-green-900">
                  ₱{totalCost}
                </span>
              </div>
            </div>
          </form>
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
            label="Save Product"
            onClick={handleSubmit}
            disabled={!isFormValid}
            variant="modal-primary"
          />
        </div>
      </div>
    </div>
  );
}
