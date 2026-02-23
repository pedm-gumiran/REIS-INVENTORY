import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import Input_Text from '../../Input_Fields/Input_Text';

export default function EditNonConsumableProductModal({ isOpen, onClose, onSave, product }) {
  const [formData, setFormData] = useState({
    Non_Consumable_Product_ID: '',
    Category_Name: '',
    Item_Description: '',
    Unit: '',
    Quantity: '',
    Unit_Cost: '',
    Status: 'Available'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        Non_Consumable_Product_ID: product.Non_Consumable_Product_ID || '',
        Category_Name: product.Category_Name || '',
        Item_Description: product.Item_Description || '',
        Unit: product.Unit || '',
        Quantity: product.Quantity?.toString() || '',
        Unit_Cost: product.Unit_Cost?.toString() || '',
        Status: product.Status || 'Available'
      });
      setErrors({});
    }
  }, [isOpen, product]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Non_Consumable_Product_ID.trim()) {
      newErrors.Non_Consumable_Product_ID = 'Product ID is required';
    }
    
    if (!formData.Category_Name.trim()) {
      newErrors.Category_Name = 'Category is required';
    }
    
    if (!formData.Item_Description.trim()) {
      newErrors.Item_Description = 'Description is required';
    }
    
    if (!formData.Unit.trim()) {
      newErrors.Unit = 'Unit is required';
    }
    
    if (!formData.Quantity || formData.Quantity <= 0) {
      newErrors.Quantity = 'Quantity must be greater than 0';
    }
    
    if (!formData.Unit_Cost || formData.Unit_Cost <= 0) {
      newErrors.Unit_Cost = 'Unit cost must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const updatedProduct = {
        ...formData,
        Quantity: parseInt(formData.Quantity),
        Unit_Cost: parseFloat(formData.Unit_Cost),
        Total_Cost: (parseInt(formData.Quantity) * parseFloat(formData.Unit_Cost)).toFixed(2)
      };
      
      onSave(updatedProduct);
      onClose();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  const isFormValid = formData.Non_Consumable_Product_ID.trim() &&
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Non-Consumable Product</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Product ID */}
            <div>
              <Input_Text
                label="Product ID *"
                name="Non_Consumable_Product_ID"
                value={formData.Non_Consumable_Product_ID}
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Product ID cannot be changed</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="Category_Name"
                value={formData.Category_Name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.Category_Name ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="AV Equipment">AV Equipment</option>
                <option value="Office Equipment">Office Equipment</option>
              </select>
              {errors.Category_Name && (
                <p className="text-red-500 text-xs mt-1">{errors.Category_Name}</p>
              )}
            </div>

            {/* Description */}
            <div className="col-span-2">
              <Input_Text
                label="Description *"
                name="Item_Description"
                value={formData.Item_Description}
                onChange={handleInputChange}
                required
                placeholder="e.g., Laptop Dell XPS 15 inch"
              />
              {errors.Item_Description && (
                <p className="text-red-500 text-xs mt-1">{errors.Item_Description}</p>
              )}
            </div>

            {/* Unit */}
            <div>
              <Input_Text
                label="Unit *"
                name="Unit"
                value={formData.Unit}
                onChange={handleInputChange}
                required
                placeholder="e.g., per piece"
              />
              {errors.Unit && (
                <p className="text-red-500 text-xs mt-1">{errors.Unit}</p>
              )}
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
                min="1"
                placeholder="0"
              />
              {errors.Quantity && (
                <p className="text-red-500 text-xs mt-1">{errors.Quantity}</p>
              )}
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
              {errors.Unit_Cost && (
                <p className="text-red-500 text-xs mt-1">{errors.Unit_Cost}</p>
              )}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Available">Available</option>
                <option value="In Use">In Use</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>

          {/* Total Cost Preview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">Total Cost:</span>
              <span className="text-xl font-bold text-blue-600">₱{totalCost}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
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
        </form>
      </div>
    </div>
  );
}
