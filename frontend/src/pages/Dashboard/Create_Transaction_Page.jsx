import React, { useState } from 'react';
import Card from '../../components/cards/Card';
import { FiPrinter, FiEye, FiTrash2 } from 'react-icons/fi';
import RetFormPreview from '../../components/Forms/RetFormPreview';
import Input_Text from '../../components/Input_Fields/Input_Text';
export default function Create_Transaction_Page() {
  const [activeTab, setActiveTab] = useState('create');
  const [showPreview, setShowPreview] = useState(false);
  
  // Create Transaction Form State
  const [transactionType, setTransactionType] = useState('issue');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');

  // New Form State for the updated UI
  const [formData, setFormData] = useState({
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
  const [returnCondition, setReturnCondition] = useState('');
  const [returnNotes, setReturnNotes] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // Handle input changes for new form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateTransaction = (e) => {
    e.preventDefault();
    // Handle transaction submission with new form structure
    console.log('Transaction submitted:', formData);
    
    // Reset form
    setFormData({
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
  };

  const handleReturnEquipment = (e) => {
    e.preventDefault();
    // Handle return submission
    console.log('Equipment returned:', {
      returnProduct,
      returnQuantity,
      returnCondition,
      returnNotes,
      returnDate
    });
    // Reset form
    setReturnProduct('');
    setReturnQuantity('');
    setReturnCondition('');
    setReturnNotes('');
    setReturnDate('');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div>
          <h1 className="text-3xl font-bold mb-2">Transaction Management</h1>
          <p className="text-green-100">
            Create transactions and manage equipment returns efficiently.
          </p>
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
          <div className="bg-green-700 px-8 py-6 text-white flex flex-col md:flex-row justify-between items-center gap-4">
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
                className="text-lg font-mono font-bold bg-transparent border-none focus:ring-0 text-white w-full"
                placeholder="Enter RRF number "
              />
            </div>
          </div>

          <form onSubmit={handleCreateTransaction} className="p-8 space-y-8">
            {/* Type of Request */}
            <section>
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-green-700">📋</span>
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
                        setFormData(prev => ({
                          ...prev,
                          requestType: checked 
                            ? [...prev.requestType, value]
                            : prev.requestType.filter(type => type !== value)
                        }));
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
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border-2 border-slate-300 focus:border-green-700 focus:ring-green-700 transition-all"
                    placeholder="List documents, supplies, materials or equipment requested..."
                    rows="4"
                  />
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
                      className="w-full rounded-lg border-2 border-slate-300 focus:border-green-700 focus:ring-green-700 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        className="w-full rounded-lg border-2 border-slate-300 focus:border-green-700 focus:ring-green-700 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        className="w-full rounded-lg border-2 border-slate-300 focus:border-green-700 focus:ring-green-700 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                className="w-full rounded-xl border-2 border-slate-300 focus:border-green-700 focus:ring-green-700 transition-all"
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
                    className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium"
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
                    className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium"
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
                    className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium"
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
                    className="w-full bg-transparent border-none focus:ring-0 text-lg font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
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
                  <FiPrinter className="w-4 h-4" />
                  <span>Print</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
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
                  }}
                  className="flex-1 md:flex-initial px-6 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-all flex items-center justify-center space-x-2 border-2 border-green-700"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>Clear Form</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 md:flex-initial bg-green-700 hover:bg-green-800 text-white font-bold px-10 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>➤</span>
                  <span>Submit Request</span>
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
        <Card title="Return Equipment">
          <form onSubmit={handleReturnEquipment} className="space-y-6">
            {/* Equipment Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment to Return
              </label>
              <select
                value={returnProduct}
                onChange={(e) => setReturnProduct(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Select equipment...</option>
                <option value="laptop-001">Laptop Dell XPS - LPT001</option>
                <option value="projector-001">Projector Epson - PRJ001</option>
                <option value="chair-001">Office Chair - CHR001</option>
                <option value="monitor-001">Monitor Dell 24" - MON001</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Return Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={returnQuantity}
                  onChange={(e) => setReturnQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter quantity"
                  min="1"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Equipment Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment Condition
              </label>
              <select
                value={returnCondition}
                onChange={(e) => setReturnCondition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Select condition...</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>

            {/* Return Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Notes
              </label>
              <textarea
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="3"
                placeholder="Enter any damage notes or observations..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Process Return
              </button>
              <button
                type="button"
                onClick={() => {
                  setReturnProduct('');
                  setReturnQuantity('');
                  setReturnCondition('');
                  setReturnNotes('');
                  setReturnDate('');
                }}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Clear Form
              </button>
            </div>
          </form>
        </Card>
      )}

     
      {/* Footer */}
      <footer className="mt-12 text-center text-slate-400 text-sm">
        <p>© 2024 Nueva Vizcaya State University. All rights reserved.</p>
        <p className="mt-1 font-mono text-xs">Internal Document NVSU-FR-RET-20-00 (080723)</p>
      </footer>
    </div>
  );
}
