import React, { useState, useEffect } from 'react';
import Card from '../../components/cards/Card';
import DataTable from '../../components/DataTables/DataTable';
import SearchBar from '../../components/Input_Fields/SearchBar';
import AddConsumableProductModal from '../../components/Forms/Add_Forms/AddConsumableProductModal';
import EditConsumableProductModal from '../../components/Forms/Edit_Forms/EditConsumableProductModal';
import DeleteConfirmationModal from '../../components/Forms/Edit_Forms/DeleteConfirmationModal';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

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

export default function Manage_Consumable_Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [products, setProducts] = useState(consumableProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.Consumable_Product_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Category_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Item_Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle add product
  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    toast.success('Consumable product added successfully!');
  };

  // Handle edit product
  const handleEditProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => 
      p.Consumable_Product_ID === updatedProduct.Consumable_Product_ID ? updatedProduct : p
    ));
    setSelectedItems([]);
    toast.success('Consumable product updated successfully!');
  };

  // Handle delete product
  const handleDeleteProduct = (itemsToDelete) => {
    const idsToDelete = itemsToDelete.map(item => 
      typeof item === 'string' ? item : item.Consumable_Product_ID
    );
    setProducts(prev => prev.filter(p => !idsToDelete.includes(p.Consumable_Product_ID)));
    setSelectedItems([]);
    toast.success(`${itemsToDelete.length} consumable product(s) deleted successfully!`);
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
      'Product ID': product.Consumable_Product_ID,
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
    XLSX.utils.book_append_sheet(wb, ws, 'Consumable Products');
    
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
    XLSX.writeFile(wb, `consumable_products_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Consumable products exported successfully!');
  };

  // Open edit modal with selected product
  const handleOpenEditModal = () => {
    if (selectedItems.length === 1) {
      const selectedId = selectedItems[0];
      const productToEdit = products.find(p => p.Consumable_Product_ID === selectedId);
      setEditingProduct(productToEdit);
      setIsEditModalOpen(true);
    }
  };

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
      render: (cellValue, row) => {
        // Calculate status based on quantity
        let status;
        if (row.Quantity <= 10) {
          status = 'Low Stock';
        } else {
          status = 'In Stock';
        }
        
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

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Consumable Products</h1>
            <p className="text-green-100">
              Manage and track consumable inventory items that are used up over time.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold">{formatTime(currentDateTime)}</div>
            <div className="text-green-100">{formatDate(currentDateTime)}</div>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-blue-600 text-sm font-medium">Total Products</p>
            <p className="text-2xl font-bold text-blue-900">{products.length}</p>
          </div>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <div className="text-center">
            <p className="text-green-600 text-sm font-medium">In Stock</p>
            <p className="text-2xl font-bold text-green-900">
              {products.filter(p => p.Quantity > 10).length}
            </p>
          </div>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <p className="text-yellow-600 text-sm font-medium">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-900">
              {products.filter(p => p.Quantity <= 10).length}
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
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-shrink-0"
            >
              Add Product
            </button>
            <button 
              onClick={handleOpenEditModal}
              disabled={selectedItems.length !== 1 || filteredProducts.length === 0}
              className={`px-4 py-2 rounded-lg transition-colors flex-shrink-0 ${
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
              className={`px-4 py-2 rounded-lg transition-colors flex-shrink-0 ${
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
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 flex-shrink-0 ${
                filteredProducts.length > 0 
                  ? 'bg-orange-600 text-white hover:bg-orange-700' 
                  : 'bg-orange-300 text-white cursor-not-allowed'
              }`}
            >
              <FiDownload size={16} />
              Export Report
            </button>
          </div>
        </div>
     </Card>
     

      {/* Products Table */}
      <Card title="Consumable Products Inventory">
        <DataTable
          columns={columns}
          data={filteredProducts}
          keyField="Consumable_Product_ID"
          selectable={true}
          selected={selectedItems}
          onSelect={setSelectedItems}
          showCheckboxes={false}
          emptyMessage="No consumable products found"
        />
      </Card>
      {/* Add Product Modal */}
      <AddConsumableProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProduct}
      />

      {/* Edit Product Modal */}
      <EditConsumableProductModal
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
        selectedItems={selectedItems.map(id => products.find(p => p.Consumable_Product_ID === id))}
      />
    </div>
  );
}
