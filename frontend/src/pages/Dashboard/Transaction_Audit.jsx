import React, { useState } from 'react';
import Card from '../../components/cards/Card';
import DataTable from '../../components/DataTables/DataTable';
import SearchBar from '../../components/Input_Fields/SearchBar';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

// Sample audit data
const auditTransactions = [
  { 
    id: 1, 
    transactionId: 'TRX001', 
    date: '2024-01-15', 
    time: '09:30 AM',
    type: 'Issue', 
    product: 'Office Paper A4', 
    quantity: 10, 
    unit: 'Reams',
    processedBy: 'Admin User',
    recipient: 'IT Department',
    purpose: 'Office supplies',
    status: 'Completed'
  },
  { 
    id: 2, 
    transactionId: 'TRX002', 
    date: '2024-01-15', 
    time: '10:15 AM',
    type: 'Return', 
    product: 'Laptop Dell XPS', 
    quantity: 1, 
    unit: 'Unit',
    processedBy: 'Admin User',
    recipient: 'John Doe',
    purpose: 'Equipment return',
    status: 'Completed'
  },
  { 
    id: 3, 
    transactionId: 'TRX003', 
    date: '2024-01-14', 
    time: '02:45 PM',
    type: 'Transfer', 
    product: 'Ballpoint Pens', 
    quantity: 5, 
    unit: 'Boxes',
    processedBy: 'Admin User',
    recipient: 'HR Department',
    purpose: 'Department transfer',
    status: 'Completed'
  },
  { 
    id: 4, 
    transactionId: 'TRX004', 
    date: '2024-01-14', 
    time: '11:20 AM',
    type: 'Issue', 
    product: 'Printer Ink', 
    quantity: 3, 
    unit: 'Cartridges',
    processedBy: 'Admin User',
    recipient: 'Admin Office',
    purpose: 'Printer maintenance',
    status: 'Pending'
  },
  { 
    id: 5, 
    transactionId: 'TRX005', 
    date: '2024-01-13', 
    time: '03:30 PM',
    type: 'Issue', 
    product: 'Office Chair', 
    quantity: 2, 
    unit: 'Units',
    processedBy: 'Admin User',
    recipient: 'New Employees',
    purpose: 'New setup',
    status: 'Completed'
  },
];

export default function Transaction_Audit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [transactions, setTransactions] = useState(auditTransactions);

  // Filter transactions based on search term and date
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.processedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'today' && transaction.date === '2024-01-15') ||
      (dateFilter === 'week' && transaction.date >= '2024-01-09') ||
      (dateFilter === 'month' && transaction.date >= '2024-01-01');
    
    return matchesSearch && matchesDate;
  });

  // Export to Excel
  const handleExportToExcel = () => {
    const exportData = filteredTransactions.map(transaction => ({
      'Transaction ID': transaction.transactionId,
      'Date': transaction.date,
      'Time': transaction.time,
      'Type': transaction.type,
      'Product': transaction.product,
      'Quantity': transaction.quantity,
      'Unit': transaction.unit,
      'Processed By': transaction.processedBy,
      'Recipient': transaction.recipient,
      'Purpose': transaction.purpose,
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

  // Table columns
  const columns = [
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'type', label: 'Type' },
    { key: 'product', label: 'Product' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'unit', label: 'Unit' },
    { key: 'processedBy', label: 'Processed By' },
    { key: 'recipient', label: 'Recipient' },
    { key: 'purpose', label: 'Purpose' },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => {
        const statusColors = {
          'Completed': 'bg-green-100 text-green-800',
          'Pending': 'bg-yellow-100 text-yellow-800',
          'Cancelled': 'bg-red-100 text-red-800'
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
          <h1 className="text-3xl font-bold mb-2">Transaction Audit</h1>
          <p className="text-green-100">
            View and track all inventory transactions with complete audit trail.
          </p>
        </div>
      </Card>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              name="transactionSearch"
              width="w-full sm:w-64"
            />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExportToExcel}
              disabled={filteredTransactions.length === 0}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                filteredTransactions.length > 0 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-blue-300 text-white cursor-not-allowed'
              }`}
            >
              <FiDownload size={16} />
              Export Report
            </button>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-blue-600 text-sm font-medium">Total Transactions</p>
            <p className="text-2xl font-bold text-blue-900">{transactions.length}</p>
          </div>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <div className="text-center">
            <p className="text-green-600 text-sm font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-900">
              {transactions.filter(t => t.status === 'Completed').length}
            </p>
          </div>
        </Card>
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <p className="text-yellow-600 text-sm font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">
              {transactions.filter(t => t.status === 'Pending').length}
            </p>
          </div>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <div className="text-center">
            <p className="text-purple-600 text-sm font-medium">Today's Activity</p>
            <p className="text-2xl font-bold text-purple-900">
              {transactions.filter(t => t.date === '2024-01-15').length}
            </p>
          </div>
        </Card>
      </div>

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
        />
      </Card>
    </div>
  );
}
