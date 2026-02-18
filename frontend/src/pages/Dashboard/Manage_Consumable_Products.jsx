import React, { useState } from 'react';
import Card from '../../components/cards/Card';
import DataTable from '../../components/DataTables/DataTable';
import SearchBar from '../../components/Input_Fields/SearchBar';

export default function Manage_Consumable_Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // Sample data for consumable products
  const consumableProducts = [
    { id: 1, productName: 'Office Paper A4', category: 'Stationery', quantity: 500, unit: 'Reams', unitCost: 25.00, status: 'In Stock', reorderLevel: 100 },
    { id: 2, productName: 'Ballpoint Pens', category: 'Writing Supplies', quantity: 200, unit: 'Boxes', unitCost: 15.50, status: 'In Stock', reorderLevel: 50 },
    { id: 3, productName: 'Printer Ink', category: 'Office Supplies', quantity: 30, unit: 'Cartridges', unitCost: 45.00, status: 'Low Stock', reorderLevel: 20 },
    { id: 4, productName: 'Cleaning Solution', category: 'Maintenance', quantity: 15, unit: 'Bottles', unitCost: 12.00, status: 'In Stock', reorderLevel: 10 },
    { id: 5, productName: 'Coffee Beans', category: 'Pantry', quantity: 5, unit: 'Kg', unitCost: 35.00, status: 'Critical', reorderLevel: 2 },
  ];

  // Filter products based on search term
  const filteredProducts = consumableProducts.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Table columns
  const columns = [
    { key: 'productName', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'unit', label: 'Unit' },
    { key: 'unitCost', label: 'Unit Cost ($)' },
    { key: 'reorderLevel', label: 'Reorder Level' },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => {
        const statusColors = {
          'In Stock': 'bg-green-100 text-green-800',
          'Low Stock': 'bg-yellow-100 text-yellow-800',
          'Critical': 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
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
          <h1 className="text-3xl font-bold mb-2">Consumable Products</h1>
          <p className="text-green-100">
            Manage and track consumable inventory items that are used up over time.
          </p>
        </div>
      </Card>

      {/* Search and Actions */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search consumable products..."
            name="productSearch"
            width="w-full sm:w-1/2"
          />
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Add Product
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
            <p className="text-blue-600 text-sm font-medium">Total Products</p>
            <p className="text-2xl font-bold text-blue-900">{consumableProducts.length}</p>
          </div>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <div className="text-center">
            <p className="text-green-600 text-sm font-medium">In Stock</p>
            <p className="text-2xl font-bold text-green-900">
              {consumableProducts.filter(p => p.status === 'In Stock').length}
            </p>
          </div>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <p className="text-yellow-600 text-sm font-medium">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-900">
              {consumableProducts.filter(p => p.status === 'Low Stock').length}
            </p>
          </div>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <div className="text-center">
            <p className="text-red-600 text-sm font-medium">Critical</p>
            <p className="text-2xl font-bold text-red-900">
              {consumableProducts.filter(p => p.status === 'Critical').length}
            </p>
          </div>
        </Card>
      </div>

      {/* Products Table */}
      <Card title="Consumable Products Inventory">
        <DataTable
          columns={columns}
          data={filteredProducts}
          keyField="id"
          selectable={true}
          selected={selectedItems}
          onSelect={setSelectedItems}
          showCheckboxes={false}
          emptyMessage="No consumable products found"
        />
      </Card>
    </div>
  );
}
