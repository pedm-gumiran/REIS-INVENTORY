import React, { useState, useEffect } from 'react';
import { FiX, FiSearch, FiPackage, FiTool } from 'react-icons/fi';

export default function SuppliesEquipmentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialItems = [],
  title = "Specify Supplies/Materials/Equipment",
  onClearData // New prop to handle checkbox unchecking
}) {
  const [selectedItems, setSelectedItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('consumable');

  // Reset selectedItems when initialItems changes to empty
  useEffect(() => {
    if (initialItems.length === 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(initialItems);
    }
  }, [initialItems]);

  // Mock data for consumable products
  const consumableProducts = [
    { id: 'C001', name: 'Bond Paper (A4)', category: 'Office Supplies', stock: 500, unit: 'reams' },
    { id: 'C002', name: 'Inkjet Printer Cartridge', category: 'Office Supplies', stock: 50, unit: 'pieces' },
    { id: 'C003', name: 'Ballpoint Pens', category: 'Writing Materials', stock: 200, unit: 'boxes' },
    { id: 'C004', name: 'Marker Pens', category: 'Writing Materials', stock: 100, unit: 'pieces' },
    { id: 'C005', name: 'Folder (Legal Size)', category: 'Office Supplies', stock: 150, unit: 'pieces' },
    { id: 'C006', name: 'Staples', category: 'Office Supplies', stock: 80, unit: 'boxes' },
    { id: 'C007', name: 'Paper Clips', category: 'Office Supplies', stock: 200, unit: 'boxes' },
    { id: 'C008', name: 'Envelopes (Brown)', category: 'Office Supplies', stock: 300, unit: 'pieces' },
    { id: 'C009', name: 'Correction Fluid', category: 'Office Supplies', stock: 60, unit: 'bottles' },
    { id: 'C010', name: 'Highlighters', category: 'Writing Materials', stock: 120, unit: 'pieces' },
  ];

  // Mock data for non-consumable products (equipment)
  const nonConsumableProducts = [
    { id: 'N001', name: 'Laptop Computer', category: 'IT Equipment', stock: 15, unit: 'units', condition: 'Good' },
    { id: 'N002', name: 'Desktop Computer', category: 'IT Equipment', stock: 10, unit: 'units', condition: 'Good' },
    { id: 'N003', name: 'Projector', category: 'AV Equipment', stock: 8, unit: 'units', condition: 'Excellent' },
    { id: 'N004', name: 'Printer (Laser)', category: 'IT Equipment', stock: 12, unit: 'units', condition: 'Good' },
    { id: 'N005', name: 'Scanner', category: 'IT Equipment', stock: 6, unit: 'units', condition: 'Fair' },
    { id: 'N006', name: 'Photocopier', category: 'Office Equipment', stock: 4, unit: 'units', condition: 'Good' },
    { id: 'N007', name: 'Whiteboard', category: 'Office Equipment', stock: 20, unit: 'units', condition: 'Good' },
    { id: 'N008', name: 'Conference Table', category: 'Furniture', stock: 5, unit: 'units', condition: 'Excellent' },
    { id: 'N009', name: 'Office Chair', category: 'Furniture', stock: 25, unit: 'units', condition: 'Fair' },
    { id: 'N010', name: 'Filing Cabinet', category: 'Furniture', stock: 12, unit: 'units', condition: 'Good' },
  ];

  const handleItemSelect = (item, type) => {
    const existingItemIndex = selectedItems.findIndex(selected => selected.id === item.id);
    
    if (existingItemIndex > -1) {
      // Remove item if already selected
      setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
    } else {
      // Add item with quantity 1
      setSelectedItems([...selectedItems, { ...item, quantity: 1, type }]);
    }
  };

  const handleQuantityChange = (itemId, quantity) => {
    setSelectedItems(selectedItems.map(item => 
      item.id === itemId ? { ...item, quantity: parseInt(quantity) || 1 } : item
    ));
  };

  const handleSave = () => {
    onSave(selectedItems);
    onClose();
  };

  const filteredConsumable = consumableProducts.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNonConsumable = nonConsumableProducts.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={() => {
              if (onClearData) onClearData('supplies');
              onClose();
            }}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search supplies, materials, or equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('consumable')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === 'consumable'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiPackage size={16} />
                Consumable Products
              </button>
              <button
                onClick={() => setActiveTab('non-consumable')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === 'non-consumable'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FiTool size={16} />
                Non-Consumable Products (Equipment)
              </button>
            </nav>
          </div>

          {/* Tables */}
          <div className="space-y-6">
            {/* Consumable Products Table */}
            {activeTab === 'consumable' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Consumable Products</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Select
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredConsumable.map((item) => {
                        const isSelected = selectedItems.some(selected => selected.id === item.id);
                        const selectedItem = selectedItems.find(selected => selected.id === item.id);
                        
                        return (
                          <tr key={item.id} className={isSelected ? 'bg-green-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleItemSelect(item, 'consumable')}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.stock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {isSelected && (
                                <input
                                  type="number"
                                  min="1"
                                  max={item.stock}
                                  value={selectedItem?.quantity || 1}
                                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Non-Consumable Products Table */}
            {activeTab === 'non-consumable' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Non-Consumable Products (Equipment)</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Select
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Equipment Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Available
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Condition
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredNonConsumable.map((item) => {
                        const isSelected = selectedItems.some(selected => selected.id === item.id);
                        const selectedItem = selectedItems.find(selected => selected.id === item.id);
                        
                        return (
                          <tr key={item.id} className={isSelected ? 'bg-green-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleItemSelect(item, 'non-consumable')}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.stock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                item.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                                item.condition === 'Good' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.condition}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {isSelected && (
                                <input
                                  type="number"
                                  min="1"
                                  max={item.stock}
                                  value={selectedItem?.quantity || 1}
                                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Selected Items Summary */}
          {selectedItems.length > 0 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-semibold text-green-800 mb-2">
                Selected Items ({selectedItems.length})
              </h4>
              <div className="space-y-1">
                {selectedItems.map((item) => (
                  <div key={item.id} className="text-xs text-green-700">
                    {item.name} - Quantity: {item.quantity}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              if (onClearData) onClearData('supplies');
              onClose();
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={selectedItems.length === 0}
            className={`px-4 py-2 rounded-md transition-all ${
              selectedItems.length > 0
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save Items ({selectedItems.length})
          </button>
        </div>
      </div>
    </div>
  );
}
