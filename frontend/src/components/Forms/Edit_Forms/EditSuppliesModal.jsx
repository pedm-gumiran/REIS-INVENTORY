import React, { useState, useEffect } from 'react';
import { FiX, FiPackage, FiTool } from 'react-icons/fi';
import SearchBar from '../../Input_Fields/SearchBar';
import Input_Text from '../../Input_Fields/Input_Text';
import Button from '../../Buttons/Button';
import DataTable from '../../DataTables/DataTable';

export default function EditSuppliesModal({ 
  isOpen, 
  onClose, 
  onSave, 
  existingItems = [],
  title = "Edit Supplies/Materials/Equipment"
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('consumable');

  // Reset search term when switching tabs
  useEffect(() => {
    setSearchTerm('');
  }, [activeTab]);

  // Reset search term when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Initialize with existing items when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedItems(existingItems);
    }
  }, [existingItems, isOpen]);

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

  const filteredConsumable = consumableProducts.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNonConsumable = nonConsumableProducts.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'consumable' ? "Search consumable products..." : "Search non-consumable equipment..."}
              name="suppliesSearch"
              width="w-full"
            />
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('consumable')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === 'consumable'
                    ? 'border-blue-500 text-blue-600'
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
                    ? 'border-blue-500 text-blue-600'
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
                <DataTable
                  columns={[
                    { key: 'id', label: 'Item Code', className: 'font-medium' },
                    { key: 'name', label: 'Item Name' },
                    { key: 'category', label: 'Category' },
                    { key: 'stock', label: 'Stock' },
                    { key: 'unit', label: 'Unit' },
                    { 
                      key: 'quantity', 
                      label: 'Quantity',
                      render: (value, row) => {
                        const isSelected = selectedItems.some(selected => selected.id === row.id);
                        const selectedItem = selectedItems.find(selected => selected.id === row.id);
                        
                        return isSelected ? (
                          <input
                            type="number"
                            min="1"
                            max={row.stock}
                            value={selectedItem?.quantity || 1}
                            onChange={(e) => handleQuantityChange(row.id, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : null;
                      }
                    }
                  ]}
                  data={filteredConsumable}
                  selectable={true}
                  selected={selectedItems.filter(item => item.type === 'consumable').map(item => item.id)}
                  onSelect={(selectedIds) => {
                    const newSelectedItems = selectedItems.filter(item => item.type !== 'consumable');
                    const newConsumableItems = selectedIds.map(id => {
                      const item = filteredConsumable.find(item => item.id === id);
                      const existingItem = selectedItems.find(selected => selected.id === id);
                      return item ? { ...item, quantity: existingItem?.quantity || 1, type: 'consumable' } : null;
                    }).filter(Boolean);
                    setSelectedItems([...newConsumableItems, ...newSelectedItems]);
                  }}
                  keyField="id"
                  emptyMessage="No consumable products found"
                />
              </div>
            )}

            {/* Non-Consumable Products Table */}
            {activeTab === 'non-consumable' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Non-Consumable Products (Equipment)</h3>
                <DataTable
                  columns={[
                    { key: 'id', label: 'Item Code', className: 'font-medium' },
                    { key: 'name', label: 'Equipment Name' },
                    { key: 'category', label: 'Category' },
                    { key: 'stock', label: 'Available' },
                    { 
                      key: 'condition', 
                      label: 'Condition',
                      render: (value) => (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          value === 'Excellent' ? 'bg-green-100 text-green-800' :
                          value === 'Good' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {value}
                        </span>
                      )
                    },
                    { 
                      key: 'quantity', 
                      label: 'Quantity',
                      render: (value, row) => {
                        const isSelected = selectedItems.some(selected => selected.id === row.id);
                        const selectedItem = selectedItems.find(selected => selected.id === row.id);
                        
                        return isSelected ? (
                          <input
                            type="number"
                            min="1"
                            max={row.stock}
                            value={selectedItem?.quantity || 1}
                            onChange={(e) => handleQuantityChange(row.id, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : null;
                      }
                    }
                  ]}
                  data={filteredNonConsumable}
                  selectable={true}
                  selected={selectedItems.filter(item => item.type === 'non-consumable').map(item => item.id)}
                  onSelect={(selectedIds) => {
                    const newSelectedItems = selectedItems.filter(item => item.type !== 'non-consumable');
                    const newNonConsumableItems = selectedIds.map(id => {
                      const item = filteredNonConsumable.find(item => item.id === id);
                      const existingItem = selectedItems.find(selected => selected.id === id);
                      return item ? { ...item, quantity: existingItem?.quantity || 1, type: 'non-consumable' } : null;
                    }).filter(Boolean);
                    setSelectedItems([...newSelectedItems, ...newNonConsumableItems]);
                  }}
                  keyField="id"
                  emptyMessage="No equipment found"
                />
              </div>
            )}
          </div>

          {/* Selected Items Summary */}
          {selectedItems.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">
                Selected Items ({selectedItems.length})
              </h4>
              <div className="space-y-1">
                {selectedItems.map((item) => (
                  <div key={item.id} className="text-xs text-blue-700">
                    {item.name} - Quantity: {item.quantity}
                  </div>
                ))}
              </div>
            </div>
          )}
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
            label={`Update Items (${selectedItems.length})`}
            onClick={handleSave}
            disabled={selectedItems.length === 0}
            variant="modal-primary"
          />
        </div>
      </div>
    </div>
  );
}
