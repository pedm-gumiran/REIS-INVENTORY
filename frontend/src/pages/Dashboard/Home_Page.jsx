import React, { useState, useEffect } from 'react';
import Card from '../../components/cards/Card';
import DataTable from '../../components/DataTables/DataTable';
import { useUser } from '../../components/context/UserContext';
import SearchBar from '../../components/Input_Fields/SearchBar';
import axiosInstance from '../../api/axios';

// Add custom styles for waving hand animation
const styles = `
  @keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    10%, 30% { transform: rotate(-20deg); }
    20%, 40% { transform: rotate(20deg); }
    50% { transform: rotate(-10deg); }
    60% { transform: rotate(10deg); }
    70% { transform: rotate(-5deg); }
    80% { transform: rotate(5deg); }
    90% { transform: rotate(0deg); }
  }
  
  .wave-hand {
    display: inline-block;
    animation: wave 2s ease-in-out infinite;
    transform-origin: 70% 70%;
  }
`;

export default function Home_Page() {
  const { user } = useUser();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [stockSearchTerm, setStockSearchTerm] = useState('');
  const [equipmentSearchTerm, setEquipmentSearchTerm] = useState('');
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [stocksData, setStocksData] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    // Inject custom styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [consumablesResponse, nonConsumablesResponse] = await Promise.all([
          axiosInstance.get('/consumables'),
          axiosInstance.get('/non-consumables')
        ]);
        
        // Transform consumable data to match table structure
        const transformedConsumables = consumablesResponse.data.data.map((item, index) => ({
          id: item.product_id || index + 1,
          Consumable_Product_ID: `${String(item.product_id || index + 1).padStart(3, '0')}`,
          Category_Name: item.category || 'Uncategorized',
          Item_Description: item.item_description || 'No description',
          Unit: item.unit || 'per piece',
          Quantity: item.quantity || 0,
          Unit_Cost: parseFloat(item.unit_cost) || 0,
          Status: item.status || ((item.quantity || 0) <= 10 ? 'Low Stock' : 'In Stock')
        }));
        
        // Transform non-consumable data to match table structure
        const transformedNonConsumables = nonConsumablesResponse.data.data.map((item, index) => ({
          id: item.product_id || index + 1,
          Consumable_Product_ID: `${String(item.product_id || index + 1).padStart(3, '0')}`,
          Category_Name: item.category || 'Equipment',
          Item_Description: item.item_description || 'No description',
          Unit: item.unit || 'per unit',
          Quantity: item.quantity || 1,
          Unit_Cost: parseFloat(item.unit_cost) || 0,
          Status: item.status || 'Available'
        }));
        
        setStocksData(transformedConsumables);
        setEquipmentData(transformedNonConsumables);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        // Keep sample data as fallback
        setStocksData([]);
        setEquipmentData([]);
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
  const totalConsumableQuantity = stocksData.reduce((sum, stock) => sum + (stock.Quantity || 0), 0);
  const totalNonConsumableQuantity = equipmentData.reduce((sum, equipment) => sum + (equipment.Quantity || 0), 0);
  const totalStockQuantity = totalConsumableQuantity + totalNonConsumableQuantity;

  // Calculate consumable stock status
  const inStockConsumables = stocksData.filter(stock => stock.Status === 'In Stock').length;
  const outOfStockConsumables = stocksData.filter(stock => stock.Status === 'Low Stock' || stock.Status === 'Out of Stock').length;

  // Calculate non-consumable status
  const availableEquipment = equipmentData.filter(equipment => equipment.Status === 'Available').length;
  const borrowedEquipment = equipmentData.filter(equipment => equipment.Status === 'In Use' || equipment.Status === 'Borrowed').length;

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
              Welcome back, {user?.first_name || 'User'}! <span className="wave-hand">👋</span>
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
              <p className="text-2xl font-bold text-blue-900">{loading ? '...' : stocksData.length}</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-700">In Stock: {inStockConsumables}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-yellow-700">Low Stock: {outOfStockConsumables}</span>
                </div>
              </div>
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
              <p className="text-2xl font-bold text-purple-900">{loading ? '...' : equipmentData.length}</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-700">Available: {availableEquipment}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-yellow-700">Borrowed: {borrowedEquipment}</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Stock Quantity</p>
              <p className="text-2xl font-bold text-green-900">{loading ? '...' : totalStockQuantity}</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-blue-700">Consumables: {totalConsumableQuantity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-xs text-purple-700">Non-Consumables: {totalNonConsumableQuantity}</span>
                </div>
              </div>
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
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
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
            emptyMessage={loading ? "Loading..." : "No consumable products found"}
            loading={loading}
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
            emptyMessage={loading ? "Loading..." : "No non consumable products found"}
            loading={loading}
          />
        </Card>
      </div>
    </div>
  );
}
