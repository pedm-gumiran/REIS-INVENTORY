import React, { useState } from 'react';
import Card from '../../components/cards/Card';

export default function Create_Transaction_Page() {
  const [transactionType, setTransactionType] = useState('issue');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle transaction submission
    console.log('Transaction submitted:', {
      transactionType,
      selectedProduct,
      quantity,
      recipient,
      purpose,
      notes
    });
    // Reset form
    setTransactionType('issue');
    setSelectedProduct('');
    setQuantity('');
    setRecipient('');
    setPurpose('');
    setNotes('');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create Transaction</h1>
          <p className="text-green-100">
            Record inventory transactions for issue, return, or transfer of items.
          </p>
        </div>
      </Card>

      {/* Transaction Form */}
      <Card title="Transaction Details">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="issue"
                  checked={transactionType === 'issue'}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="mr-2"
                />
                <span>Issue</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="return"
                  checked={transactionType === 'return'}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="mr-2"
                />
                <span>Return</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="transfer"
                  checked={transactionType === 'transfer'}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="mr-2"
                />
                <span>Transfer</span>
              </label>
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product/Item
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select a product...</option>
              <option value="paper-a4">Office Paper A4</option>
              <option value="pens">Ballpoint Pens</option>
              <option value="laptop">Laptop Dell XPS</option>
              <option value="chair">Office Chair</option>
              <option value="projector">Projector Epson</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>

            {/* Recipient */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {transactionType === 'return' ? 'Returned By' : 'Recipient'}
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter name/department"
                required
              />
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter purpose of transaction"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="3"
              placeholder="Enter any additional notes..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Transaction
            </button>
            <button
              type="button"
              onClick={() => {
                setTransactionType('issue');
                setSelectedProduct('');
                setQuantity('');
                setRecipient('');
                setPurpose('');
                setNotes('');
              }}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Clear Form
            </button>
          </div>
        </form>
      </Card>

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        <div className="space-y-3">
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Office Paper A4 - Issue</p>
                <p className="text-sm text-gray-600">To: IT Department | Qty: 5 Reams</p>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Laptop Dell XPS - Return</p>
                <p className="text-sm text-gray-600">From: John Doe | Qty: 1 Unit</p>
              </div>
              <span className="text-xs text-gray-500">5 hours ago</span>
            </div>
          </div>
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Ballpoint Pens - Transfer</p>
                <p className="text-sm text-gray-600">From: Admin to HR | Qty: 2 Boxes</p>
              </div>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
