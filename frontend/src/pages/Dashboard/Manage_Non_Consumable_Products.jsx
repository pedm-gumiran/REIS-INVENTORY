import React, { useState } from 'react';
import Card from '../../components/cards/Card';
import DataTable from '../../components/DataTables/DataTable';
import SearchBar from '../../components/Input_Fields/SearchBar';
import AddNonConsumableProductModal from '../../components/Forms/Add_Forms/AddNonConsumableProductModal';
import EditNonConsumableProductModal from '../../components/Forms/Edit_Forms/EditNonConsumableProductModal';
import DeleteConfirmationModal from '../../components/Forms/Edit_Forms/DeleteConfirmationModal';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

// Sample data for non-consumable products
const nonConsumableProducts = [
  { 
    Non_Consumable_Product_ID: 'NCP001', 
    Category_Name: 'Electronics', 
    Item_Description: 'Laptop Dell XPS 15 inch', 
    Unit: 'per piece', 
    Quantity: 15, 
    Unit_Cost: 45000.00, 
    Status: 'Available' 
  },
  { 
    Non_Consumable_Product_ID: 'NCP002', 
    Category_Name: 'Furniture', 
    Item_Description: 'Office Chair Ergonomic', 
    Unit: 'per piece', 
    Quantity: 25, 
    Unit_Cost: 3500.00, 
    Status: 'Available' 
  },
  { 
    Non_Consumable_Product_ID: 'NCP003', 
    Category_Name: 'AV Equipment', 
    Item_Description: 'Projector Epson Full HD', 
    Unit: 'per piece', 
    Quantity: 5, 
    Unit_Cost: 25000.00, 
    Status: 'In Use' 
  },
  { 
    Non_Consumable_Product_ID: 'NCP004', 
    Category_Name: 'Office Equipment', 
    Item_Description: 'Printer HP LaserJet Pro', 
    Unit: 'per piece', 
    Quantity: 8, 
    Unit_Cost: 12000.00, 
    Status: 'Available' 
  },
  { 
    Non_Consumable_Product_ID: 'NCP005', 
    Category_Name: 'Furniture', 
    Item_Description: 'Whiteboard Magnetic 4x6', 
    Unit: 'per piece', 
    Quantity: 12, 
    Unit_Cost: 2500.00, 
    Status: 'Available' 
  },
  { 
    Non_Consumable_Product_ID: 'NCP006', 
    Category_Name: 'Electronics', 
    Item_Description: 'Monitor Dell 24 inch', 
    Unit: 'per piece', 
    Quantity: 30, 
    Unit_Cost: 8500.00, 
    Status: 'Available' 
  },
  { 
    Non_Consumable_Product_ID: 'NCP007', 
    Category_Name: 'Furniture', 
    Item_Description: 'Office Desk Executive', 
    Unit: 'per piece', 
    Quantity: 18, 
    Unit_Cost: 7500.00, 
    Status: 'Available' 
  },
  { 
    Non_Consumable_Product_ID: 'NCP008', 
    Category_Name: 'AV Equipment', 
    Item_Description: 'Conference Phone Polycom', 
    Unit: 'per piece', 
    Quantity: 3, 
    Unit_Cost: 15000.00, 
    Status: 'In Use' 
  },
  { 
    Non_Consumable_Product_ID: 'NCP009', 
    Category_Name: 'Electronics', 
    Item_Description: 'Desktop Computer Dell OptiPlex', 
    Unit: 'per piece', 
    Quantity: 20, 
    Unit_Cost: 28000.00, 
    Status: 'Available' 
  },
  { 
    Non_Consumable_Product_ID: 'NCP010', 
    Category_Name: 'Furniture', 
    Item_Description: 'Filing Cabinet 4 Drawer', 
    Unit: 'per piece', 
    Quantity: 10, 
    Unit_Cost: 4500.00, 
    Status: 'Available' 
  },
];

