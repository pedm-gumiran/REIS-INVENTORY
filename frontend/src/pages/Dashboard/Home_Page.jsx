import React, { useState, useEffect } from 'react';
import Card from '../../components/cards/Card';
import DataTable from '../../components/DataTables/DataTable';
import { useUser } from '../../components/context/UserContext';
import SearchBar from '../../components/Input_Fields/SearchBar';

export default function Home_Page() {
  const { user } = useUser();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [stockSearchTerm, setStockSearchTerm] = useState('');
  const [equipmentSearchTerm, setEquipmentSearchTerm] = useState('');
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);

  // Sample data for stocks
  const stocksData = [
    { id: 1, productName: 'Laptop Dell XPS', category: 'Electronics', quantity: 15, unitPrice: 1200, status: 'In Stock' },
    { id: 2, productName: 'Office Chair', category: 'Furniture', quantity: 8, unitPrice: 250, status: 'In Stock' },
    { id: 3, productName: 'Wireless Mouse', category: 'Electronics', quantity: 25, unitPrice: 35, status: 'In Stock' },
    { id: 4, productName: 'Desk Lamp', category: 'Furniture', quantity: 12, unitPrice: 45, status: 'Low Stock' },
    { id: 5, productName: 'USB Keyboard', category: 'Electronics', quantity: 30, unitPrice: 65, status: 'In Stock' },
  ];

  // Sample data for equipment
  const equipmentData = [
    { id: 1, equipmentName: 'Printer HP LaserJet', type: 'Office Equipment', quantity: 3, condition: 'Good', location: 'Office A' },
    { id: 2, equipmentName: 'Projector Epson', type: 'AV Equipment', quantity: 2, condition: 'Excellent', location: 'Conference Room' },
    { id: 3, equipmentName: 'Scanner Canon', type: 'Office Equipment', quantity: 1, condition: 'Fair', location: 'Office B' },
    { id: 4, equipmentName: 'Whiteboard', type: 'Office Equipment', quantity: 5, condition: 'Good', location: 'Various Rooms' },
    { id: 5, equipmentName: 'Coffee Machine', type: 'Kitchen Equipment', quantity: 1, condition: 'Good', location: 'Pantry' },
  ];

  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter stocks based on stock search term
  const filteredStocks = stocksData.filter(stock =>
    stock.productName.toLowerCase().includes(stockSearchTerm.toLowerCase()) ||
    stock.category.toLowerCase().includes(stockSearchTerm.toLowerCase())
  );

  // Filter equipment based on equipment search term
  const filteredEquipment = equipmentData.filter(equipment =>
    equipment.equipmentName.toLowerCase().includes(equipmentSearchTerm.toLowerCase()) ||
    equipment.type.toLowerCase().includes(equipmentSearchTerm.toLowerCase())
  );

  // Calculate totals
  const totalStockQuantity = stocksData.reduce((sum, stock) => sum + stock.quantity, 0);
  const totalEquipmentQuantity = equipmentData.reduce((sum, equipment) => sum + equipment.quantity, 0);

  // Search handlers
  const handleStockSearch = (e) => {
    setStockSearchTerm(e.target.value);
  };

  const handleEquipmentSearch = (e) => {
    setEquipmentSearchTerm(e.target.value);
  };

  // Table columns for stocks
  const stockColumns = [
    { key: 'productName', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'unitPrice', label: 'Unit Price ($)' },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          status === 'In Stock' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      )
    },
  ];

  // Table columns for equipment
  const equipmentColumns = [
    { key: 'equipmentName', label: 'Equipment Name' },
    { key: 'type', label: 'Type' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'condition', label: 'Condition' },
    { key: 'location', label: 'Location' },
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
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-green-100">
              Here's what's happening with your inventory today.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold">{formatTime(currentDateTime)}</div>
            <div className="text-green-100">{formatDate(currentDateTime)}</div>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Consumable Products</p>
              <p className="text-2xl font-bold text-blue-900">{stocksData.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Non-Consumable Products</p>
              <p className="text-2xl font-bold text-purple-900">{totalEquipmentQuantity}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Stock Quantity</p>
              <p className="text-2xl font-bold text-green-900">{totalStockQuantity}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Stocks Table */}
        <Card title="Consumable Products">
          <SearchBar
            value={stockSearchTerm}
            onChange={handleStockSearch}
            placeholder="Search stocks..."
            name="stockSearch"
            width="w-full"
          />
          <DataTable
            columns={stockColumns}
            data={filteredStocks}
            keyField="id"
            selectable={true}
            selected={selectedStocks}
            onSelect={setSelectedStocks}
            showCheckboxes={false}
            emptyMessage="No stocks found"
          />
        </Card>

        {/* Equipment Table */}
        <Card title="Non-Consumable Products">
          <SearchBar
            value={equipmentSearchTerm}
            onChange={handleEquipmentSearch}
            placeholder="Search equipment..."
            name="equipmentSearch"
            width="w-full"
          />
          <DataTable
            columns={equipmentColumns}
            data={filteredEquipment}
            keyField="id"
            selectable={true}
            selected={selectedEquipment}
            onSelect={setSelectedEquipment}
            showCheckboxes={false}
            emptyMessage="No equipment found"
          />
        </Card>
      </div>
    </div>
  );
}
