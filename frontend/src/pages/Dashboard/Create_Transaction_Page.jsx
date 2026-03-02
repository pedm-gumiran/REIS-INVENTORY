import React, { useState, useEffect, useRef, useMemo } from 'react';
import Card from '../../components/cards/Card';
import { FiPrinter, FiEye, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import RetFormPreview from '../../components/Forms/RetFormPreview';
import Input_Text from '../../components/Input_Fields/Input_Text';
import DocumentRequestModal from '../../components/Forms/Add_Forms/DocumentRequestModal';
import SuppliesEquipmentModal from '../../components/Forms/Add_Forms/SuppliesEquipmentModal';
import EditDocumentModal from '../../components/Forms/Edit_Forms/EditDocumentModal';
import EditSuppliesModal from '../../components/Forms/Edit_Forms/EditSuppliesModal';
import SearchBar from '../../components/Input_Fields/SearchBar';
import DataTable from '../../components/DataTables/DataTable';
import Button from '../../components/Buttons/Button';
import Button_Clear from '../../components/Buttons/Button_Clear';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axios';
export default function Create_Transaction_Page() {
  const [activeTab, setActiveTab] = useState('create');
  const [showPreview, setShowPreview] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  // Create Transaction Form State
  const [transactionType, setTransactionType] = useState('issue');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');

  // New Form State for the updated UI
  const [formData, setFormData] = useState({
    rrfNumber: '',
    requestType: [],
    description: '',
    dateOfActivity: '',
    startTime: '',
    endTime: '',
    purpose: '',
    requestorName: '',
    approvedBy: '',
    servedBy: '',
    receivedBy: ''
  });

  // Return Equipment Form State
  const [returnProduct, setReturnProduct] = useState('');
  const [returnQuantity, setReturnQuantity] = useState('');
  const [returnNotes, setReturnNotes] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returneeName, setReturneeName] = useState('');
  const [inspectedBy, setInspectedBy] = useState('');
  const [itemReturnQuantities, setItemReturnQuantities] = useState({});

  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Client Search and Borrowed Items State
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingBorrowedItems, setLoadingBorrowedItems] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const searchContainerRef = useRef(null);

  // Document Request Modal State
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [requestedDocuments, setRequestedDocuments] = useState([]);

  // Supplies/Equipment Modal State
  const [isSuppliesModalOpen, setIsSuppliesModalOpen] = useState(false);
  const [requestedItems, setRequestedItems] = useState([]);

  // Edit Modals State
  const [isEditDocumentModalOpen, setIsEditDocumentModalOpen] = useState(false);
  const [isEditSuppliesModalOpen, setIsEditSuppliesModalOpen] = useState(false);

  // Saving state
  const [saving, setSaving] = useState(false);

  // Helper function to convert text to uppercase
  const toUpperCase = (str) => {
    return str.toUpperCase();
  };

  // Handle input changes for new form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Apply uppercase to name fields
    const nameFields = ['requestorName', 'approvedBy', 'servedBy', 'receivedBy'];
    const processedValue = nameFields.includes(name) ? toUpperCase(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  // Reset form function
  const resetForm = () => {
    setFormData({
      rrfNumber: '',
      requestType: [],
      description: '',
      dateOfActivity: '',
      startTime: '',
      endTime: '',
      purpose: '',
      requestorName: '',
      approvedBy: '',
      servedBy: '',
      receivedBy: ''
    });
    setRequestedDocuments([]);
    setRequestedItems([]);
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.rrfNumber || !formData.requestorName) {
      toast.error('Please fill in RRF Number and Requestor Name.');
      return;
    }
    
    setSaving(true);
    try {
      // Prepare data for API
      const transactionData = {
        rrfNo: formData.rrfNumber,
        typeOfRequest: formData.requestType.join(', '),
        itemsRequested: formData.description,
        dateOfActivity: formData.dateOfActivity || null,
        startTime: formData.startTime || null,
        endTime: formData.endTime || null,
        purpose: formData.purpose,
        requestedBy: formData.requestorName,
        approvedBy: formData.approvedBy,
        servedBy: formData.servedBy,
        receivedBy: formData.receivedBy
      };
      
      // Send request to backend
      const response = await axiosInstance.post('/audits/transaction-audits', transactionData);
      
      if (response.data.success) {
        toast.success('Transaction created successfully!');
        // Reset form after successful submission
        resetForm();
      } else {
        toast.error(response.data.message || 'Failed to create transaction');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error(error.response?.data?.message || 'Failed to create transaction. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Document Modal Handlers
  const handleOpenDocumentModal = () => {
    setRequestedDocuments([]); // Clear to ensure fresh state
    setIsDocumentModalOpen(true);
  };

  const handleCloseDocumentModal = () => {
    setIsDocumentModalOpen(false);
  };

  const handleSaveDocuments = (documents) => {
    setRequestedDocuments(documents);
    // Append documents to existing description
    const documentDetails = documents.map(doc => doc.name).join(', ');
    const currentDescription = formData.description || '';
    
    setFormData(prev => ({
      ...prev,
      description: currentDescription 
        ? `${currentDescription}, ${documentDetails}` 
        : documentDetails
    }));
  };

  // Supplies/Equipment Modal Handlers
  const handleOpenSuppliesModal = () => {
    setIsSuppliesModalOpen(true);
    setRequestedItems([]);
  };

  const handleCloseSuppliesModal = () => {
    setIsSuppliesModalOpen(false);
  };

  const handleSaveItems = (items) => {
    setRequestedItems(items);
    // Append items to existing description
    const itemDetails = items.map(item => 
      `${item.name} (Qty: ${item.quantity} ${item.unit})`
    ).join(', ');
    const currentDescription = formData.description || '';
    
    setFormData(prev => ({
      ...prev,
      description: currentDescription 
        ? `${currentDescription}, ${itemDetails}` 
        : itemDetails
    }));
  };

  // Edit Document Modal Handlers
  const handleOpenEditDocumentModal = () => {
    setIsEditDocumentModalOpen(true);
  };

  const handleCloseEditDocumentModal = () => {
    setIsEditDocumentModalOpen(false);
  };

  const handleUpdateDocuments = (documents) => {
    setRequestedDocuments(documents);
    // Update description with new documents
    const documentDetails = documents.map(doc => doc.name).join(', ');
    const currentDescription = formData.description || '';
    
    // Remove existing document details from description
    const existingDocDetails = requestedDocuments.map(doc => doc.name).join(', ');
    let newDescription = currentDescription;
    
    if (existingDocDetails) {
      const regex = new RegExp(`,?\\s*${existingDocDetails.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*,?`, 'g');
      newDescription = newDescription.replace(regex, '');
      newDescription = newDescription.replace(/^,\s*/, '').replace(/,\s*$/, '').replace(/,\s*,/g, ',').trim();
    }
    
    // Add new document details
    setFormData(prev => ({
      ...prev,
      description: newDescription 
        ? `${newDescription}, ${documentDetails}` 
        : documentDetails
    }));
  };

  // Edit Supplies Modal Handlers
  const handleOpenEditSuppliesModal = () => {
    setIsEditSuppliesModalOpen(true);
  };

  const handleCloseEditSuppliesModal = () => {
    setIsEditSuppliesModalOpen(false);
  };

  const handleUpdateItems = (items) => {
    setRequestedItems(items);
    
    // Rebuild the entire description from scratch to ensure proper override
    let newDescription = '';
    
    // Add documents if any exist
    if (requestedDocuments.length > 0) {
      const documentDetails = requestedDocuments.map(doc => doc.name).join(', ');
      newDescription = documentDetails;
    }
    
    // Add new supplies items
    if (items.length > 0) {
      const itemDetails = items.map(item => 
        `${item.name} (Qty: ${item.quantity} ${item.unit})`
      ).join(', ');
      
      if (newDescription) {
        newDescription += `, ${itemDetails}`;
      } else {
        newDescription = itemDetails;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      description: newDescription
    }));
  };

  // Handle clearing data when modal is closed/cancelled
  const handleClearData = (type) => {
    // Remove the specific checkbox from requestType
    const newRequestType = formData.requestType.filter(requestType => requestType !== type);
    
    setFormData(prev => ({
      ...prev,
      requestType: newRequestType
    }));
    
    // Clear specific data based on type
    if (type === 'document') {
      setRequestedDocuments([]);
      // Remove documents from description
      const currentDescription = formData.description || '';
      const documentNames = requestedDocuments.map(doc => doc.name);
      let newDescription = currentDescription;
      
      documentNames.forEach(docName => {
        const regex = new RegExp(`,?\\s*${docName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*,?`, 'g');
        newDescription = newDescription.replace(regex, '');
      });
      
      // Clean up extra commas and spaces
      newDescription = newDescription.replace(/^,\s*/, '').replace(/,\s*$/, '').replace(/,\s*,/g, ',').trim();
      
      setFormData(prev => ({
        ...prev,
        description: newDescription
      }));
    } else if (type === 'supplies') {
      setRequestedItems([]);
      // Remove supplies from description
      const currentDescription = formData.description || '';
      const itemPatterns = requestedItems.map(item => 
        `${item.name.replace(/[.*+?^${}()[\]\\]/g, '\\$&')}\\s*\\(Qty:\\s*\\d+\\)`
      );
      let newDescription = currentDescription;
      
      itemPatterns.forEach(pattern => {
        const regex = new RegExp(`,?\\s*${pattern}\\s*,?`, 'g');
        newDescription = newDescription.replace(regex, '');
      });
      
      // Clean up extra commas and spaces
      newDescription = newDescription.replace(/^,\s*/, '').replace(/,\s*$/, '').replace(/,\s*,/g, ',').trim();
      
      setFormData(prev => ({
        ...prev,
        description: newDescription
      }));
    }
  };

  const handleReturnEquipment = (e) => {
    e.preventDefault();
    // Handle return submission
    console.log('Equipment returned:', {
      returnProduct,
      returnQuantity,
      returnCondition,
      returnNotes,
      returnDate,
      returneeName,
      inspectedBy
    });
    // Reset form
    setReturnProduct('');
    setReturnQuantity('');
    setReturnCondition('');
    setReturnNotes('');
    setReturnDate('');
    setReturneeName('');
    setInspectedBy('');
  };

  // Client Search Handlers
  const handleClientSearch = async (query) => {
    setClientSearchQuery(query);
    
    // Don't search if a client is already selected and the query matches the selected client's name
    if (selectedClient && query.trim() === selectedClient.name) {
      setSearchResults([]);
      setShowClientDropdown(false);
      return;
    }
    
    if (query.length < 2) {
      setSearchResults([]);
      setShowClientDropdown(false);
      // Only clear client state if query is empty or very short
      if (!query || query.length < 2) {
        setSelectedClient(null);
        setBorrowedItems([]);
        setSelectedItems([]);
        setShowReturnForm(false);
      }
      return;
    }

    setLoadingClients(true);
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock client data - replace with actual API response
      const mockClients = [
        { id: 1, name: 'John Doe', email: 'john@example.com', department: 'IT' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'HR' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', department: 'Finance' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', department: 'Marketing' },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', department: 'Operations' },
      ];
      
      const filteredClients = mockClients.filter(client => 
        client.name.toLowerCase().includes(query.toLowerCase().trim())
      );
      
      setSearchResults(filteredClients);
      setShowClientDropdown(filteredClients.length > 0);
    } catch (error) {
      console.error('Error searching for client:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  // Handle Client Selection
  const handleClientSelect = async (client) => {
    setSelectedClient(client);
    setSearchResults([]);
    setShowClientDropdown(false);
    setClientSearchQuery(client.name);
    await loadBorrowedItems(client.id);
  };

  // Handle search bar clear
  const handleSearchClear = () => {
    setClientSearchQuery('');
    setSearchResults([]);
    setShowClientDropdown(false);
    setSelectedClient(null);
    setBorrowedItems([]);
    setSelectedItems([]);
    setShowReturnForm(false);
  };

  // Handle input focus to show dropdown when editing
  const handleSearchFocus = () => {
    // If there's a selected client and user focuses on input, don't show dropdown
    if (selectedClient && clientSearchQuery.trim() === selectedClient.name) {
      setShowClientDropdown(false);
      return;
    }
    
    // Show dropdown if there's a search query with results
    if (clientSearchQuery.trim().length >= 2 && searchResults.length > 0) {
      setShowClientDropdown(true);
    }
  };

  // Load Borrowed Items for Selected Client
  const loadBorrowedItems = async (clientId) => {
    setLoadingBorrowedItems(true);
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock borrowed items data - replace with actual API response
      const allItems = [
        {
          id: 1,
          product_name: 'Laptop Dell XPS 15',
          consumable_product_id: 'LAP-001',
          quantity: 1,
          borrowDate: '2024-01-15',
          dueDate: '2024-01-30',
          status: 'borrowed',
        
        },
        {
          id: 2,
          product_name: 'Projector Epson EB-X41',
          consumable_product_id: 'PROJ-002',
          quantity: 1,
          borrowDate: '2024-01-20',
          dueDate: '2024-02-03',
          status: 'borrowed',
         
        },
        {
          id: 3,
          product_name: 'Office Chair Ergonomic',
          consumable_product_id: 'CHR-003',
          quantity: 2,
          borrowDate: '2024-01-10',
          dueDate: '2024-01-24',
          status: 'borrowed',
          
        },
        {
          id: 4,
          product_name: 'Available Item - Not Borrowed',
          consumable_product_id: 'AVAIL-001',
          quantity: 5,
          borrowDate: '2024-01-01',
          dueDate: '2024-02-15',
          status: 'borrowed',
          
        }
      ];
      
      // Only show items that are actually borrowed (status is 'borrowed')
      const borrowedItems = allItems.filter(item => 
        item.status === 'borrowed'
      );
      
      setBorrowedItems(borrowedItems);
    } catch (error) {
      console.error('Error loading borrowed items:', error);
    } finally {
      setLoadingBorrowedItems(false);
    }
  };

  // Handle Item Selection
  const handleItemSelection = (itemIds) => {
    setSelectedItems(itemIds);
    setShowReturnForm(itemIds.length > 0);
    setShowReturnModal(itemIds.length > 0);
    
    // Initialize return quantities for newly selected items
    const newQuantities = { ...itemReturnQuantities };
    borrowedItems.forEach(item => {
      if (itemIds.includes(item.id) && !newQuantities[item.id]) {
        newQuantities[item.id] = item.quantity.toString(); // Default to full quantity
      }
    });
    setItemReturnQuantities(newQuantities);
  };

  // Handle Select All functionality
  const handleSelectAll = (selectedIds) => {
    setSelectedItems(selectedIds);
    setShowReturnForm(selectedIds.length > 0);
    setShowReturnModal(selectedIds.length > 0);
    
    // Initialize return quantities for all selected items
    const newQuantities = {};
    borrowedItems.forEach(item => {
      if (selectedIds.includes(item.id)) {
        newQuantities[item.id] = item.quantity.toString(); // Default to full quantity
      }
    });
    setItemReturnQuantities(newQuantities);
  };

  // Handle return quantity change for individual items
  const handleReturnQuantityChange = (itemId, value) => {
    setItemReturnQuantities(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  // Handle Return Form Submission
  const handleReturnFormSubmit = (e) => {
    e.preventDefault();
    
    const returnData = {
      client: selectedClient,
      selectedItems: borrowedItems.filter(item => selectedItems.includes(item.id)).map(item => ({
        ...item,
        returnQuantity: parseInt(itemReturnQuantities[item.id]) || 0
      })),
      returnDate,
      returnNotes,
      returneeName,
      inspectedBy
    };
    
    console.log('Processing equipment return:', returnData);
    
    // Reset form after submission
    resetReturnForm();
  };

  // Reset Return Form
  const resetReturnForm = () => {
    setClientSearchQuery('');
    setSelectedClient(null);
    setSearchResults([]);
    setShowClientDropdown(false);
    setBorrowedItems([]);
    setSelectedItems([]);
    setShowReturnForm(false);
    setShowReturnModal(false);
    setReturnDate('');
    setReturnNotes('');
    setReturneeName('');
    setInspectedBy('');
    setItemReturnQuantities({});
  };

  // Memoize initialItems to prevent unnecessary re-renders
  const memoizedInitialItems = useMemo(() => requestedItems, [requestedItems]);

  // Memoize initialDocuments to prevent unnecessary re-renders  
  const memoizedInitialDocuments = useMemo(() => requestedDocuments, [requestedDocuments]);

  // Form validation for save button - enabled when required fields are filled
  const isFormValid = formData.rrfNumber && formData.requestorName && formData.purpose && formData.approvedBy && formData.servedBy;

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowClientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll lock when modals are open
  useEffect(() => {
    if (isDocumentModalOpen || isSuppliesModalOpen || showPreview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Clean up when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDocumentModalOpen, isSuppliesModalOpen, showPreview]);

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
            <h1 className="text-3xl font-bold mb-2">Transaction Management</h1>
            <p className="text-green-100">
              Create transactions and manage equipment returns efficiently.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold">{formatTime(currentDateTime)}</div>
            <div className="text-green-100">{formatDate(currentDateTime)}</div>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'create'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Transaction
            </button>
            <button
              onClick={() => setActiveTab('return')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'return'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Return Equipment
            </button>
          </nav>
        </div>
      </Card>

      {/* Tab Content */}
      {activeTab === 'create' && (
        <div className="bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-white flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold">RET REQUEST FORM</h3>
              <p className="text-green-100 text-sm mt-1">Research, Extension, and Training Department</p>
            </div>
            <div className=" px-4 py-2 rounded-lg">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-green-200">RRF Number</label>
              <Input_Text
                type="text" 
                name="rrfNumber"
                value={formData.rrfNumber }
                onChange={handleInputChange}
                className="text-lg font-mono font-bold bg-transparent border-none focus:ring-0 text-white w-full outline-none"
                placeholder="Enter RRF number "
              />
            </div>
          </div>

          <form onSubmit={handleCreateTransaction} className="p-8 space-y-8">
            {/* Type of Request */}
            <section>
              <div className="flex items-center space-x-2 mb-6">
             
                <h4 className="text-lg font-bold text-slate-800">Type of Request</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[/* eslint-disable-next-line */
                  { value: 'document', label: 'Document'},
                  { value: 'supplies', label: 'Supplies/materials/Equipments',  },
                  { value: 'conference', label: 'Use of RET Conference Room' }
                ].map((type) => (
                  <label 
                    key={type.value}
                    className={`relative flex cursor-pointer rounded-xl border-2 p-4 shadow-md transition-all ${
                      formData.requestType.includes(type.value)
                        ? 'border-green-500 bg-green-50 focus-within:ring-2 focus-within:ring-green-300'
                        : 'border-gray-300 bg-white hover:bg-gray-50 focus-within:ring-1 focus-within:ring-gray-300'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      name="requestType" 
                      value={type.value}
                      checked={formData.requestType.includes(type.value)}
                      onChange={(e) => {
                        const { checked, value } = e.target;
                        const newRequestType = checked 
                          ? [...formData.requestType, value]
                          : formData.requestType.filter(type => type !== value);
                        
                        setFormData(prev => ({
                          ...prev,
                          requestType: newRequestType
                        }));
                        
                        // Check if all checkboxes are unchecked, then reset entire form
                        if (newRequestType.length === 0) {
                          resetForm();
                          return;
                        }
                        
                        // Handle modal opening and data clearing
                        if (value === 'document') {
                          if (checked) {
                            // Only clear existing document data if there are documents and user is re-checking
                            if (requestedDocuments.length > 0) {
                              const documentsToRemove = [...requestedDocuments];
                              setRequestedDocuments([]);
                              
                              // Remove existing documents from description
                              const currentDescription = formData.description || '';
                              const documentNames = documentsToRemove.map(doc => doc.name);
                              let newDescription = currentDescription;
                              
                              documentNames.forEach(docName => {
                                const regex = new RegExp(`,?\\s*${docName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*,?`, 'g');
                                newDescription = newDescription.replace(regex, '');
                              });
                              
                              // Clean up extra commas and spaces
                              newDescription = newDescription.replace(/^,\s*/, '').replace(/,\s*$/, '').replace(/,\s*,/g, ',').trim();
                              
                              setFormData(prev => ({
                                ...prev,
                                description: newDescription
                              }));
                            }
                            
                            handleOpenDocumentModal();
                          } else {
                            // Clear document data only when unchecking
                            const documentsToRemove = [...requestedDocuments];
                            setRequestedDocuments([]);
                            
                            // Remove documents from description
                            const currentDescription = formData.description || '';
                            const documentNames = documentsToRemove.map(doc => doc.name);
                            let newDescription = currentDescription;
                            
                            documentNames.forEach(docName => {
                              const regex = new RegExp(`,?\\s*${docName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*,?`, 'g');
                              newDescription = newDescription.replace(regex, '');
                            });
                            
                            // Clean up extra commas and spaces
                            newDescription = newDescription.replace(/^,\s*/, '').replace(/,\s*$/, '').replace(/,\s*,/g, ',').trim();
                            
                            setFormData(prev => ({
                              ...prev,
                              description: newDescription
                            }));
                          }
                        } else if (value === 'supplies') {
                          if (checked) {
                            // Only clear existing supplies data if there are items and user is re-checking
                            if (requestedItems.length > 0) {
                              const itemsToRemove = [...requestedItems];
                              setRequestedItems([]);
                              
                              // Remove existing supplies from description
                              const currentDescription = formData.description || '';
                              const itemPatterns = itemsToRemove.map(item => 
                                `${item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\(Qty:\\s*\\d+\\)`
                              );
                              let newDescription = currentDescription;
                              
                              itemPatterns.forEach(pattern => {
                                const regex = new RegExp(`,?\\s*${pattern}\\s*,?`, 'g');
                                newDescription = newDescription.replace(regex, '');
                              });
                              
                              // Clean up extra commas and spaces
                              newDescription = newDescription.replace(/^,\s*/, '').replace(/,\s*$/, '').replace(/,\s*,/g, ',').trim();
                              
                              setFormData(prev => ({
                                ...prev,
                                description: newDescription
                              }));
                            }
                            
                            handleOpenSuppliesModal();
                          } else {
                            // Clear supplies data using the centralized handleClearData function
                            handleClearData('supplies');
                          }
                        } else if (value === 'conference') {
                          if (!checked) {
                            // Clear conference room related fields when unchecked
                            setFormData(prev => ({
                              ...prev,
                              dateOfActivity: '',
                              startTime: '',
                              endTime: ''
                            }));
                          }
                        }
                      }}
                      className={`w-5 h-5 border-2 rounded focus:ring-green-500 focus:ring-2 ${
                      formData.requestType.includes(type.value)
                        ? 'text-green-600 bg-gradient-to-r from-green-400 to-green-600 border-transparent'
                        : 'text-gray-600 border-gray-400'
                    }`}
                    />
                    <div className="flex flex-col gap-1 ml-3">
                      <span className={`text-sm font-bold ${
                        formData.requestType.includes(type.value) ? 'text-green-800' : 'text-gray-800'
                      }`}>{type.label}</span>
                      <span className={`text-xs ${
                        formData.requestType.includes(type.value) ? 'text-green-600' : 'text-gray-500'
                      }`}>{type.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {/* Request Details and Scheduling Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Request Details */}
              <div className="space-y-6">
              
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Document/Supplies/Materials/Equipment Requested:</label>
                  <div className="space-y-3">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled
                      className="w-full rounded-xl border-2 border-slate-300 focus:border-green-700 focus:ring-green-700 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Use the checkboxes above to add items..."
                      rows="4"
                    />
                    {formData.requestType.includes('document') && (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-sm text-green-700 font-medium">
                          {requestedDocuments.length > 0 
                            ? `${requestedDocuments.length} document(s) specified` 
                            : 'Click "Document" checkbox to specify documents'
                          }
                        </div>
                        {requestedDocuments.length > 0 && (
                          <button
                            type="button"
                            onClick={handleOpenEditDocumentModal}
                            className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            Edit Documents
                          </button>
                        )}
                      </div>
                    )}
                    {formData.requestType.includes('supplies') && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm text-blue-700 font-medium">
                          {requestedItems.length > 0 
                            ? `${requestedItems.length} item(s) specified` 
                            : 'Click "Supplies/Materials/Equipment" checkbox to specify items'
                          }
                        </div>
                        {requestedItems.length > 0 && (
                          <button
                            type="button"
                            onClick={handleOpenEditSuppliesModal}
                            className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Edit Items
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Scheduling */}
              <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
          
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Activity</label>
                    <input 
                      type="date" 
                      name="dateOfActivity"
                      value={formData.dateOfActivity}
                      onChange={handleInputChange}
                      disabled={!formData.requestType.includes('conference')}
                      className="w-full rounded-lg border-2 border-slate-300 focus:border-green-700 focus:ring-green-700 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                      <input 
                        type="time" 
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        disabled={!formData.requestType.includes('conference')}
                        className="w-full rounded-lg border-2 border-slate-300 focus:border-green-700 focus:ring-green-700 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                      <input 
                        type="time" 
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        disabled={!formData.requestType.includes('conference')}
                        className="w-full rounded-lg border-2 border-slate-300 focus:border-green-700 focus:ring-green-700 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purpose */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h4 className="text-lg font-bold text-slate-800">Purpose</h4>
              </div>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full rounded-xl border-2 border-slate-300 focus:border-green-700 focus:ring-green-700 transition-all outline-none"
                placeholder="Please state specific purpose of this request..."
                rows="3"
              />
              <div className="flex items-start bg-blue-50 p-4 rounded-xl border border-blue-100">
                <span className="text-blue-600 mr-3 mt-0.5">✓</span>
                <p className="text-sm text-blue-800">
                  <strong>Certification:</strong> I hereby certify that request will be used exclusively for the above stated purpose.
                </p>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Signatures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Requested By</label>
                <div className="border-b-2 border-slate-300 pb-2">
                  <input 
                    type="text" 
                    name="requestorName"
                    value={formData.requestorName}
                    onChange={handleInputChange}
                    placeholder="Full Name of Requestor"
                    className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium text-center outline-none"
                  />
                </div>
                <p className="text-[10px] text-center text-slate-400 font-medium">Signature over Printed Name</p>
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Approved By</label>
                <div className="border-b-2 border-slate-300 pb-2">
                  <input 
                    type="text" 
                    name="approvedBy"
                    value={formData.approvedBy || ''}
                    onChange={handleInputChange}
                    placeholder="Full Name of Approving Staff"
                    className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium text-center outline-none"
                  />
                </div>
                <p className="text-[10px] text-center text-slate-400 font-medium">Signature over Printed Name</p>
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Served By</label>
                <div className="border-b-2 border-slate-300 pb-2">
                  <input 
                    type="text" 
                    name="servedBy"
                    value={formData.servedBy || ''}
                    onChange={handleInputChange}
                    placeholder="Assigned Staff Name"
                    className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium text-center outline-none"
                  />
                </div>
                <p className="text-[10px] text-center text-slate-400 font-medium">Name/Signature of RET Staff</p>
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Received By (if document)</label>
                <div className="border-b-2 border-slate-300 pb-2">
                  <input 
                    type="text" 
                    name="receivedBy"
                    value={formData.receivedBy || ''}
                    onChange={handleInputChange}
                    placeholder="Recipient Name"
                    className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium text-center disabled:text-gray-400 disabled:cursor-not-allowed outline-none"
                    disabled={!formData.requestType.includes('document')}
                  />
                </div>
                <p className="text-[10px] text-center text-slate-400 font-medium">Signature over Printed Name</p>
              </div>
            </div>

            {/* Submit Section */}
            <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center text-amber-600 bg-amber-50 px-4 py-2 rounded-full text-sm font-medium border border-amber-200">
                <span className="mr-2">⚠️</span>
                Note: For RET Conference Room users please always practice CLAYGO (Clean As You Go).
              </div>
              <div className="flex space-x-3 w-full md:w-auto overflow-x-auto">
                <button
                onClick={() => setShowPreview(true)}
                  type="button"
                  className="flex-1 md:flex-initial px-6 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-all flex items-center justify-center space-x-2 border-2 border-green-700"
                >
                  <FiEye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 md:flex-initial px-6 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-all flex items-center justify-center space-x-2 border-2 border-green-700"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>Clear Form</span>
                </button>
                <button
                  type="submit"
                  disabled={saving || !isFormValid}
                  className="flex-1 md:flex-initial bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-10 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSave className="w-5 h-5" />
                  <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {showPreview && (
        <RetFormPreview 
          formData={formData} 
          onClose={() => setShowPreview(false)}
        />
      )}

      {activeTab === 'return' && (
        <div className="space-y-6">
          <Card>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-xl">
              <h3 className="text-2xl font-bold">Return Equipment</h3>
              <p className="text-green-100 text-sm mt-1">Search for clients and process equipment returns</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Client Search Section */}
              <div className="relative" ref={searchContainerRef}>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Search Client Name
                </label>
                <SearchBar
                  value={clientSearchQuery}
                  onChange={(e) => handleClientSearch(e.target.value)}
                  onFocus={handleSearchFocus}
                  onClear={handleSearchClear}
                  placeholder="Type client name to search..."
                  width="w-full"
                  disabled={loadingClients}
                />
                
                {/* Client Dropdown Results */}
                {showClientDropdown && searchResults.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((client) => (
                      <div
                        key={client.id}
                        onClick={() => handleClientSelect(client)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.email} • {client.department}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* No Results Message */}
                {clientSearchQuery.length >= 2 && !loadingClients && searchResults.length === 0 && !selectedClient && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      No clients found matching "{clientSearchQuery}"
                    </div>
                  </div>
                )}
                
                {/* Selected Client Info */}
                {selectedClient && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Selected Client:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Name:</span>
                        <p className="text-gray-900">{selectedClient.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Email:</span>
                        <p className="text-gray-900">{selectedClient.email}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Department:</span>
                        <p className="text-gray-900">{selectedClient.department}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Borrowed Items DataTable */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Borrowed Items</h4>
                <DataTable
                  columns={[
                    { key: 'consumable_product_id', label: 'Product ID', className: 'text-center' },
                    { key: 'product_name', label: 'Product Name' },
                    { key: 'quantity', label: 'Quantity', className: 'text-center' },
                    { key: 'borrowDate', label: 'Borrow Date', className: 'text-center' },
                    { 
                      key: 'status', 
                      label: 'Status', 
                      className: 'text-center',
                      render: (status) => (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Borrowed
                        </span>
                      )
                    },
                  
                  ]}
                  data={borrowedItems}
                  selectable={true}
                  selected={selectedItems}
                  onSelect={handleItemSelection}
                  onSelectAll={handleSelectAll}
                  keyField="id"
                  loading={loadingBorrowedItems}
                  emptyMessage={selectedClient ? "No borrowed items found for this client" : "Please select a client to view borrowed items"}
                  showCheckboxes={true}
                />
              </div>

                          </div>
          </Card>

                  </div>
      )}

      {/* Document Request Modal */}
      <DocumentRequestModal
        isOpen={isDocumentModalOpen}
        onClose={handleCloseDocumentModal}
        onSave={handleSaveDocuments}
        onClearData={handleClearData}
        initialDocuments={memoizedInitialDocuments}
        title="Specify Documents to Request"
      />

      {/* Supplies/Equipment Modal */}
      <SuppliesEquipmentModal
        isOpen={isSuppliesModalOpen}
        onClose={handleCloseSuppliesModal}
        onSave={handleSaveItems}
        onClearData={handleClearData}
        initialItems={memoizedInitialItems}
        title="Specify Supplies/Materials/Equipment"
      />

      {/* Edit Document Modal */}
      <EditDocumentModal
        isOpen={isEditDocumentModalOpen}
        onClose={handleCloseEditDocumentModal}
        onSave={handleUpdateDocuments}
        existingDocuments={requestedDocuments}
        title="Edit Documents"
      />

      {/* Edit Supplies Modal */}
      <EditSuppliesModal
        isOpen={isEditSuppliesModalOpen}
        onClose={handleCloseEditSuppliesModal}
        onSave={handleUpdateItems}
        existingItems={requestedItems}
        title="Edit Supplies/Materials/Equipment"
      />

      {/* Return Equipment Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className={`bg-white rounded-lg shadow-xl w-full overflow-hidden transition-all duration-300 ${
            selectedItems.length > 5 ? 'max-w-6xl' : 
            selectedItems.length > 3 ? 'max-w-5xl' : 
            selectedItems.length > 1 ? 'max-w-4xl' : 'max-w-3xl'
          } max-h-[90vh]`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Return Equipment</h2>
                <p className="text-blue-100 text-sm mt-1">Fill in the return information for selected items</p>
              </div>
              <button
                onClick={() => setShowReturnModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleReturnFormSubmit} className="p-6 space-y-6 h-full flex flex-col">
              <div className="flex-1 overflow-hidden flex flex-col">
                {/* Selected Items with Return Quantities */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Selected Items ({selectedItems.length})</h4>
                  <div className={`space-y-3 overflow-y-auto ${
                    selectedItems.length > 8 ? 'max-h-40' : 
                    selectedItems.length > 5 ? 'max-h-48' : 
                    selectedItems.length > 3 ? 'max-h-56' : 'max-h-64'
                  }`}>
                    {borrowedItems
                      .filter(item => selectedItems.includes(item.id))
                      .map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 truncate">{item.product_name}</div>
                            <div className="text-sm text-gray-600">{item.consumable_product_id}</div>
                            <div className="text-xs text-gray-500">Borrowed: {item.quantity}</div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Return Qty:</label>
                            <input
                              type="number"
                              min="0"
                              max={item.quantity}
                              value={itemReturnQuantities[item.id] || ''}
                              onChange={(e) => handleReturnQuantityChange(item.id, e.target.value)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center flex-shrink-0"
                              required
                            />
                            <span className="text-sm text-gray-600 whitespace-nowrap">/ {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                {/* Form Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-auto">
                  {/* Returnee Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Returnee Name
                    </label>
                    <input
                      type="text"
                      value={returneeName}
                      onChange={(e) => setReturneeName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter name of person returning equipment"
                      required
                    />
                  </div>

                  {/* Return Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  {/* Return Notes */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return Notes
                    </label>
                    <textarea
                      value={returnNotes}
                      onChange={(e) => setReturnNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      rows="3"
                      placeholder="Enter any damage notes or observations..."
                    />
                  </div>

                  {/* Inspected By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inspected By
                    </label>
                    <input
                      type="text"
                      value={inspectedBy}
                      onChange={(e) => setInspectedBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Enter name of inspector"
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 justify-end mt-auto">
                  <Button_Clear
                    onClick={resetReturnForm}
                    label="Clear Form"
                  />
                  <Button
                    label="Save"
                    icon={<FiSave />}
                    variant="primary"
                    size="lg"
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    
    </div>
  );
}
