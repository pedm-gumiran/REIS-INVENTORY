import React, { useState, useEffect } from 'react';
import Card from '../../components/cards/Card';
import DataTable from '../../components/DataTables/DataTable';
import SearchBar from '../../components/Input_Fields/SearchBar';
import Dropdown from '../../components/Input_Fields/Dropdown';
import Button from '../../components/Buttons/Button';
import { FiDownload, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import axiosInstance from '../../api/axios';
import DeleteConfirmationModal from '../../components/Forms/Edit_Forms/DeleteConfirmationModal';


export default function Equipment_Returned_Audit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [equipmentReturns, setEquipmentReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Fetch equipment returns data
  const fetchEquipmentReturns = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/audits/equipment-returns');
      if (response.data.success) {
        // Transform API data to match frontend structure
        const transformedData = response.data.data.map(item => ({
          id: item.et_id,
          et_id: item.et_id,
          client_name: item.client_name || 'Unknown',
          product_id: item.product_id || 'N/A',
          item_description: item.item_description || 'Unknown Equipment',
          borrowed_quantity: item.borrowed_quantity || 0,
          borrowed_date: item.borrowed_date || '-',
          borrowed_time: item.borrowed_time || '-',
          returned_quantity: item.returned_quantity || '-',
          returned_date: item.returned_date || '-',
          returned_time: item.returned_time || '-',
          returned_notes: item.returned_notes || '-',
          inspected_by: item.inspected_by || '-'
        }));
        setEquipmentReturns(transformedData);
      }
    } catch (err) {
      console.error('Error fetching equipment returns:', err);
      setError('Failed to load equipment returns');
      toast.error('Failed to load equipment returns');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchEquipmentReturns();
      toast.success('Data refreshed successfully!');
    } catch (err) {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch equipment returns data
  useEffect(() => {
    fetchEquipmentReturns();
  }, []);
  const getMonthWithMostReturns = () => {
    const monthCounts = {};
    
    equipmentReturns.forEach(returnItem => {
      const date = new Date(returnItem.borrowed_date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
    });
    
    let maxMonth = '';
    let maxCount = 0;
    
    Object.entries(monthCounts).forEach(([month, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxMonth = month;
      }
    });
    
    return { month: maxMonth, count: maxCount };
  };

  const { month: topMonth, count: topMonthCount } = getMonthWithMostReturns();

  // Calculate not yet returned items
  const getNotYetReturnedCount = () => {
    return equipmentReturns.filter(item => 
      item.returned_date === '-' || 
      item.returned_time === '-' || 
      item.returned_quantity === '-'
    ).length;
  };

  const notYetReturnedCount = getNotYetReturnedCount();

  // Filter returns based on search term and status
  const filteredReturns = equipmentReturns.filter(returnItem => {
    const matchesSearch = 
      String(returnItem.et_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.product_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.item_description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Open delete modal with selected returns
  const handleOpenDeleteModal = () => {
    if (selectedItems.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  // Open reset modal
  const handleOpenResetModal = () => {
    if (equipmentReturns.length > 0) {
      setIsResetModalOpen(true);
    }
  };

  // Delete selected returns
  const handleDeleteReturn = async (itemsToDelete) => {
    setIsDeleting(true);
    try {
      const deletePromises = itemsToDelete.map(async (item) => {
        return axiosInstance.delete(`/audits/equipment-returns/${item.id}`);
      });

      await Promise.all(deletePromises);
      
      // Refresh data from server
      await fetchEquipmentReturns();
      setSelectedItems([]);
      toast.success(`${itemsToDelete.length} equipment return(s) deleted successfully!`);
    } catch (error) {
      console.error('Error deleting equipment returns:', error);
      toast.error('Failed to delete equipment returns. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset all returns
  const handleResetReturns = async () => {
    try {
      setIsResetting(true);
      
      // Export to Excel before resetting
      handleExportToExcel();
      
      // Delete all returns
      await axiosInstance.delete('/audits/equipment-returns');
      
      // Clear data
      setEquipmentReturns([]);
      setSelectedItems([]);
      toast.success('All equipment returns reset successfully!');
    } catch (err) {
      console.error('Error resetting equipment returns:', err);
      toast.error('Failed to reset equipment returns');
    } finally {
      setIsResetting(false);
    }
  };
  const handleExportToExcel = () => {
    const exportData = filteredReturns.map(returnItem => ({
      'Equipment Transaction ID': returnItem.et_id,
      'Client Name': returnItem.client_name,
      'Product ID': returnItem.product_id,
      'Item Description': returnItem.item_description,
      'Borrowed Quantity': returnItem.borrowed_quantity,
      'Borrowed Date': returnItem.borrowed_date,
      'Borrowed Time': returnItem.borrowed_time,
      'Returned Quantity': returnItem.returned_quantity,
      'Returned Date': returnItem.returned_date,
      'Returned Time': returnItem.returned_time,
      'Returned Notes': returnItem.returned_notes,
      'Inspected By': returnItem.inspected_by
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Equipment Returns');
    
    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map(key => {
      const maxWidth = Math.max(
        key.length,
        ...exportData.map(row => String(row[key]).length)
      );
      return { wch: Math.min(maxWidth + 2, 50) };
    });
    ws['!cols'] = colWidths;
    
    // Generate file and download
    XLSX.writeFile(wb, `equipment_returns_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Equipment returns exported successfully!');
  };

  // Table columns
  const columns = [
    { key: 'et_id', label: 'Equipment Transaction ID' },
    { key: 'client_name', label: 'Client Name' },
    { key: 'product_id', label: 'Product ID' },
    { key: 'item_description', label: 'Item Description' },
    { key: 'borrowed_quantity', label: 'Borrowed Quantity' },
    { key: 'borrowed_date', label: 'Borrowed Date' },
    { key: 'borrowed_time', label: 'Borrowed Time' },
    { key: 'returned_quantity', label: 'Returned Quantity' },
    { key: 'returned_date', label: 'Returned Date' },
    { key: 'returned_time', label: 'Returned Time' },
    { key: 'returned_notes', label: 'Returned Notes' },
    { key: 'inspected_by', label: 'Inspected By' }
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
            <h1 className="text-3xl font-bold mb-2">Equipment Return Audit</h1>
            <p className="text-green-100">
              Track and audit all returned equipment with condition assessment and maintenance records.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold">{formatTime(currentDateTime)}</div>
            <div className="text-green-100">{formatDate(currentDateTime)}</div>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-blue-600 text-sm font-medium">Total Returns</p>
            <p className="text-2xl font-bold text-blue-900">{equipmentReturns.length}</p>
          </div>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <div className="text-center">
            <p className="text-red-600 text-sm font-medium">Not Yet Returned</p>
            <p className="text-2xl font-bold text-red-900">{notYetReturnedCount}</p>
          </div>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <div className="text-center">
            <p className="text-purple-600 text-sm font-medium">Busiest Month</p>
            <p className="text-2xl font-bold text-purple-900">{topMonth}</p>
            <p className="text-purple-500 text-xs">{topMonthCount} returns</p>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search equipment returns..."
              name="returnSearch"
              width="w-full"
            />
            <Dropdown
              id="statusFilter"
              name="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Maintenance Required', label: 'Maintenance Required' },
                { value: 'Under Repair', label: 'Under Repair' }
              ]}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              isLoading={isRefreshing}
              loadingText="Refreshing..."
              icon={<FiRefreshCw size={16} />}
              label="Refresh"
              className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
            />
            <Button
              onClick={handleExportToExcel}
              disabled={filteredReturns.length === 0}
              icon={<FiDownload size={16} />}
              label="Export to Excel"
              className={`flex items-center gap-2 flex-shrink-0 ${
                filteredReturns.length > 0 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                  : 'bg-orange-300 text-white cursor-not-allowed'
              }`}
            />
            <Button
              onClick={handleOpenDeleteModal}
              disabled={selectedItems.length === 0 || isDeleting}
              isLoading={isDeleting}
              loadingText="Deleting..."
              icon={<FiTrash2 size={16} />}
              label="Delete "
              className={`flex items-center gap-2 flex-shrink-0 ${
                selectedItems.length > 0 && !isDeleting
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-300 text-white cursor-not-allowed'
              }`}
            />
            <Button
              onClick={handleOpenResetModal}
              disabled={equipmentReturns.length === 0}
              isLoading={isResetting}
              loadingText="Resetting..."
              icon={<FiRefreshCw size={16} />}
              label="Reset All"
              className={`flex items-center gap-2 flex-shrink-0 ${
                equipmentReturns.length > 0 
                  ? 'bg-red-800 text-white hover:bg-orange-700' 
                  : 'bg-red-700 text-white cursor-not-allowed'
              }`}
            />
          </div>
        </div>
      </Card>

      {/* Returns Table */}
      <Card title="Equipment Return Records">
        <DataTable
          columns={columns}
          data={filteredReturns}
          keyField="id"
          selectable={true}
          selected={selectedItems}
          onSelect={setSelectedItems}
          showCheckboxes={false}
          emptyMessage="No equipment returns found"
          loading={loading}
        />
      </Card>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteReturn}
        selectedItems={selectedItems.map(id => {
          const returnItem = equipmentReturns.find(r => r.id === id);
          return returnItem ? {
            id: returnItem.id,
            Item_Description: `Equipment Transaction ID: ${returnItem.et_id}`,
            Consumable_Product_ID: returnItem.product_id
          } : {
            id: id,
            Item_Description: id,
            Consumable_Product_ID: id
          };
        })}
        isLoading={isDeleting}
        title="Delete Equipment Return Confirmation"
      />

      <DeleteConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetReturns}
        selectedItems={equipmentReturns.map(r => r.et_id)}
        isLoading={isResetting}
        title="Reset All Equipment Returns Confirmation"
        confirmButtonText="Proceed Reset"
      />
    </div>
  );
}
