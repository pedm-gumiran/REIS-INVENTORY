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

  // Sample data for equipment
  const equipmentData = [
    { 
      Consumable_Product_ID: 'EQ001', 
      Category_Name: 'Office Equipment', 
      Item_Description: 'Printer HP LaserJet Pro M404n', 
      Unit: 'per unit', 
      Quantity: 3, 
      Unit_Cost: 15000.00, 
      Status: 'Available'
    },
    { 
      Consumable_Product_ID: 'EQ002', 
      Category_Name: 'AV Equipment', 
      Item_Description: 'Projector Epson PowerLite X41', 
      Unit: 'per unit', 
      Quantity: 2, 
      Unit_Cost: 35000.00, 
      Status: 'Available'
    },
    { 
      Consumable_Product_ID: 'EQ003', 
      Category_Name: 'Office Equipment', 
      Item_Description: 'Scanner Canon CanoScan LiDE 400', 
      Unit: 'per unit', 
      Quantity: 1, 
      Unit_Cost: 8500.00, 
      Status: 'In Use'
    },
    { 
      Consumable_Product_ID: 'EQ004', 
      Category_Name: 'Office Equipment', 
      Item_Description: 'Whiteboard Magnetic 4x8 feet', 
      Unit: 'per unit', 
      Quantity: 5, 
      Unit_Cost: 2500.00, 
      Status: 'Available'
    },
    { 
      Consumable_Product_ID: 'EQ005', 
      Category_Name: 'Kitchen Equipment', 
      Item_Description: 'Coffee Machine DeLonghi Magnifica', 
      Unit: 'per unit', 
      Quantity: 1, 
      Unit_Cost: 12000.00, 
      Status: 'Available'
    },
    { 
      Consumable_Product_ID: 'EQ006', 
      Category_Name: 'Computing Equipment', 
      Item_Description: 'Laptop Dell Latitude 5420', 
      Unit: 'per unit', 
      Quantity: 8, 
      Unit_Cost: 45000.00, 
      Status: 'Available'
    },
    { 
      Consumable_Product_ID: 'EQ007', 
      Category_Name: 'Office Equipment', 
      Item_Description: 'Paper Shredder Fellowes Powershred', 
      Unit: 'per unit', 
      Quantity: 2, 
      Unit_Cost: 6500.00, 
      Status: 'Available'
    },
    { 
      Consumable_Product_ID: 'EQ008', 
      Category_Name: 'AV Equipment', 
      Item_Description: 'Sound System Bose L1 Compact', 
      Unit: 'per set', 
      Quantity: 1, 
      Unit_Cost: 28000.00, 
      Status: 'In Use'
    },
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
    stock.Consumable_Product_ID.toLowerCase().includes(stockSearchTerm.toLowerCase()) ||
    stock.Category_Name.toLowerCase().includes(stockSearchTerm.toLowerCase()) ||
    stock.Item_Description.toLowerCase().includes(stockSearchTerm.toLowerCase()) ||
    stock.Unit.toLowerCase().includes(stockSearchTerm.toLowerCase()) ||
    stock.Status.toLowerCase().includes(stockSearchTerm.toLowerCase())
  );

  // Filter equipment based on equipment search term
  const filteredEquipment = equipmentData.filter(equipment =>
    equipment.Consumable_Product_ID.toLowerCase().includes(equipmentSearchTerm.toLowerCase()) ||
    equipment.Category_Name.toLowerCase().includes(equipmentSearchTerm.toLowerCase()) ||
    equipment.Item_Description.toLowerCase().includes(equipmentSearchTerm.toLowerCase()) ||
    equipment.Unit.toLowerCase().includes(equipmentSearchTerm.toLowerCase()) ||
    equipment.Status.toLowerCase().includes(equipmentSearchTerm.toLowerCase())
  );

  // Calculate totals
  const totalStockQuantity = stocksData.reduce((sum, stock) => sum + stock.Quantity, 0);
  const totalEquipmentQuantity = equipmentData.reduce((sum, equipment) => sum + equipment.Quantity, 0);

  // Search handlers
  const handleStockSearch = (e) => {
    setStockSearchTerm(e.target.value);
  };

  const handleEquipmentSearch = (e) => {
    setEquipmentSearchTerm(e.target.value);
  };

  // Table columns for stocks
  const stockColumns = [
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
      render: (status) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          status === 'Available' ? 'bg-green-100 text-green-800' : 
          status === 'In Use' ? 'bg-blue-100 text-blue-800' : 
          'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      )
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
