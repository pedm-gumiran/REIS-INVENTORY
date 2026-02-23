import React, { useState, useEffect } from 'react';
import { FiX, FiEdit2 } from 'react-icons/fi';
import Input_Text from '../../Input_Fields/Input_Text';

export default function EditConsumableProductModal({ 
  isOpen, 
  onClose, 
  onSave, 
  product = null,
  title = "Edit Consumable Product"
}) {
  const [formData, setFormData] = useState({
    Consumable_Product_ID: '',
    Category_Name: '',
    Item_Description: '',
    Unit: '',
    Quantity: '',
    Unit_Cost: '',
    Status: 'In Stock'
  });

  // Populate form when product data is provided
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        Consumable_Product_ID: product.Consumable_Product_ID || '',
        Category_Name: product.Category_Name || '',
        Item_Description: product.Item_Description || '',
        Unit: product.Unit || '',
        Quantity: product.Quantity?.toString() || '',
        Unit_Cost: product.Unit_Cost?.toString() || '',
        Status: product.Status || 'In Stock'
      });
    }
  }, [product, isOpen]);

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
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FiEdit2 size={20} />
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
            {/* Product ID (Read-only) */}
            <div>
              <Input_Text
                label="Product ID"
                name="Consumable_Product_ID"
                value={formData.Consumable_Product_ID}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Product ID cannot be changed</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="Status"
                  value={formData.Status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Critical">Critical</option>
                </select>
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
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-700">Total Cost (Preview):</span>
                <span className="text-lg font-bold text-blue-900">
                  ₱{((parseInt(formData.Quantity) || 0) * (parseFloat(formData.Unit_Cost) || 0)).toFixed(2)}
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
              isFormValid
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FiSave size={16} />
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
}
