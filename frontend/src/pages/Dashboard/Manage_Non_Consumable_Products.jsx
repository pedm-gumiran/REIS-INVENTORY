import React, { useState } from 'react';
import Card from '../../components/cards/Card';
import DataTable from '../../components/DataTables/DataTable';
import SearchBar from '../../components/Input_Fields/SearchBar';

export default function Manage_Non_Consumable_Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // Sample data for non-consumable products
  const nonConsumableProducts = [
    { id: 1, productName: 'Laptop Dell XPS', category: 'Electronics', quantity: 15, serialNumber: 'DXS001-015', condition: 'Excellent', assignedTo: 'IT Department' },
    { id: 2, productName: 'Office Chair', category: 'Furniture', quantity: 25, serialNumber: 'CHR001-025', condition: 'Good', assignedTo: 'General Office' },
    { id: 3, productName: 'Projector Epson', category: 'AV Equipment', quantity: 5, serialNumber: 'PRJ001-005', condition: 'Good', assignedTo: 'Conference Room' },
    { id: 4, productName: 'Printer HP LaserJet', category: 'Office Equipment', quantity: 8, serialNumber: 'PRN001-008', condition: 'Fair', assignedTo: 'Various Departments' },
    { id: 5, productName: 'Whiteboard', category: 'Furniture', quantity: 12, serialNumber: 'WHT001-012', condition: 'Good', assignedTo: 'Meeting Rooms' },
  ];

  // Filter products based on search term
  const filteredProducts = nonConsumableProducts.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Table columns
  const columns = [
    { key: 'productName', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'serialNumber', label: 'Serial Numbers' },
    { key: 'condition', label: 'Condition' },
    { key: 'assignedTo', label: 'Assigned To' },
    { 
      key: 'condition', 
      label: 'Status',
      render: (condition) => {
        const conditionColors = {
          'Excellent': 'bg-green-100 text-green-800',
          'Good': 'bg-blue-100 text-blue-800',
          'Fair': 'bg-yellow-100 text-yellow-800',
          'Poor': 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${conditionColors[condition] || 'bg-gray-100 text-gray-800'}`}>
            {condition}
          </span>
        );
      }
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div>
          <h1 className="text-3xl font-bold mb-2">Non-Consumable Products</h1>
          <p className="text-green-100">
            Manage durable assets and equipment that retain value over time.
          </p>
        </div>
      </Card>

      {/* Search and Actions */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search non-consumable products..."
            name="productSearch"
            width="w-full sm:w-1/2"
          />
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Add Asset
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Export
            </button>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-blue-600 text-sm font-medium">Total Assets</p>
            <p className="text-2xl font-bold text-blue-900">{nonConsumableProducts.length}</p>
          </div>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <div className="text-center">
            <p className="text-green-600 text-sm font-medium">Excellent</p>
            <p className="text-2xl font-bold text-green-900">
              {nonConsumableProducts.filter(p => p.condition === 'Excellent').length}
            </p>
          </div>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-blue-600 text-sm font-medium">Good</p>
            <p className="text-2xl font-bold text-blue-900">
              {nonConsumableProducts.filter(p => p.condition === 'Good').length}
            </p>
          </div>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <p className="text-yellow-600 text-sm font-medium">Needs Maintenance</p>
            <p className="text-2xl font-bold text-yellow-900">
              {nonConsumableProducts.filter(p => p.condition === 'Fair').length}
            </p>
          </div>
        </Card>
      </div>

      {/* Products Table */}
      <Card title="Non-Consumable Assets Inventory">
        <DataTable
          columns={columns}
          data={filteredProducts}
          keyField="id"
          selectable={true}
          selected={selectedItems}
          onSelect={setSelectedItems}
          showCheckboxes={false}
          emptyMessage="No non-consumable products found"
        />
      </Card>
    </div>
  );
}
