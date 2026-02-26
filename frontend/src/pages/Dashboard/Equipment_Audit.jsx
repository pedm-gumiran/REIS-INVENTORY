import React, { useState, useEffect } from 'react';
import Card from '../../components/cards/Card';
import DataTable from '../../components/DataTables/DataTable';
import SearchBar from '../../components/Input_Fields/SearchBar';
import Dropdown from '../../components/Input_Fields/Dropdown';
import { FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import axiosInstance from '../../utils/axiosInstance';


export default function Equipment_Returned_Audit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [equipmentReturns, setEquipmentReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch equipment returns data
  useEffect(() => {
    const fetchEquipmentReturns = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/audits/equipment-returns');
        if (response.data.success) {
          // Transform API data to match frontend structure
          const transformedData = response.data.data.map(item => ({
            id: item.et_id,
            returnId: `RET${String(item.et_id).padStart(3, '0')}`,
            date: item.borrowed_date ? new Date(item.borrowed_date).toLocaleDateString() : new Date().toLocaleDateString(),
            time: item.borrowed_date ? new Date(item.borrowed_date).toLocaleTimeString() : new Date().toLocaleTimeString(),
            equipmentName: item.item_description || 'Unknown Equipment',
            serialNumber: item.product_id || 'N/A',
            assignedTo: item.client_name || 'Unknown',
            returnCondition: item.returned_quantity > 0 ? 'Returned' : 'Borrowed',
            issuesFound: item.returned_notes || 'None',
            processedBy: item.inspected_by || 'System',
            department: 'General',
            status: item.returned_quantity > 0 ? 'Completed' : 'Active',
            notes: item.returned_notes || ''
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

    fetchEquipmentReturns();
  }, []);

  // Filter returns based on search term and status
  const filteredReturns = equipmentReturns.filter(returnItem => {
    const matchesSearch = 
      returnItem.returnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || returnItem.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Export to Excel
  const handleExportToExcel = () => {
    const exportData = filteredReturns.map(returnItem => ({
      'Return ID': returnItem.returnId,
      'Return Date': returnItem.date,
      'Return Time': returnItem.time,
      'Equipment Name': returnItem.equipmentName,
      'Serial Number': returnItem.serialNumber,
      'Assigned To': returnItem.assignedTo,
      'Department': returnItem.department,
      'Condition': returnItem.returnCondition,
      'Issues Found': returnItem.issuesFound,
      'Processed By': returnItem.processedBy,
      'Status': returnItem.status,
      'Notes': returnItem.notes
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
    { key: 'returnId', label: 'Return ID' },
    { key: 'date', label: 'Return Date' },
    { key: 'time', label: 'Time' },
    { key: 'equipmentName', label: 'Equipment Name' },
    { key: 'serialNumber', label: 'Serial Number' },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'department', label: 'Department' },
    { 
      key: 'returnCondition', 
      label: 'Condition',
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
    { key: 'issuesFound', label: 'Issues Found' },
    { key: 'processedBy', label: 'Processed By' },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => {
        const statusColors = {
          'Completed': 'bg-green-100 text-green-800',
          'Maintenance Required': 'bg-orange-100 text-orange-800',
          'Under Repair': 'bg-red-100 text-red-800',
          'Pending': 'bg-yellow-100 text-yellow-800'
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

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search equipment returns..."
              name="returnSearch"
              width="w-full sm:w-64"
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
                { value: 'Under Repair', label: 'Under Repair' },
                { value: 'Pending', label: 'Pending' }
              ]}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExportToExcel}
              disabled={filteredReturns.length === 0}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                filteredReturns.length > 0 
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
            <p className="text-blue-600 text-sm font-medium">Total Returns</p>
            <p className="text-2xl font-bold text-blue-900">{equipmentReturns.length}</p>
          </div>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <div className="text-center">
            <p className="text-green-600 text-sm font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-900">
              {equipmentReturns.filter(r => r.status === 'Completed').length}
            </p>
          </div>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <div className="text-center">
            <p className="text-orange-600 text-sm font-medium">Maintenance Required</p>
            <p className="text-2xl font-bold text-orange-900">
              {equipmentReturns.filter(r => r.status === 'Maintenance Required').length}
            </p>
          </div>
        </Card>
      </div>

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
        />
      </Card>
    </div>
  );
}
