import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiPlus, FiMinus } from 'react-icons/fi';
import Input_Text from '../../Input_Fields/Input_Text';
import Button from '../../Buttons/Button';

export default function DocumentRequestModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialDocuments = [],
  title = "Specify Documents to Request",
  onClearData // New prop to handle checkbox unchecking
}) {
  const [documents, setDocuments] = useState(
    initialDocuments.length > 0 
      ? initialDocuments 
      : [{ id: 1, name: '' }]
  );

  // Refs to store input elements for focus management
  const inputRefs = useRef({});

  // Sync documents with parent state and handle clearing
  useEffect(() => {
    if (isOpen) {
      // Always sync with parent state when modal opens
      if (initialDocuments.length === 0) {
        // Parent cleared the data, so reset to single empty document
        setDocuments([{ id: 1, name: '' }]);
      } else {
        // Parent has data, sync with it
        setDocuments(initialDocuments);
      }
    }
  }, [initialDocuments, isOpen]);

  const addDocument = () => {
    const newId = Math.max(...documents.map(d => d.id), 0) + 1;
    setDocuments([...documents, { id: newId, name: '' }]);
    
    // Focus on the newly created document field after a short delay
    setTimeout(() => {
      if (inputRefs.current[newId]) {
        inputRefs.current[newId].focus();
      }
    }, 100);
  };

  const handleKeyDown = (e, documentId) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      // Check if current document has content and it's the last document
      const currentDoc = documents.find(doc => doc.id === documentId);
      const isLastDocument = documents[documents.length - 1].id === documentId;
      
      if (currentDoc && currentDoc.name.trim() && isLastDocument) {
        addDocument();
      }
    }
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
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={() => {
              if (onClearData) onClearData('document');
              onClose();
            }}
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
                      onKeyDown={(e) => handleKeyDown(e, document.id)}
                      placeholder="e.g., Birth Certificate, Transcript of Records"
                      required
                      inputRef={(el) => { inputRefs.current[document.id] = el; }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Document Button */}
            <button
              type="button"
              onClick={addDocument}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
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
            onClick={() => {
              if (onClearData) onClearData('document');
              onClose();
            }}
            variant="modal-secondary"
          />
          <Button
            label="Save Documents"
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
