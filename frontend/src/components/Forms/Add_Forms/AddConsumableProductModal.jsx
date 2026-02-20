import React, { useState, useEffect } from 'react';
import { FiX, FiPackage } from 'react-icons/fi';

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
    Unit_Cost: '',
    Status: 'In Stock'
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
        Unit_Cost: '',
        Status: 'In Stock'
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product ID *
                </label>
                <input
                  type="text"
                  name="Consumable_Product_ID"
                  value={formData.Consumable_Product_ID}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., CP001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  name="Category_Name"
                  value={formData.Category_Name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Stationery"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Description *
              </label>
              <textarea
                name="Item_Description"
                value={formData.Item_Description}
                onChange={handleInputChange}
                required
                rows="2"
                placeholder="Enter detailed product description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <input
                  type="text"
                  name="Unit"
                  value={formData.Unit}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., per ream"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="Quantity"
                  value={formData.Quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Unit Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Cost (₱) *
                </label>
                <input
                  type="number"
                  name="Unit_Cost"
                  value={formData.Unit_Cost}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Critical">Critical</option>
              </select>
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
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FiSave size={16} />
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
