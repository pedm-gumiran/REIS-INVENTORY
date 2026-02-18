import React, { useState } from 'react';
import Card from '../../components/cards/Card';
import DataTable from '../../components/DataTables/DataTable';
import SearchBar from '../../components/Input_Fields/SearchBar';

export default function Manage_Consumable_Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // Sample data for consumable products
  const consumableProducts = [
    { 
      Consumable_Product_ID: 'CP001', 
      Category_Name: 'Stationery', 
      Item_Description: 'Office Paper A4 Premium Quality', 
      Unit: 'per ream', 
      Quantity: 500, 
      Unit_Cost: 25.00, 
      Status: 'In Stock' 
    },
    { 
      Consumable_Product_ID: 'CP002', 
      Category_Name: 'Stationery', 
      Item_Description: 'Ballpoint Pens Blue Ink', 
      Unit: 'per piece', 
      Quantity: 1200, 
      Unit_Cost: 2.50, 
      Status: 'In Stock' 
    },
    { 
      Consumable_Product_ID: 'CP003', 
      Category_Name: 'Office Supplies', 
      Item_Description: 'Printer Toner HP Black', 
      Unit: 'per cartridge', 
      Quantity: 45, 
      Unit_Cost: 85.00, 
      Status: 'Low Stock' 
    },
    { 
      Consumable_Product_ID: 'CP004', 
      Category_Name: 'Stationery', 
      Item_Description: 'Manila Folders Letter Size', 
      Unit: 'per piece', 
      Quantity: 800, 
      Unit_Cost: 3.75, 
      Status: 'In Stock' 
    },
    { 
      Consumable_Product_ID: 'CP005', 
      Category_Name: 'Electronics', 
      Item_Description: 'USB Flash Drives 32GB', 
      Unit: 'per piece', 
      Quantity: 75, 
      Unit_Cost: 12.00, 
      Status: 'In Stock' 
    },
    { 
      Consumable_Product_ID: 'CP006', 
      Category_Name: 'Stationery', 
      Item_Description: 'Whiteboard Markers Assorted Colors', 
      Unit: 'per set', 
      Quantity: 150, 
      Unit_Cost: 4.25, 
      Status: 'In Stock' 
    },
    { 
      Consumable_Product_ID: 'CP007', 
      Category_Name: 'Stationery', 
      Item_Description: 'Binding Clips Metal 2 inch', 
      Unit: 'per box (100pcs)', 
      Quantity: 2000, 
      Unit_Cost: 0.50, 
      Status: 'In Stock' 
    },
    { 
      Consumable_Product_ID: 'CP008', 
      Category_Name: 'Accessories', 
      Item_Description: 'Laptop Stands Adjustable', 
      Unit: 'per piece', 
      Quantity: 30, 
      Unit_Cost: 35.00, 
      Status: 'Low Stock' 
    },
    { 
      Consumable_Product_ID: 'CP009', 
      Category_Name: 'Stationery', 
      Item_Description: 'Desk Calendars 2024', 
      Unit: 'per piece', 
      Quantity: 25, 
      Unit_Cost: 15.00, 
      Status: 'In Stock' 
    },
    { 
      Consumable_Product_ID: 'CP010', 
      Category_Name: 'Accessories', 
      Item_Description: 'Mouse Pads Gel Wrist Rest', 
      Unit: 'per piece', 
      Quantity: 60, 
      Unit_Cost: 8.50, 
      Status: 'In Stock' 
    },
  ];

  // Filter products based on search term
  const filteredProducts = consumableProducts.filter(product =>
    product.Consumable_Product_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Category_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Item_Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Table columns
  const columns = [
    { key: 'Consumable_Product_ID', label: 'Product ID' },
    { key: 'Category_Name', label: 'Category' },
    { key: 'Item_Description', label: 'Description' },
    { key: 'Unit', label: 'Unit' },
    { key: 'Quantity', label: 'Quantity' },
    { key: 'Unit_Cost', label: 'Unit Cost (₱)' },
    { 
      key: 'Total_Cost', 
      label: 'Total Cost (₱)',
      render: (cellValue, row) => (row.Quantity * row.Unit_Cost).toFixed(2)
    },
    { 
      key: 'Status', 
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              {consumableProducts.filter(p => p.Status === 'In Stock').length}
            </p>
          </div>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <p className="text-yellow-600 text-sm font-medium">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-900">
              {consumableProducts.filter(p => p.Status === 'Low Stock').length}
            </p>
          </div>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <div className="text-center">
            <p className="text-red-600 text-sm font-medium">Critical</p>
            <p className="text-2xl font-bold text-red-900">
              {consumableProducts.filter(p => p.Status === 'Critical').length}
            </p>
          </div>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card>
        <div className="space-y-4">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search consumable products..."
            name="productSearch"
            width="w-full"
          />
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Add Product
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Edit
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Delete
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Export
            </button>
          </div>
        </div>
      </Card>

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
