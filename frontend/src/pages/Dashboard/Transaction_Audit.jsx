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


export default function Transaction_Audit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch transaction audit data
  const fetchTransactionAudits = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/audits/transaction-audits');
      if (response.data.success) {
        // Transform API data to match frontend structure
        const transformedData = response.data.data.map(item => ({
          id: item.transaction_id,
          transactionId: String(item.transaction_id),
          rf_no: item.rrf_no || 'N/A',
          type_of_request: item.type_of_request || 'Issue',
          document_supplies_materials_equipment_requested: item.items_requested || 'N/A',
          date_of_activity: item.date_of_activity ? new Date(item.date_of_activity).toLocaleDateString() : (item.transaction_date ? new Date(item.transaction_date).toLocaleDateString() : new Date().toLocaleDateString()),
          start_time: item.start_time ? new Date(`2000-01-01 ${item.start_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : (item.transaction_date ? new Date(item.transaction_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })),
          end_time: item.end_time ? new Date(`2000-01-01 ${item.end_time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : '',
          purpose: item.purpose || 'N/A',
          requested_by: item.requested_by || 'Unknown',
          approved_by: item.approved_by || 'N/A',
          served_by: item.served_by || 'N/A',
          recieved_by: item.received_by || 'N/A',
          transaction_date: item.transaction_date ? new Date(item.transaction_date).toLocaleDateString() : new Date().toLocaleDateString(),
          status: 'Completed'
        }));
        setTransactions(transformedData);
      }
    } catch (err) {
      console.error('Error fetching transaction audits:', err);
      setError('Failed to load transaction audits');
      toast.error('Failed to load transaction audits');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchTransactionAudits();
      toast.success('Data refreshed successfully!');
    } catch (err) {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch transaction audit data
  useEffect(() => {
    fetchTransactionAudits();
  }, []);
  const getMonthWithMostTransactions = () => {
    const monthCounts = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date_of_activity);
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

  const { month: topMonth, count: topMonthCount } = getMonthWithMostTransactions();

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

  // Filter transactions based on search term and date
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.rf_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transaction_date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.date_of_activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.document_supplies_materials_equipment_requested.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.requested_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.approved_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.served_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.recieved_by.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'today' && transaction.date_of_activity === '2024-01-15') ||
      (dateFilter === 'week' && transaction.date_of_activity >= '2024-01-09') ||
      (dateFilter === 'month' && transaction.date_of_activity >= '2024-01-01');
    
    return matchesSearch && matchesDate;
  });

  // Export to Excel
  const handleExportToExcel = () => {
    const exportData = filteredTransactions.map(transaction => ({
      'Transaction ID': transaction.transactionId,
      'RRF No': transaction.rf_no,
      'Type of Request': transaction.type_of_request,
      'Document/Supplies/Materials/Equipment Requested': transaction.document_supplies_materials_equipment_requested,
      'Date of Activity': transaction.date_of_activity,
      'Start Time': transaction.start_time,
      'End Time': transaction.end_time,
      'Purpose': transaction.purpose,
      'Requested By': transaction.requested_by,
      'Approved By': transaction.approved_by,
      'Served By': transaction.served_by,
      'Received By': transaction.recieved_by,
      'Transaction Date': transaction.transaction_date,
      'Status': transaction.status
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transaction Audit');
    
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
    XLSX.writeFile(wb, `transaction_audit_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Transaction audit exported successfully!');
  };

  // Open delete modal with selected transactions
  const handleOpenDeleteModal = () => {
    if (selectedItems.length > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  // Open reset modal
  const handleOpenResetModal = () => {
    if (transactions.length > 0) {
      setIsResetModalOpen(true);
    }
  };

  // Delete selected transactions
  const handleDeleteTransaction = async (itemsToDelete) => {
    setIsDeleting(true);
    try {
      const deletePromises = itemsToDelete.map(async (item) => {
        return axiosInstance.delete(`/audits/transaction-audits/${item.id}`);
      });

      await Promise.all(deletePromises);
      
      // Refresh data from server
      await fetchTransactionAudits();
      setSelectedItems([]);
      toast.success(`${itemsToDelete.length} transaction(s) deleted successfully!`);
    } catch (error) {
      console.error('Error deleting transactions:', error);
      toast.error('Failed to delete transactions. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset all transactions
  const handleResetTransactions = async () => {
    try {
      setIsResetting(true);
      
      // Export to Excel before resetting
      handleExportToExcel();
      
      // Delete all transactions
      await axiosInstance.delete('/audits/transaction-audits');
      
      // Clear data
      setTransactions([]);
      setSelectedItems([]);
      toast.success('All transactions reset successfully!');
    } catch (err) {
      console.error('Error resetting transactions:', err);
      toast.error('Failed to reset transactions');
    } finally {
      setIsResetting(false);
    }
  };

  // Delete single transaction
  const handleDeleteSingle = async (id) => {
    try {
      await axiosInstance.delete(`/audits/transaction-audits/${id}`);
      toast.success('Transaction deleted successfully');
      // Remove from local state
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  // Table columns
  const columns = [
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'rf_no', label: 'RRF No' },
    { key: 'type_of_request', label: 'Type of Request' },
    { key: 'document_supplies_materials_equipment_requested', label: 'Document/Supplies/Materials/Equipment Requested' },
    { key: 'date_of_activity', label: 'Date of Activity' },
    { key: 'start_time', label: 'Start Time' },
    { key: 'end_time', label: 'End Time' },
    { key: 'purpose', label: 'Purpose' },
    { key: 'requested_by', label: 'Requested By' },
    { key: 'approved_by', label: 'Approved By' },
    { key: 'served_by', label: 'Served By' },
    { key: 'recieved_by', label: 'Received By' },
    { key: 'transaction_date', label: 'Transaction Date' },
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
            <h1 className="text-3xl font-bold mb-2">Transaction Audit</h1>
            <p className="text-green-100">
              View and track all inventory transactions with complete audit trail.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold">{formatTime(currentDateTime)}</div>
            <div className="text-green-100">{formatDate(currentDateTime)}</div>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-blue-600 text-sm font-medium">Total Transactions</p>
            <p className="text-2xl font-bold text-blue-900">{transactions.length}</p>
          </div>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <div className="text-center">
            <p className="text-purple-600 text-sm font-medium">Busiest Month</p>
            <p className="text-2xl font-bold text-purple-900">{topMonth}</p>
            <p className="text-purple-500 text-xs">{topMonthCount} transactions</p>
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
              placeholder="Search transactions..."
              name="transactionSearch"
              width="w-full"
            />
            <Dropdown
              id="dateFilter"
              name="dateFilter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Dates' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' }
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
              className={`flex-shrink-0 ${
                isRefreshing 
                    ? 'bg-blue-300 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 text-white '
              }`}
            />
            <Button
              onClick={handleExportToExcel}
              disabled={filteredTransactions.length === 0}
              icon={<FiDownload size={16} />}
              label="Export to Excel"
              className={`flex items-center gap-2 flex-shrink-0 ${
                filteredTransactions.length > 0 
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
              disabled={transactions.length === 0}
              isLoading={isResetting}
              loadingText="Resetting..."
              icon={<FiRefreshCw size={16} />}
              label="Reset All"
              className={`flex items-center gap-2 flex-shrink-0 ${
                transactions.length > 0 
                  ? 'bg-red-800 text-white hover:bg-orange-700' 
                  : 'bg-red-700 text-white cursor-not-allowed'
              }`}
            />
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card title="Transaction Audit Trail">
        <DataTable
          columns={columns}
          data={filteredTransactions}
          keyField="id"
          selectable={true}
          selected={selectedItems}
          onSelect={setSelectedItems}
          showCheckboxes={false}
          emptyMessage="No transactions found"
          loading={loading}
        />
      </Card>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTransaction}
        selectedItems={selectedItems.map(id => {
          const transaction = transactions.find(t => t.id === id);
          return transaction ? {
            id: transaction.id,
            Item_Description: `Transaction ID: ${transaction.transactionId}`,
            Consumable_Product_ID: transaction.rf_no
          } : null;
        }).filter(Boolean)}
        isLoading={isDeleting}
        title="Delete Transaction Confirmation"
      />

      <DeleteConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetTransactions}
        selectedItems={transactions.map(t => t.transactionId)}
        isLoading={isResetting}
        title="Reset All Transactions Confirmation"
        confirmButtonText="Proceed Reset"
      />
    </div>
  );
}
