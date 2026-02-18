import React, { useEffect } from 'react';
import { FiX, FiPrinter } from 'react-icons/fi';

export default function RetFormPreview({ formData, onClose }) {
  // Add print styles when component mounts
  useEffect(() => {
    const printStyles = `
  @page {
    size: 13in 8.5in; /* Correct Landscape for Long Bond */
    margin: 0.5in;
  }
  
  @media print {
    /* Hide the modal background, close button, and print instructions */
    .fixed, .sticky, .no-print, button, .bg-black {
      display: none !important;
    }

    /* Reset body and html for printing */
    html, body {
      visibility: hidden;
      margin: 0 !important;
      padding: 0 !important;
      height: auto !important;
    }

    /* Force the specific form container to be visible and positioned at the top */
    .ret-form-content {
      visibility: visible;
      position: absolute;
      left: 0;
      top: 0;
      width: 100% !important;
      display: flex !important; /* Keep the side-by-side layout */
      flex-direction: row !important;
      gap: 2rem !important;
      box-shadow: none !important;
      border: none !important;
    }

    /* Ensure background colors and borders show up */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = printStyles;
    styleElement.id = 'ret-form-print-styles';
    
    // Remove existing styles if present
    const existingStyles = document.getElementById('ret-form-print-styles');
    if (existingStyles) {
      existingStyles.remove();
    }
    
    document.head.appendChild(styleElement);

    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    // Cleanup function
    return () => {
      const styles = document.getElementById('ret-form-print-styles');
      if (styles) {
        styles.remove();
      }
      // Restore body scrolling when modal closes
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  const handlePrint = () => {
    // Trigger print dialog
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header Controls */}
        <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">RET Request Form Preview</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-all font-semibold" 
              onClick={handlePrint}
            >
              <FiPrinter size={16} />
              Print / Export PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiX size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="ret-form-content bg-white dark:bg-white text-black w-full max-w-[1400px] mx-auto p-6 shadow-2xl rounded-sm flex gap-8 relative overflow-hidden print:w-full print:max-w-none print:p-0 print:shadow-none print:rounded-none" style={{ fontFamily: 'Arial, sans-serif' }}>
          {/* First Form */}
          <div className="flex-1 flex flex-col border border-gray-300 p-1">
            <div className="border-[1.5px] border-black flex flex-col h-full">
              {/* University Header */}
              <div className="flex border-b-[1.5px] border-black">
                <div className="w-16 h-16 p-1 border-r-[1.5px] border-black flex items-center justify-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                    NVSU
                  </div>
                </div>
               <div className="flex-1 text-center py-1"> <div className="flex-1 text-center py-1">
                  <p className="text-[10px] leading-tight font-medium uppercase">Republic of the Philippines</p>
                  <p className="text-xs font-bold leading-tight uppercase">NUEVA VIZCAYA STATE UNIVERSITY</p>
                  <p className="text-[10px] leading-tight italic">Bayombong, Nueva Vizcaya</p>
                </div>
                <div className="border-b-[1.5px] border-t-[1.5px] border-left-[1.5px] border-black text-center py-1 bg-gray-50 ">
                <h2 className="text-sm font-bold tracking-widest ">RET REQUEST FORM</h2>
              </div></div>
              </div>
              
              {/* Form Title */}
              
              
              {/* RRF Number */}
              <div className="flex justify-end px-4 py-1 text-xs font-bold border-b-[1.5px] border-black">
                <span>RRF No.: <span className="inline-block w-24 border-b-[1.5px] border-black ml-1">{formData.rrfNumber || ''}</span></span>
              </div>
              
              {/* Type of Request */}
              <div className="text-center py-1 text-xs font-bold border-b-[1.5px] border-black">
                Type of Request
              </div>
              
              {/* Request Type Selection */}
              <div className="flex border-b-[1.5px] border-black text-[10px] h-32">
                <div className="w-[60%] border-r-[1.5px] border-black p-2 flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <span className="w-[18px] h-[18px] border-[1.5px] border-black mr-1 flex items-center justify-center text-[12px] font-bold">
                        {formData.requestType?.includes('document') ? '✓' : ''}
                      </span>
                      Document
                    </label>
                    <label className="flex items-center">
                      <span className="w-[18px] h-[18px] border-[1.5px] border-black mr-1 flex items-center justify-center text-[12px] font-bold">
                        {formData.requestType?.includes('supplies') ? '✓' : ''}
                      </span>
                      Supplies/materials/ Equipment
                    </label>
                  </div>
                  <div className="mt-2">
                    <p className="font-bold mb-1">Document/ Supplies/ Materials/ Equipment Requested:</p>
                    <div className="border-b-[1.5px] border-black w-full mb-3 mt-4 min-h-[20px]">
                      {formData.description || ''}
                    </div>
                    <div className="border-b-[1.5px] border-black w-full mb-3 mt-4 min-h-[20px]"></div>
                    <div className="border-b-[1.5px] border-black w-full min-h-[20px]"></div>
                  </div>
                </div>
                <div className="w-[40%] p-2 flex flex-col gap-3">
                  <label className="flex items-center">
                    <span className="w-[18px] h-[18px] border-[1.5px] border-black mr-1 flex items-center justify-center text-[12px] font-bold">
                      {formData.requestType?.includes('conference') ? '✓' : ''}
                    </span>
                    Use of RET Conference Room
                  </label>
                  <div className="flex flex-col gap-3 mt-1">
                    <div className="flex">Date of Activity: <span className="flex-grow border-b-[1.5px] border-dotted border-black ml-1 min-h-[16px]">{formData.dateOfActivity || ''}</span></div>
                    <div className="flex">Start Time: <span className="flex-grow border-b-[1.5px] border-dotted border-black ml-1 min-h-[16px]">{formData.startTime || ''}</span></div>
                    <div className="flex">End Time: <span className="flex-grow border-b-[1.5px] border-dotted border-black ml-1 min-h-[16px]">{formData.endTime || ''}</span></div>
                  </div>
                </div>
              </div>
              
              {/* Purpose */}
              <div className="border-b-[1.5px] border-black p-2 min-h-[100px]">
                <p className="text-[10px] font-bold">Purpose:</p>
                <div className="border-b-[1.5px] border-black w-full mb-4 mt-6 min-h-[20px]">
                  {formData.purpose || ''}
                </div>
                <div className="border-b-[1.5px] border-black w-full mb-4 mt-6 min-h-[20px]"></div>
                <div className="border-b-[1.5px] border-black w-full min-h-[20px]"></div>
              </div>
              
              {/* Certification */}
              <div className="border-b-[1.5px] border-black p-1 text-[10px] italic">
                I hereby certify that the request will be used exclusively for the above stated purpose.
              </div>
              
              {/* Signatures */}
              <div className="flex flex-col flex-1">
                <div className="border-b-[1.5px] border-black p-2">
                  <p className="text-[10px] font-bold">Requested by:</p>
                  <div className="mt-4 flex flex-col items-center">
                    <div className="border-b-[1.5px] border-black min-h-[20px] text-center">
                      {formData.requestorName || ''}
                    </div>
                    <span className="text-[10px] mt-1 italic">Signature over Printed Name</span>
                  </div>
                </div>
                <div className="border-b-[1.5px] border-black p-2">
                  <p className="text-[10px] font-bold">Approved by:</p>
                  <div className="mt-6 flex flex-col items-center text-center">
                    <div className="w-2/3 border-b-[1.5px] border-black min-h-[20px] text-center">
                      {formData.approvedBy || ''}
                    </div>
                    <span className="text-[10px] mt-1 font-bold leading-tight">Director for Research and Development/<br/>Director for Extension and Training</span>
                  </div>
                </div>
                <div className="border-b-[1.5px] border-black p-2">
                  <p className="text-[10px] font-bold">Served by:</p>
                  <div className="mt-4 flex flex-col items-center">
                    <div className="w-2/3 border-b-[1.5px] border-black min-h-[20px] text-center">
                      {formData.servedBy || ''}
                    </div>
                    <span className="text-[10px] mt-1 italic">Name/Signature of RET Staff</span>
                  </div>
                </div>
                <div className="p-2 flex-1">
                  <p className="text-[10px] font-bold">Received by: <span className="font-normal">(if document)</span></p>
                  <div className="mt-4 flex flex-col items-center">
                    <div className="w-2/3 border-b-[1.5px] border-black min-h-[20px] text-center">
                      {formData.receivedBy || ''}
                    </div>
                    <span className="text-[10px] mt-1 italic">Signature over Printed Name</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-[9px] flex justify-between px-1">
              <p className="italic">Note: For RET Conference Room users please always practice CLAYGO (Clean As You Go).</p>
              <p className="font-bold">NVSU-FR-RET-20-00 (080723)</p>
            </div>
          </div>

          {/* Second Form (Duplicate) */}
          <div className="flex-1 flex flex-col border border-gray-300 p-1">
            <div className="border-[1.5px] border-black flex flex-col h-full">
              {/* University Header */}
              <div className="flex border-b-[1.5px] border-black">
                <div className="w-16 h-16 p-1 border-r-[1.5px] border-black flex items-center justify-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                    NVSU
                  </div>
                </div>
                <div className="flex-1 text-center py-1">
                  <p className="text-[10px] leading-tight font-medium uppercase">Republic of the Philippines</p>
                  <p className="text-xs font-bold leading-tight uppercase">NUEVA VIZCAYA STATE UNIVERSITY</p>
                  <p className="text-[10px] leading-tight italic">Bayombong, Nueva Vizcaya</p>
                </div>
              </div>
              
              {/* Form Title */}
              <div className="border-b-[1.5px] border-black text-center py-1 bg-gray-50">
                <h2 className="text-sm font-bold tracking-widest">RET REQUEST FORM</h2>
              </div>
              
              {/* RRF Number */}
              <div className="flex justify-end px-4 py-1 text-xs font-bold border-b-[1.5px] border-black">
                <span>RRF No.: <span className="inline-block w-24 border-b-[1.5px] border-black ml-1">{formData.rrfNumber || ''}</span></span>
              </div>
              
              {/* Type of Request */}
              <div className="text-center py-1 text-xs font-bold border-b-[1.5px] border-black">
                Type of Request
              </div>
              
              {/* Request Type Selection */}
              <div className="flex border-b-[1.5px] border-black text-[10px] h-32">
                <div className="w-[60%] border-r-[1.5px] border-black p-2 flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <span className="w-[18px] h-[18px] border-[1.5px] border-black mr-1 flex items-center justify-center text-[12px] font-bold">
                        {formData.requestType?.includes('document') ? '✓' : ''}
                      </span>
                      Document
                    </label>
                    <label className="flex items-center">
                      <span className="w-[18px] h-[18px] border-[1.5px] border-black mr-1 flex items-center justify-center text-[12px] font-bold">
                        {formData.requestType?.includes('supplies') ? '✓' : ''}
                      </span>
                      Supplies/materials/ Equipment
                    </label>
                  </div>
                  <div className="mt-2">
                    <p className="font-bold mb-1">Document/ Supplies/ Materials/ Equipment Requested:</p>
                    <div className="border-b-[1.5px] border-black w-full mb-3 mt-4 min-h-[20px]">
                      {formData.description || ''}
                    </div>
                    <div className="border-b-[1.5px] border-black w-full mb-3 mt-4 min-h-[20px]"></div>
                    <div className="border-b-[1.5px] border-black w-full min-h-[20px]"></div>
                  </div>
                </div>
                <div className="w-[40%] p-2 flex flex-col gap-3">
                  <label className="flex items-center">
                    <span className="w-[18px] h-[18px] border-[1.5px] border-black mr-1 flex items-center justify-center text-[12px] font-bold">
                      {formData.requestType?.includes('conference') ? '✓' : ''}
                    </span>
                    Use of RET Conference Room
                  </label>
                  <div className="flex flex-col gap-3 mt-1">
                    <div className="flex">Date of Activity: <span className="flex-grow border-b-[1.5px] border-dotted border-black ml-1 min-h-[16px]">{formData.dateOfActivity || ''}</span></div>
                    <div className="flex">Start Time: <span className="flex-grow border-b-[1.5px] border-dotted border-black ml-1 min-h-[16px]">{formData.startTime || ''}</span></div>
                    <div className="flex">End Time: <span className="flex-grow border-b-[1.5px] border-dotted border-black ml-1 min-h-[16px]">{formData.endTime || ''}</span></div>
                  </div>
                </div>
              </div>
              
              {/* Purpose */}
              <div className="border-b-[1.5px] border-black p-2 min-h-[100px]">
                <p className="text-[10px] font-bold">Purpose:</p>
                <div className="border-b-[1.5px] border-black w-full mb-4 mt-6 min-h-[20px]">
                  {formData.purpose || ''}
                </div>
                <div className="border-b-[1.5px] border-black w-full mb-4 mt-6 min-h-[20px]"></div>
                <div className="border-b-[1.5px] border-black w-full min-h-[20px]"></div>
              </div>
              
              {/* Certification */}
              <div className="border-b-[1.5px] border-black p-1 text-[10px] italic">
                I hereby certify that the request will be used exclusively for the above stated purpose.
              </div>
              
              {/* Signatures */}
              <div className="flex flex-col flex-1">
                <div className="border-b-[1.5px] border-black p-2">
                  <p className="text-[10px] font-bold">Requested by:</p>
                  <div className="mt-4 flex flex-col items-center">
                    <div className="border-b-[1.5px] border-black min-h-[20px] text-center">
                      {formData.requestorName || ''}
                    </div>
                    <span className="text-[10px] mt-1 italic">Signature over Printed Name</span>
                  </div>
                </div>
                <div className="border-b-[1.5px] border-black p-2">
                  <p className="text-[10px] font-bold">Approved by:</p>
                  <div className="mt-6 flex flex-col items-center text-center">
                    <div className="w-2/3 border-b-[1.5px] border-black min-h-[20px] text-center">
                      {formData.approvedBy || ''}
                    </div>
                    <span className="text-[10px] mt-1 font-bold leading-tight">Director for Research and Development/<br/>Director for Extension and Training</span>
                  </div>
                </div>
                <div className="border-b-[1.5px] border-black p-2">
                  <p className="text-[10px] font-bold">Served by:</p>
                  <div className="mt-4 flex flex-col items-center">
                    <div className="w-2/3 border-b-[1.5px] border-black min-h-[20px] text-center">
                      {formData.servedBy || ''}
                    </div>
                    <span className="text-[10px] mt-1 italic">Name/Signature of RET Staff</span>
                  </div>
                </div>
                <div className="p-2 flex-1">
                  <p className="text-[10px] font-bold">Received by: <span className="font-normal">(if document)</span></p>
                  <div className="mt-4 flex flex-col items-center">
                    <div className="w-2/3 border-b-[1.5px] border-black min-h-[20px] text-center">
                      {formData.receivedBy || ''}
                    </div>
                    <span className="text-[10px] mt-1 italic">Signature over Printed Name</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-[9px] flex justify-between px-1">
              <p className="italic">Note: For RET Conference Room users please always practice CLAYGO (Clean As You Go).</p>
              <p className="font-bold">NVSU-FR-RET-20-00 (080723)</p>
            </div>
          </div>
        </div>
        </div>

        {/* Print Instructions */}
        <div className="px-6 pb-4 text-center text-gray-500 dark:text-gray-400 text-sm print:hidden">
          <p>This digital form is optimized for 8.5" x 13" Landscape printing. For best results, ensure "Background Graphics" is enabled and margins are set to 0.5" in your browser's print dialog.</p>
        </div>
      </div>
    </div>
  );
}

