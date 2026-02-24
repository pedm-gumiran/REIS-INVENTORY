import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiMinus } from 'react-icons/fi';
import Input_Text from '../../Input_Fields/Input_Text';
import Button from '../../Buttons/Button';

export default function EditDocumentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  existingDocuments = [],
  title = "Edit Documents"
}) {
  const [documents, setDocuments] = useState([]);

  // Initialize with existing documents when modal opens
  useEffect(() => {
    if (isOpen) {
      if (existingDocuments.length > 0) {
        setDocuments(existingDocuments);
      } else {
        setDocuments([{ id: 1, name: '' }]);
      }
    }
  }, [existingDocuments, isOpen]);

  const addDocument = () => {
    const newId = Math.max(...documents.map(d => d.id), 0) + 1;
    setDocuments([...documents, { id: newId, name: '' }]);
  };

  const removeDocument = (id) => {
    if (documents.length > 1) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const updateDocument = (id, field, value) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validDocuments = documents.filter(doc => doc.name.trim() !== '');
    onSave(validDocuments);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {documents.map((document, index) => (
              <div key={document.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800">
                    Document {index + 1}
                  </h3>
                  {documents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDocument(document.id)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      title="Remove document"
                    >
                      <FiMinus size={20} />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Document Name */}
                  <div>
                    <Input_Text
                      label="Document Name *"
                      value={document.name}
                      onChange={(e) => updateDocument(document.id, 'name', e.target.value)}
                      placeholder="e.g., Birth Certificate, Transcript of Records"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Document Button */}
            <button
              type="button"
              onClick={addDocument}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <FiPlus size={20} />
              Add Another Document
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <Button
            label="Cancel"
            type="button"
            onClick={onClose}
            variant="modal-secondary"
          />
          <Button
            label="Update Documents"
            type="submit"
            onClick={handleSubmit}
            disabled={!documents.some(doc => doc.name.trim() !== '')}
            variant="modal-primary"
          />
        </div>
      </div>
    </div>
  );
}
