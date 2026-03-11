import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../../components/cards/Card';
import DataTable from '../../components/DataTables/DataTable';
import SearchBar from '../../components/Input_Fields/SearchBar';
import AddConsumableProductModal from '../../components/Forms/Add_Forms/AddConsumableProductModal';
import EditConsumableProductModal from '../../components/Forms/Edit_Forms/EditConsumableProductModal';
import DeleteConfirmationModal from '../../components/Forms/Edit_Forms/DeleteConfirmationModal';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import axiosInstance from '../../api/axios';
import Button from '../../components/Buttons/Button';
import { useNotificationContext } from '../../context/NotificationContext';

const getConsumableId = (item, index) => {
  if (item.product_id) {
    if (typeof item.product_id === 'string') return item.product_id;
    return `CP${String(item.product_id).padStart(3, '0')}`;
  }
  return `CP${String(index + 1).padStart(3, '0')}`;
};

export default function Manage_Consumable_Products() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get notification context to refresh notifications after CRUD operations
  const { refetchNotifications } = useNotificationContext();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/consumables');
        
        // Transform data to match table structure
        const transformedProducts = response.data.data.map((item, index) => ({
          id: item.product_id || index + 1,
          Consumable_Product_ID: getConsumableId(item, index),
          Category_Name: item.category || 'Uncategorized',
          Item_Description: item.item_description || 'No description',
          Unit: item.unit || 'per piece',
          Quantity: item.quantity || 0,
          Unit_Cost: parseFloat(item.unit_cost) || 0,
        }));
        
        setProducts(transformedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching consumable products:', err);
        setError('Failed to load products. Please try again.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

// Reset scroll position to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle navigation state for highlighting
  useEffect(() => {
    // Only highlight if we have a valid highlightItemId from notification state
    if (location.state?.highlightItemId && location.state?.fromNotification === true) {
      console.log('Highlighting item from notification:', location.state.highlightItemId);
      setHighlightedItemId(location.state.highlightItemId);
      
      // Scroll to the highlighted item after a short delay
      setTimeout(() => {
        const element = document.getElementById(`highlight-${location.state.highlightItemId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
      
      // Clear the navigation state to prevent re-highlighting on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Ensure no highlighting if not coming from notification
      setHighlightedItemId(null);
    }
  }, [location.state]);

  // Clear highlighted item after any CRUD operation
  const clearHighlight = () => {
    if (highlightedItemId) {
      console.log('Clearing highlight after CRUD operation');
      setHighlightedItemId(null);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.Consumable_Product_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Category_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Item_Description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle add product
  const handleAddProduct = async (newProduct) => {
    setIsAdding(true);
    try {
      // Transform data for API - match database schema
      const apiData = {
        product_id: newProduct.Consumable_Product_ID,
        item_description: newProduct.Item_Description,
        category: newProduct.Category_Name,
        unit: newProduct.Unit,
        quantity: newProduct.Quantity,
        unit_cost: newProduct.Unit_Cost,
      };

      const response = await axiosInstance.post('/consumables', apiData);
      
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh data from server
      const refreshResponse = await axiosInstance.get('/consumables');
      const transformedProducts = refreshResponse.data.data.map((item, index) => ({
        id: item.product_id || index + 1,
        Consumable_Product_ID: getConsumableId(item, index),
        Category_Name: item.category || 'Uncategorized',
        Item_Description: item.item_description || 'No description',
        Unit: item.unit || 'per piece',
        Quantity: item.quantity || 0,
        Unit_Cost: parseFloat(item.unit_cost) || 0,
      }));
      
      setProducts(transformedProducts);
      toast.success('Consumable product added successfully!');
      setIsAddModalOpen(false); // Only close on success
      refetchNotifications(); // Refresh notification bell
      clearHighlight(); // Clear highlight after operation
    } catch (error) {
      console.error('Error adding product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add product. Please try again.';
      toast.error(errorMessage);
      // Don't close modal on failure - let user try again
    } finally {
      setIsAdding(false);
    }
  };

  // Handle edit product
  const handleEditProduct = async (updatedProduct) => {
    setIsUpdating(true);
    try {
      // Find the original product to get its ID
      const originalProduct = products.find(p => p.Consumable_Product_ID === updatedProduct.Consumable_Product_ID);
      if (!originalProduct) {
        toast.error('Product not found');
        setIsUpdating(false);
        return; // Don't close modal on error
      }

      // Transform data for API - match database schema
      const apiData = {
        item_description: updatedProduct.Item_Description,
        category: updatedProduct.Category_Name,
        unit: updatedProduct.Unit,
        quantity: updatedProduct.Quantity,
        unit_cost: updatedProduct.Unit_Cost,
      };

      await axiosInstance.put(`/consumables/${originalProduct.id}`, apiData);
      
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh data from server
      const refreshResponse = await axiosInstance.get('/consumables');
      const transformedProducts = refreshResponse.data.data.map((item, index) => ({
        id: item.product_id || index + 1,
        Consumable_Product_ID: getConsumableId(item, index),
        Category_Name: item.category || 'Uncategorized',
        Item_Description: item.item_description || 'No description',
        Unit: item.unit || 'per piece',
        Quantity: item.quantity || 0,
        Unit_Cost: parseFloat(item.unit_cost) || 0,
      }));
      
      setProducts(transformedProducts);
      setSelectedItems([]);
      toast.success('Consumable product updated successfully!');
      setIsEditModalOpen(false); // Only close on success
      setEditingProduct(null);
      refetchNotifications(); // Refresh notification bell
      clearHighlight(); // Clear highlight after operation
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
      // Don't close modal on failure - let user try again
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (itemsToDelete) => {
    setIsDeleting(true);
    try {
      const deletePromises = itemsToDelete.map(async (item) => {
        const productId = typeof item === 'string' 
          ? products.find(p => p.Consumable_Product_ID === item)?.id
          : products.find(p => p.Consumable_Product_ID === item.Consumable_Product_ID)?.id;
        
        if (productId) {
          return axiosInstance.delete(`/consumables/${productId}`);
        }
        throw new Error('Product not found');
      });

      await Promise.all(deletePromises);
      
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh data from server
      const refreshResponse = await axiosInstance.get('/consumables');
      const transformedProducts = refreshResponse.data.data.map((item, index) => ({
        id: item.product_id || index + 1,
        Consumable_Product_ID: getConsumableId(item, index),
        Category_Name: item.category || 'Uncategorized',
        Item_Description: item.item_description || 'No description',
        Unit: item.unit || 'per piece',
        Quantity: item.quantity || 0,
        Unit_Cost: parseFloat(item.unit_cost) || 0,
      }));
      
      setProducts(transformedProducts);
      setSelectedItems([]);
      toast.success(`${itemsToDelete.length} consumable product(s) deleted successfully!`);
      refetchNotifications(); // Refresh notification bell
      clearHighlight(); // Clear highlight after operation
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete products. Please try again.');
    } finally {
      setIsDeleting(false);
    }
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
            <Button
              onClick={() => setIsAddModalOpen(true)}
              disabled={isAdding}
              isLoading={isAdding}
              loadingText="Adding..."
              label="Add Product"
              className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0"
              variant="primary"
            />
            <Button
              onClick={handleOpenEditModal}
              disabled={selectedItems.length !== 1 || filteredProducts.length === 0 || isUpdating}
              isLoading={isUpdating}
              loadingText="Updating..."
              label="Edit"
              className={`flex-shrink-0 ${
                selectedItems.length === 1 && filteredProducts.length > 0 && !isUpdating
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-300 text-white cursor-not-allowed'
              }`}
              variant="primary"
            />
            <Button
              onClick={handleOpenDeleteModal}
              disabled={selectedItems.length === 0 || filteredProducts.length === 0 || isDeleting}
              isLoading={isDeleting}
              loadingText="Deleting..."
              label="Delete"
              className={`flex-shrink-0 ${
                selectedItems.length > 0 && filteredProducts.length > 0 && !isDeleting
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-300 text-white cursor-not-allowed'
              }`}
              variant="primary"
            />
            <Button
              onClick={handleExportToExcel}
              disabled={filteredProducts.length === 0}
              icon={<FiDownload size={16} />}
              label="Export to Excel"
              className={`flex items-center gap-2 flex-shrink-0 ${
                filteredProducts.length > 0 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                  : 'bg-orange-300 text-white cursor-not-allowed'
              }`}
              variant="primary"
            />
          </div>
        </div>
     </Card>
     

      {/* Products Table */}
      <Card title="Consumable Products Inventory">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <DataTable
          columns={columns}
          data={filteredProducts}
          keyField="Consumable_Product_ID"
          selectable={true}
          selected={selectedItems}
          onSelect={setSelectedItems}
          showCheckboxes={false}
          emptyMessage={loading ? "Loading products..." : "No consumable products found"}
          loading={loading}
          highlightedItemId={highlightedItemId}
          getRowId={(row) => row.id}
        />
      </Card>
      {/* Add Product Modal */}
      <AddConsumableProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProduct}
        isLoading={isAdding}
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
        isLoading={isUpdating}
      />
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        selectedItems={selectedItems.map(id => products.find(p => p.Consumable_Product_ID === id))}
        isLoading={isDeleting}
      />
    </div>
  );
}
