import React, { useState, useEffect } from 'react';
import Card from '../../components/cards/Card';
import DataTable from '../../components/DataTables/DataTable';
import SearchBar from '../../components/Input_Fields/SearchBar';
import Dropdown from '../../components/Input_Fields/Dropdown';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

// Sample audit data
const auditTransactions = [
  {
    id: 1,
    transactionId: 'TRX001',
    rf_no: 'RRF-2024-001',
    type_of_request: 'Issue',
    document_supplies_materials_equipment_requested: 'Bond Paper (A4) (Qty: 5 reams), Inkjet Printer Cartridge (Qty: 2 pieces), Ballpoint Pens (Qty: 1 box)',
    date_of_activity: '2024-01-15',
    start_time: '09:30 AM',
    end_time: '09:45 AM',
    purpose: 'Office supplies for Q1 2024 operations',
    requested_by: 'IT Department',
    approved_by: 'Dr. Maria Santos',
    served_by: 'Juan Dela Cruz',
    recieved_by: 'Michael Reyes',
    transaction_date: '2024-01-15',
    status: 'Completed'
  },
  {
    id: 2,
    transactionId: 'TRX002',
    rf_no: 'RRF-2024-002',
    type_of_request: 'Return',
    document_supplies_materials_equipment_requested: 'Laptop Dell Latitude 5420 (Qty: 1 unit), Laptop Bag (Qty: 1 unit)',
    date_of_activity: '2024-01-15',
    start_time: '10:15 AM',
    end_time: '10:30 AM',
    purpose: 'Equipment return after project completion',
    requested_by: 'John Smith',
    approved_by: 'Dr. Maria Santos',
    served_by: 'Juan Dela Cruz',
    recieved_by: 'Juan Dela Cruz',
    transaction_date: '2024-01-15',
    status: 'Completed'
  },
  {
    id: 3,
    transactionId: 'TRX003',
    rf_no: 'RRF-2024-003',
    type_of_request: 'Transfer',
    document_supplies_materials_equipment_requested: 'Whiteboard Markers (Qty: 10 pieces), Eraser Board (Qty: 2 pieces)',
    date_of_activity: '2024-01-14',
    start_time: '02:45 PM',
    end_time: '03:00 PM',
    purpose: 'Transfer from IT to HR Department for training materials',
    requested_by: 'HR Department',
    approved_by: 'Prof. James Wilson',
    served_by: 'Ana Rodriguez',
    recieved_by: 'Sarah Johnson',
    transaction_date: '2024-01-14',
    status: 'Completed'
  },
  {
    id: 4,
    transactionId: 'TRX004',
    rf_no: 'RRF-2024-004',
    type_of_request: 'Issue',
    document_supplies_materials_equipment_requested: 'Printer Toner HP Black (Qty: 3 cartridges), USB Flash Drives 32GB (Qty: 5 pieces)',
    date_of_activity: '2024-01-14',
    start_time: '11:20 AM',
    end_time: '11:35 AM',
    purpose: 'Printer maintenance and file storage for admin office',
    requested_by: 'Administrative Office',
    approved_by: 'Dr. Maria Santos',
    served_by: 'Juan Dela Cruz',
    recieved_by: 'Robert Chen',
    transaction_date: '2024-01-14',
    status: 'Pending'
  },
  {
    id: 5,
    transactionId: 'TRX005',
    rf_no: 'RRF-2024-005',
    type_of_request: 'Issue',
    document_supplies_materials_equipment_requested: 'Office Chair Ergonomic (Qty: 2 units), Desk Lamp LED (Qty: 2 units)',
    date_of_activity: '2024-01-13',
    start_time: '03:30 PM',
    end_time: '03:45 PM',
    purpose: 'New workstation setup for newly hired employees',
    requested_by: 'New Employees Orientation',
    approved_by: 'Prof. James Wilson',
    served_by: 'Ana Rodriguez',
    recieved_by: 'Emily Davis',
    transaction_date: '2024-01-13',
    status: 'Completed'
  },
  {
    id: 6,
    transactionId: 'TRX006',
    rf_no: 'RRF-2024-006',
    type_of_request: 'Issue',
    document_supplies_materials_equipment_requested: 'Projector Epson PowerLite (Qty: 1 unit), Extension Cord (Qty: 2 pieces)',
    date_of_activity: '2024-01-12',
    start_time: '08:00 AM',
    end_time: '08:15 AM',
    purpose: 'Equipment for departmental meeting presentation',
    requested_by: 'Research Department',
    approved_by: 'Dr. Maria Santos',
    served_by: 'Juan Dela Cruz',
    recieved_by: 'Dr. Robert Lee',
    transaction_date: '2024-01-12',
    status: 'Completed'
  },
  {
    id: 7,
    transactionId: 'TRX007',
    rf_no: 'RRF-2024-007',
    type_of_request: 'Return',
    document_supplies_materials_equipment_requested: 'Conference Room Key (Qty: 1 piece), Microphone Wireless (Qty: 1 unit)',
    date_of_activity: '2024-01-11',
    start_time: '04:00 PM',
    end_time: '04:10 PM',
    purpose: 'Return after conference event completion',
    requested_by: 'Events Committee',
    approved_by: 'Prof. James Wilson',
    served_by: 'Ana Rodriguez',
    recieved_by: 'Ana Rodriguez',
    transaction_date: '2024-01-11',
    status: 'Completed'
  },
  {
    id: 8,
    transactionId: 'TRX008',
    rf_no: 'RRF-2024-008',
    type_of_request: 'Issue',
    document_supplies_materials_equipment_requested: 'Binding Clips Metal 2 inch (Qty: 1 box), Manila Folders Letter Size (Qty: 50 pieces)',
    date_of_activity: '2024-01-10',
    start_time: '01:30 PM',
    end_time: '01:40 PM',
    purpose: 'Document preparation for accreditation visit',
    requested_by: 'Quality Assurance Office',
    approved_by: 'Dr. Maria Santos',
    served_by: 'Juan Dela Cruz',
    recieved_by: 'Lisa Martinez',
    transaction_date: '2024-01-10',
    status: 'Pending'
  }
];

export default function Transaction_Audit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [dateFilter, setDateFilter] = useState('all');
  const [transactions, setTransactions] = useState(auditTransactions);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Calculate month with most transactions
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
      'RF No': transaction.rf_no,
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
      'Transaction Date': transaction.transaction_date
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
    { key: 'rf_no', label: 'RF No' },
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
