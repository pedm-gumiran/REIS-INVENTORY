import React, { useState, useEffect } from 'react';
import { FiX, FiPackage, FiTool } from 'react-icons/fi';
import SearchBar from '../../Input_Fields/SearchBar';
import Input_Text from '../../Input_Fields/Input_Text';
import Button from '../../Buttons/Button';
import DataTable from '../../DataTables/DataTable';
import axiosInstance from '../../../api/axios';

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

  // Data states
  const [consumableData, setConsumableData] = useState([]);
  const [nonConsumableData, setNonConsumableData] = useState([]);
  const [loadingConsumable, setLoadingConsumable] = useState(false);
  const [loadingNonConsumable, setLoadingNonConsumable] = useState(false);

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

  // Sync selectedItems with parent state and handle clearing
  useEffect(() => {
    if (isOpen) {
      // Always sync with parent state when modal opens
      setSelectedItems(initialItems);
      // Fetch data when modal opens
      fetchConsumables();
      fetchNonConsumables();
    }
  }, [initialItems, isOpen]);

  // Function to fetch consumables
  const fetchConsumables = async () => {
    setLoadingConsumable(true);
    try {
      const response = await axiosInstance.get('/consumables');
      if (response.data.success) {
        const mappedData = response.data.data.map(item => ({
          id: item.product_id,
          name: item.item_description,
          category: item.category,
          stock: item.quantity,
          unit: item.unit
        }));
        setConsumableData(mappedData);
      }
    } catch (error) {
      console.error('Error fetching consumables:', error);
      setConsumableData([]);
    } finally {
      setLoadingConsumable(false);
    }
  };

  // Function to fetch non-consumables
  const fetchNonConsumables = async () => {
    setLoadingNonConsumable(true);
    try {
      const response = await axiosInstance.get('/non-consumables');
      if (response.data.success) {
        const mappedData = response.data.data.map(item => ({
          id: item.product_id,
          name: item.item_description,
          category: item.category,
          stock: item.quantity,
          unit: item.unit,
          condition: item.condition || 'Unknown',
          className: item.quantity === 0 ? 'bg-gray-100 opacity-50 cursor-not-allowed text-gray-500' : ''
        }));
        setNonConsumableData(mappedData);
      }
    } catch (error) {
      console.error('Error fetching non-consumables:', error);
      setNonConsumableData([]);
    } finally {
      setLoadingNonConsumable(false);
    }
  };

  const filteredConsumable = consumableData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNonConsumable = nonConsumableData.filter(item =>
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
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
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
                  emptyMessage={loadingConsumable ? "Loading consumable products..." : "No consumable products found"}
                  loading={loadingConsumable}
                  showCheckboxes={false}
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
                            className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
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
                    const newNonConsumableItems = selectedIds
                      .filter(id => {
                        const item = filteredNonConsumable.find(item => item.id === id);
                        return item && item.stock > 0;
                      })
                      .map(id => {
                        const item = filteredNonConsumable.find(item => item.id === id);
                        const existingItem = selectedItems.find(selected => selected.id === id);
                        return item ? { ...item, quantity: existingItem?.quantity || 1, type: 'non-consumable' } : null;
                      }).filter(Boolean);
                    setSelectedItems([...newSelectedItems, ...newNonConsumableItems]);
                  }}
                  keyField="id"
                  emptyMessage={loadingNonConsumable ? "Loading equipment..." : "No non consumable product found"}
                  loading={loadingNonConsumable}
                  showCheckboxes={false}
                />
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
          <Button
            label="Cancel"
            type="button"
            onClick={() => {
              if (onClearData) onClearData('supplies');
              onClose();
            }}
            variant="modal-secondary"
          />
          <Button
            label={`Save Items (${selectedItems.length})`}
            onClick={handleSave}
            disabled={selectedItems.length === 0}
            variant="modal-primary"
          />
        </div>
      </div>
    </div>
  );
}