export default function Manage_Non_Consumable_Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [products, setProducts] = useState(nonConsumableProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.Non_Consumable_Product_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Category_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Item_Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle add product
  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    toast.success('Non-consumable product added successfully!');
  };

  // Handle edit product
  const handleEditProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => 
      p.Non_Consumable_Product_ID === updatedProduct.Non_Consumable_Product_ID ? updatedProduct : p
    ));
    setSelectedItems([]);
    toast.success('Non-consumable product updated successfully!');
  };

  // Handle delete product
  const handleDeleteProduct = (itemsToDelete) => {
    const idsToDelete = itemsToDelete.map(item => 
      typeof item === 'string' ? item : item.Non_Consumable_Product_ID
    );
    setProducts(prev => prev.filter(p => !idsToDelete.includes(p.Non_Consumable_Product_ID)));
    setSelectedItems([]);
    toast.success(`${itemsToDelete.length} non-consumable product(s) deleted successfully!`);
  };

  // Open delete modal with selected products
  const handleOpenDeleteModal = () => {
    if (selectedItems.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  // Export to Excel
  const handleExportToExcel = () => {
    const exportData = filteredProducts.map(product => ({
      'Product ID': product.Non_Consumable_Product_ID,
      'Category': product.Category_Name,
      'Description': product.Item_Description,
      'Unit': product.Unit,
      'Quantity': product.Quantity,
      'Unit Cost': product.Unit_Cost,
      'Total Cost': (product.Quantity * product.Unit_Cost).toFixed(2),
      'Status': product.Status
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Non-Consumable Products');
    
    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map(key => {
      const maxWidth = Math.max(
        key.length,
        ...exportData.map(row => String(row[key]).length)
      );
      return { wch: Math.min(maxWidth + 2, 50) }; // Max width 50, min padding 2
    });
    ws['!cols'] = colWidths;
    
    // Generate file and download
    XLSX.writeFile(wb, `non_consumable_products_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Non-consumable products exported successfully!');
  };

  // Open edit modal with selected product
  const handleOpenEditModal = () => {
    if (selectedItems.length === 1) {
      const selectedId = selectedItems[0];
      const productToEdit = products.find(p => p.Non_Consumable_Product_ID === selectedId);
      setEditingProduct(productToEdit);
      setIsEditModalOpen(true);
    }
  };

  // Table columns
  const columns = [
    { key: 'Non_Consumable_Product_ID', label: 'Product ID' },
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
          'Available': 'bg-green-100 text-green-800',
          'In Use': 'bg-blue-100 text-blue-800',
          'Maintenance': 'bg-yellow-100 text-yellow-800',
          'Retired': 'bg-red-100 text-red-800'
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
          <h1 className="text-3xl font-bold mb-2">Non-Consumable Products</h1>
          <p className="text-green-100">
            Manage and track non-consumable inventory items that retain value over time.
          </p>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-blue-600 text-sm font-medium">Total Products</p>
            <p className="text-2xl font-bold text-blue-900">{products.length}</p>
          </div>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <div className="text-center">
            <p className="text-green-600 text-sm font-medium">Available</p>
            <p className="text-2xl font-bold text-green-900">
              {products.filter(p => p.Status === 'Available').length}
            </p>
          </div>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-blue-600 text-sm font-medium">In Use</p>
            <p className="text-2xl font-bold text-blue-900">
              {products.filter(p => p.Status === 'In Use').length}
            </p>
          </div>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <p className="text-yellow-600 text-sm font-medium">Maintenance</p>
            <p className="text-2xl font-bold text-yellow-900">
              {products.filter(p => p.Status === 'Maintenance').length}
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
                placeholder="Search non-consumable products..."
                name="productSearch"
                width="w-full"
          />
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-shrink-0 overflow-x-auto"
            >
              Add Product
            </button>
            <button 
              onClick={handleOpenEditModal}
              disabled={selectedItems.length !== 1 || filteredProducts.length === 0}
              className={`px-4 py-2 rounded-lg transition-colors flex-shrink-0 overflow-x-auto ${
                selectedItems.length === 1 && filteredProducts.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-300 text-white cursor-not-allowed'
              }`}
            >
              Edit
            </button>
            <button 
              onClick={handleOpenDeleteModal}
              disabled={selectedItems.length === 0 || filteredProducts.length === 0}
              className={`px-4 py-2 rounded-lg transition-colors flex-shrink-0 overflow-x-auto ${
                selectedItems.length > 0 && filteredProducts.length > 0
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-red-300 text-white cursor-not-allowed'
              }`}
            >
              Delete
            </button>
            <button 
              onClick={handleExportToExcel}
              disabled={filteredProducts.length === 0}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 flex-shrink-0 overflow-x-auto ${
                filteredProducts.length > 0 
                  ? 'bg-orange-600 text-white hover:bg-orange-700' 
                  : 'bg-orange-300 text-white cursor-not-allowed'
              }`}
            >
              <FiDownload size={16} />
              Export
            </button>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card title="Non-Consumable Products Inventory">
        <DataTable
          columns={columns}
          data={filteredProducts}
          keyField="Non_Consumable_Product_ID"
          selectable={true}
          selected={selectedItems}
          onSelect={setSelectedItems}
          showCheckboxes={false}
          emptyMessage="No non-consumable products found"
        />
      </Card>
      {/* Add Product Modal */}
      <AddNonConsumableProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProduct}
      />

      {/* Edit Product Modal */}
      <EditNonConsumableProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleEditProduct}
        product={editingProduct}
      />
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        selectedItems={selectedItems.map(id => products.find(p => p.Non_Consumable_Product_ID === id))}
      />
    </div>
  );
}
