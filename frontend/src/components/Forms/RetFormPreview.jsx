import React, { useEffect } from 'react';

import { FiX, FiPrinter } from 'react-icons/fi';



export default function RetFormPreview({ formData, onClose }) {

  // Add print styles when component mounts

  useEffect(() => {

    const printStyles = `

  @page {

    size: 14in 8.5in; /* Legal size - Landscape */

    margin: 0.25in;

  }



  @media print {

    html,

    body {

      margin: 0 !important;

      padding: 0 !important;

      height: 100% !important;

      overflow: visible !important;

      -webkit-print-color-adjust: exact !important;

      print-color-adjust: exact !important;

    }



    /* In-app printing can be unreliable due to modal/fixed positioning.

       The Print button uses a dedicated print window. Keep these rules minimal

       to avoid blank pages when users trigger Ctrl+P. */

    .sticky,

    button,

    .print:hidden {

      display: none !important;

    }



    .ret-form-content {

      box-shadow: none !important;

      max-width: none !important;

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



    const previousBodyStyle = {

      overflow: document.body.style.overflow,

      position: document.body.style.position,

      width: document.body.style.width,

    };



    const handleBeforePrint = () => {

      document.body.style.overflow = '';

      document.body.style.position = '';

      document.body.style.width = '';

    };



    const handleAfterPrint = () => {

      document.body.style.overflow = previousBodyStyle.overflow;

      document.body.style.position = previousBodyStyle.position;

      document.body.style.width = previousBodyStyle.width;

    };



    window.addEventListener('beforeprint', handleBeforePrint);

    window.addEventListener('afterprint', handleAfterPrint);



    // Cleanup function

    return () => {

      const styles = document.getElementById('ret-form-print-styles');

      if (styles) {

        styles.remove();

      }

      window.removeEventListener('beforeprint', handleBeforePrint);

      window.removeEventListener('afterprint', handleAfterPrint);

      // Restore body scrolling when modal closes

      document.body.style.overflow = '';

      document.body.style.position = '';

      document.body.style.width = '';

    };

  }, []);



  const handlePrint = () => {

    const formEl = document.querySelector('.ret-form-content');

    if (!formEl) {

      window.print();

      return;

    }



    const styles = Array.from(

      document.querySelectorAll('link[rel="stylesheet"], style'),

    )

      .map((el) => el.outerHTML)

      .join('\n');



    const printWindow = window.open('', '_blank', 'width=1200,height=800');

    if (!printWindow) {

      window.print();

      return;

    }



    const printCss = `

      @page { 

        size: 13in 8.5in; 

        margin: 0.2in;

        margin-top: 0.2in;

        margin-bottom: 0.2in;

        @top-center { content: none; }

        @bottom-center { content: none; }

        @top-right { content: none; }

        @bottom-right { content: none; }

        @top-left { content: none; }

        @bottom-left { content: none; }

      }

      @media print {

        html, body { 

          margin: 0; 

          padding: 0; 

          -webkit-print-color-adjust: exact; 

          print-color-adjust: exact; 

        }

        .ret-form-content { 

          display: flex !important; 

          flex-direction: row !important; 

          gap: 0.3in !important; 

          align-items: stretch !important; 

        }

        .ret-form-content > div { 

          width: calc((100% - 0.5rem) / 2) !important; 

          page-break-inside: avoid !important; 

          break-inside: avoid !important; 

        }

        .ret-form-content { zoom: 0.85; }

        

        /* Hide browser print headers and footers */

        header, footer, nav, aside {

          display: none !important;

        }

        

        /* Hide any potential print overlays */

        ::before, ::after {

          content: none !important;

        }

        

        /* Remove any generated content */

        .print-header, .print-footer, .page-header, .page-footer {

          display: none !important;

        }

      }

    `;



    printWindow.document.open();

    printWindow.document.write(`<!doctype html>

      <html>

        <head>

          <meta charset="utf-8" />

          <meta name="viewport" content="width=device-width, initial-scale=1" />

          ${styles}

          <style>${printCss}</style>

          <title>RET Request Form</title>

        </head>

        <body>

          ${formEl.outerHTML}

        </body>

      </html>`);

    printWindow.document.close();



    printWindow.focus();

    setTimeout(() => {

      printWindow.print();

      printWindow.close();

    }, 300);

  };



  return (

    <div className="ret-print-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">

        {/* Header Controls */}

        <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm">

          <div className="flex items-center gap-4">

            <h1 className="text-xl font-bold text-white">

              RET Request Form Preview

            </h1>

          </div>

          <div className="flex items-center gap-3">

            <button

              className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-all font-semibold shadow-lg border-2 border-green-500/30"

              onClick={handlePrint}

            >

              <FiPrinter size={16} />

              Print

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

          <div

            className="ret-form-content bg-white dark:bg-white text-black w-full max-w-[1400px] mx-auto p-6 shadow-2xl rounded-sm flex gap-[6rem] relative overflow-hidden print:w-full print:max-w-none print:p-0 print:shadow-none print:rounded-none"

            style={{ fontFamily: 'Arial, sans-serif' }}

          >

            {/* First Form */}

              <div className="flex-1 flex flex-col border border-gray-300 p-1">

              <div className="border-[1.5px] border-black flex flex-col h-full">

                {/* University Header */}

                <div className="flex border-b-[1.5px] border-black">

                  <div className="w-20 p-1 border-r-[1.5px] border-black flex items-center justify-center">

                    <img

                      src="/nvsu logo.jfif"

                      alt="NVSU"

                      className="w-16 h-16 object-cover rounded-full "

                    />

                  </div>

                  <div className="flex-1 text-center py-1">

                    <p className="text-[~0.833rem] leading-tight font-bold uppercase">

                      Republic of the Philippines

                    </p>

                    <p className="text-[~0.833rem] font-bold leading-tight uppercase">

                      NUEVA VIZCAYA STATE UNIVERSITY

                    </p>

                    <p className="text-[~0.833rem] font-bold leading-tight">

                      Bayombong, Nueva Vizcaya

                    </p>

                    <div className=" border-t-[1.5px]  border-black text-center ">

                      <h2 className="text-[1rem] font-bold tracking-widest ">

                        RET REQUEST FORM

                      </h2>

                    </div>

                  </div>

                </div>

                <div className="flex justify-end px-4  text-[0.916rem] font-bold border-b-[1.5px]  ">

                  <span className='mb-2'>

                    RRF No.:{' '}

                    <span className="inline-block w-24 border-b-[1.5px] ml-1">

                      {formData.rrfNumber || ''}

                    </span>

                  </span>

                </div>



                {/* Type of Request */}

                <div className="text-center  border-b-[1.5px] border-black">

                 <h2 className="font-bold  text-[~S0.916rem]">Type of Request</h2>

                </div>



                {/* Request Type Selection */}

                <div className="flex border-b-[1.5px] border-black h-45 ">

                  <div className="w-[60%] border-r-[1.5px] border-black  flex flex-col ">

                    <div className="flex items-center gap-4 ml-2">

                      <label className="flex items-center font-bold">

                        <span className="w-[18px] h-[18px] border-[1.5px] border-black mr-1 flex items-center justify-center text-[~0.833rem] ">

                          {formData.requestType?.includes('document')

                            ? '✓'

                            : ''}

                        </span>

                        Document

                      </label>

                      <label className="flex items-center font-bold">

                        <span className="w-[18px] h-[18px] border-[1.5px] border-black mr-1 flex items-center justify-center text-[~0.833rem] ">

                          {formData.requestType?.includes('supplies')

                            ? '✓'

                            : ''}

                        </span>

                        Supplies/materials/ Equipment

                      </label>

                    </div>

                    <div className="mt-2">

                      <p className="text-[~0.833rem] pl-2">

                        Document/ Supplies/ Materials/ Equipment Requested:

                      </p>

                      <div className="mt-1">

                        <div className="border-b-[1.5px] border-black w-full h-[20px] text-left break-words whitespace-pre-wrap overflow-wrap-anywhere leading-[18px] overflow-hidden">

                          {(() => {

                            const text = formData.description || '';

                            const words = text.split(' ');

                            let line1 = '';

                            let currentLength = 0;

                            const maxCharsPerLine = 60;

                            

                            for (let i = 0; i < words.length; i++) {

                              if (currentLength + words[i].length + 1 <= maxCharsPerLine) {

                                line1 += (line1 ? ' ' : '') + words[i];

                                currentLength += words[i].length + 1;

                              } else {

                                break;

                              }

                            }

                            return line1;

                          })()}

                        </div>

                        <div className="border-b-[1.5px] border-black w-full h-[20px] text-left break-words whitespace-pre-wrap overflow-wrap-anywhere leading-[18px] overflow-hidden">

                          {(() => {

                            const text = formData.description || '';

                            const words = text.split(' ');

                            let line1 = '';

                            let currentLength = 0;

                            const maxCharsPerLine = 60;

                            let wordsUsed = 0;

                            

                            for (let i = 0; i < words.length; i++) {

                              if (currentLength + words[i].length + 1 <= maxCharsPerLine) {

                                line1 += (line1 ? ' ' : '') + words[i];

                                currentLength += words[i].length + 1;

                                wordsUsed++;

                              } else {

                                break;

                              }

                            }

                            

                            let line2 = '';

                            currentLength = 0;

                            for (let i = wordsUsed; i < words.length; i++) {

                              if (currentLength + words[i].length + 1 <= maxCharsPerLine) {

                                line2 += (line2 ? ' ' : '') + words[i];

                                currentLength += words[i].length + 1;

                              } else {

                                break;

                              }

                            }

                            return line2;

                          })()}

                        </div>

                        <div className="border-b-[1.5px] border-black w-full h-[20px] text-left break-words whitespace-pre-wrap overflow-wrap-anywhere leading-[18px] overflow-hidden">

                          {(() => {

                            const text = formData.description || '';

                            const words = text.split(' ');

                            let line1 = '';

                            let currentLength = 0;

                            const maxCharsPerLine = 60;

                            let wordsUsed = 0;

                            

                            for (let i = 0; i < words.length; i++) {

                              if (currentLength + words[i].length + 1 <= maxCharsPerLine) {

                                line1 += (line1 ? ' ' : '') + words[i];

                                currentLength += words[i].length + 1;

                                wordsUsed++;

                              } else {

                                break;

                              }

                            }

                            

                            let line2 = '';

                            currentLength = 0;

                            for (let i = wordsUsed; i < words.length; i++) {

                              if (currentLength + words[i].length + 1 <= maxCharsPerLine) {

                                line2 += (line2 ? ' ' : '') + words[i];

                                currentLength += words[i].length + 1;

                                wordsUsed++;

                              } else {

                                break;

                              }

                            }

                            

                            let line3 = '';

                            for (let i = wordsUsed; i < words.length; i++) {

                              line3 += (line3 ? ' ' : '') + words[i];

                            }

                            return line3;

                          })()}

                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="w-[40%]  flex flex-col gap-3 ml-2">

                    <label className="flex items-center font-bold ">

                      <span className="w-[18px] h-[18px] border-[1.5px] border-black mr-1 flex items-center justify-center text-[~0.833rem] ">

                        {formData.requestType?.includes('conference')

                          ? '✓'

                          : ''}

                      </span>

                      Use of RET Conference Room

                    </label>

                    <div className="flex flex-col gap-3 mt-1 text-[~0.833rem]">

                      <div className="flex">

                        Date of Activity:{' '}

                        <span className="flex-grow border-b-[1.5px]  border-black ml-1 min-h-[16px]">

                          {formData.dateOfActivity || ''}

                        </span>

                      </div>

                      <div className="flex">

                        Start Time:{' '}

                        <span className="flex-grow border-b-[1.5px]  border-black ml-1 min-h-[16px]">

                          {formData.startTime || ''}

                        </span>

                      </div>

                      <div className="flex">

                        End Time:{' '}

                        <span className="flex-grow border-b-[1.5px]  border-black ml-1 min-h-[16px]">

                          {formData.endTime || ''}

                        </span>

                      </div>

                    </div>

                  </div>

                </div>



                {/* Purpose */}

                <div className=" border-black p-2 min-h-[100px] ">

                  <p className="text-[~0.833rem] font-bold">Purpose:</p>

                  <div className="border-b-[1.5px] border-black w-full  min-h-[0.833rem]">

                    {formData.purpose || ''}

                  </div>

                  <div className="border-b-[1.5px] border-black w-full  min-h-[20px]"></div>

                  <div className="border-b-[1.5px] border-black w-full min-h-[20px]"></div>

                </div>



                {/* Certification */}

                <div className="border-t-[1.5px] border-black  text-[~0.833rem] ml-1">

                  I hereby certify that the request will be used exclusively for

                  the above stated purpose.

                </div>



                {/* Signatures */}

                <div className="flex flex-col   ">

                  <div className="border-b-[1.5px] border-black pt-4">

                    <p className="text-[~0.833rem] font-bold ml-2">Requested by:</p>

                    <div className="mt-4 flex flex-col items-center text-center">

                      <div className="w-2/3 border-b-[1.5px] border-black min-h-[20px] text-center font-bold">

                        {formData.requestorName || ''}

                      </div>

                      <span className="text-[0.833rem] leading-tight">

                        Signature over Printed Name

                      </span>

                    </div>

                  </div>

                  <div className="border-b-[1.5px] border-black ">

                    <p className="text-[~0.833rem] font-bold ml-2">Approved by:</p>

                    <div className="mt-4 flex flex-col items-center text-center">

                      <div className="w-2/3 border-b-[1.5px] border-black  text-center font-bold">

                        {formData.approvedBy || ''}

                      </div>

                      <span className="text-[0.833rem]  leading-tight">

                        Director for Research and Development/

                        <br />

                        Director for Extension and Training

                      </span>

                    </div>

                  </div>

                  <div className="border-b-[1.5px] border-black ">

                    <p className="text-[~0.833rem] font-bold ml-2">Served by:</p>

                    <div className="mt-4 flex flex-col items-center">

                      <div className="w-2/3 border-b-[1.5px] border-black text-center font-bold">

                        {formData.servedBy || ''}

                      </div>

                      <span className="text-[0.833rem] mt-1 ">

                        Name/Signature of RET Staff

                      </span>

                    </div>

                  </div>

                  <div className=" flex-1">

                    <p className="text-[~0.833rem] font-bold pl-2">

                      Received by:{' '}

                      <span className="font-normal">(if document)</span>

                    </p>

                    <div className="mt-1 flex flex-col items-center">

                      <div className="w-2/3 border-b-[1.5px] border-black min-h-[10px] text-center font-bold">

                        {formData.receivedBy || ''}

                      </div>

                      <span className="text-[0.833rem] mt-1 ">

                        Signature over Printed Name

                      </span>

                    </div>

                  </div>

                </div>

              </div>

                <div className="mt-4 flex flex-col px-1">

                <p className=" text-[~0.833rem] ">

                  Note: For RET Conference Room users please always practice

                  CLAYGO (Clean As You Go).

                </p>

                <p className="text-[0.6688rem] mt-4">NVSU-FR-RET-20-00 (080723)</p>

              </div>

            </div>



            {/* Second Form (Duplicate) */}

              <div className="flex-1 flex flex-col border border-gray-300 p-1">

              <div className="border-[1.5px] border-black flex flex-col h-full">

                {/* University Header */}

                <div className="flex border-b-[1.5px] border-black">

                  <div className="w-20 p-1 border-r-[1.5px] border-black flex items-center justify-center">

                    <img

                      src="/nvsu logo.jfif"

                      alt="NVSU"

                      className="w-16 h-16 object-cover rounded-full "

                    />

                  </div>

                  <div className="flex-1 text-center py-1">

                    <p className="text-[~0.833rem] leading-tight font-bold uppercase">

                      Republic of the Philippines

                    </p>

                    <p className="text-[~0.833rem] font-bold leading-tight uppercase">

                      NUEVA VIZCAYA STATE UNIVERSITY

                    </p>

                    <p className="text-[~0.833rem] font-bold leading-tight">

                      Bayombong, Nueva Vizcaya

                    </p>

                    <div className=" border-t-[1.5px]  border-black text-center ">

                      <h2 className="text-[1rem] font-bold tracking-widest ">

                        RET REQUEST FORM

                      </h2>

                    </div>

                  </div>

                </div>

                <div className="flex justify-end px-4  text-[0.916rem] font-bold border-b-[1.5px]  ">

                  <span className='mb-2'>

                    RRF No.:{' '}

                    <span className="inline-block w-24 border-b-[1.5px] ml-1">

                      {formData.rrfNumber || ''}

                    </span>

                  </span>

                </div>



                {/* Type of Request */}

                <div className="text-center  border-b-[1.5px] border-black">

                 <h2 className="font-bold  text-[~S0.916rem]">Type of Request</h2>

                </div>



                {/* Request Type Selection */}

                <div className="flex border-b-[1.5px] border-black h-45 ">

                  <div className="w-[60%] border-r-[1.5px] border-black  flex flex-col ">

                    <div className="flex items-center gap-4 ml-2">

                      <label className="flex items-center font-bold">

                        <span className="w-[18px] h-[18px] border-[1.5px] border-black mr-1 flex items-center justify-center text-[~0.833rem] ">

                          {formData.requestType?.includes('document')

                            ? '✓'

                            : ''}

                        </span>

                        Document

                      </label>

                      <label className="flex items-center font-bold">

                        <span className="w-[18px] h-[18px] border-[1.5px] border-black mr-1 flex items-center justify-center text-[~0.833rem] ">

                          {formData.requestType?.includes('supplies')

                            ? '✓'

                            : ''}

                        </span>

                        Supplies/materials/ Equipment

                      </label>

                    </div>

                    <div className="mt-2">

                      <p className="text-[~0.833rem]">

                        Document/ Supplies/ Materials/ Equipment Requested:

                      </p>

                      <div className="mt-1">

                        <div className="border-b-[1.5px] border-black w-full h-[20px] text-left break-words whitespace-pre-wrap overflow-wrap-anywhere leading-[18px] overflow-hidden">

                          {(() => {

                            const text = formData.description || '';

                            const words = text.split(' ');

                            let line1 = '';

                            let currentLength = 0;

                            const maxCharsPerLine = 60;

                            

                            for (let i = 0; i < words.length; i++) {

                              if (currentLength + words[i].length + 1 <= maxCharsPerLine) {

                                line1 += (line1 ? ' ' : '') + words[i];

                                currentLength += words[i].length + 1;

                              } else {

                                break;

                              }

                            }

                            return line1;

                          })()}

                        </div>

                        <div className="border-b-[1.5px] border-black w-full h-[20px] text-left break-words whitespace-pre-wrap overflow-wrap-anywhere leading-[18px] overflow-hidden">

                          {(() => {

                            const text = formData.description || '';

                            const words = text.split(' ');

                            let line1 = '';

                            let currentLength = 0;

                            const maxCharsPerLine = 60;

                            let wordsUsed = 0;

                            

                            for (let i = 0; i < words.length; i++) {

                              if (currentLength + words[i].length + 1 <= maxCharsPerLine) {

                                line1 += (line1 ? ' ' : '') + words[i];

                                currentLength += words[i].length + 1;

                                wordsUsed++;

                              } else {

                                break;

                              }

                            }

                            

                            let line2 = '';

                            currentLength = 0;

                            for (let i = wordsUsed; i < words.length; i++) {

                              if (currentLength + words[i].length + 1 <= maxCharsPerLine) {

                                line2 += (line2 ? ' ' : '') + words[i];

                                currentLength += words[i].length + 1;

                              } else {

                                break;

                              }

                            }

                            return line2;

                          })()}

                        </div>

                        <div className="border-b-[1.5px] border-black w-full h-[20px] text-left break-words whitespace-pre-wrap overflow-wrap-anywhere leading-[18px] overflow-hidden">

                          {(() => {

                            const text = formData.description || '';

                            const words = text.split(' ');

                            let line1 = '';

                            let currentLength = 0;

                            const maxCharsPerLine = 60;

                            let wordsUsed = 0;

                            

                            for (let i = 0; i < words.length; i++) {

                              if (currentLength + words[i].length + 1 <= maxCharsPerLine) {

                                line1 += (line1 ? ' ' : '') + words[i];

                                currentLength += words[i].length + 1;

                                wordsUsed++;

                              } else {

                                break;

                              }

                            }

                            

                            let line2 = '';

                            currentLength = 0;

                            for (let i = wordsUsed; i < words.length; i++) {

                              if (currentLength + words[i].length + 1 <= maxCharsPerLine) {

                                line2 += (line2 ? ' ' : '') + words[i];

                                currentLength += words[i].length + 1;

                                wordsUsed++;

                              } else {

                                break;

                              }

                            }

                            

                            let line3 = '';

                            for (let i = wordsUsed; i < words.length; i++) {

                              line3 += (line3 ? ' ' : '') + words[i];

                            }

                            return line3;

                          })()}

                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="w-[40%]  flex flex-col gap-3 ml-2">

                    <label className="flex items-center font-bold ">

                      <span className="w-[18px] h-[18px] border-[1.5px] border-black mr-1 flex items-center justify-center text-[~0.833rem] ">

                        {formData.requestType?.includes('conference')

                          ? '✓'

                          : ''}

                      </span>

                      Use of RET Conference Room

                    </label>

                    <div className="flex flex-col gap-3 mt-1 text-[~0.833rem]">

                      <div className="flex">

                        Date of Activity:{' '}

                        <span className="flex-grow border-b-[1.5px]  border-black ml-1 min-h-[16px]">

                          {formData.dateOfActivity || ''}

                        </span>

                      </div>

                      <div className="flex">

                        Start Time:{' '}

                        <span className="flex-grow border-b-[1.5px]  border-black ml-1 min-h-[16px]">

                          {formData.startTime || ''}

                        </span>

                      </div>

                      <div className="flex">

                        End Time:{' '}

                        <span className="flex-grow border-b-[1.5px]  border-black ml-1 min-h-[16px]">

                          {formData.endTime || ''}

                        </span>

                      </div>

                    </div>

                  </div>

                </div>



                {/* Purpose */}

                <div className=" border-black p-2 min-h-[100px] ">

                  <p className="text-[~0.833rem] font-bold">Purpose:</p>

                  <div className="border-b-[1.5px] border-black w-full  min-h-[0.833rem]">

                    {formData.purpose || ''}

                  </div>

                  <div className="border-b-[1.5px] border-black w-full  min-h-[20px]"></div>

                  <div className="border-b-[1.5px] border-black w-full min-h-[20px]"></div>

                </div>



                {/* Certification */}

                <div className="border-t-[1.5px] border-black  text-[~0.833rem] ml-1">

                  I hereby certify that the request will be used exclusively for

                  the above stated purpose.

                </div>



                {/* Signatures */}

                <div className="flex flex-col   ">

                  <div className="border-b-[1.5px] border-black pt-4">

                    <p className="text-[~0.833rem] font-bold ml-2">Requested by:</p>

                    <div className="mt-4 flex flex-col items-center text-center">

                      <div className="w-2/3 border-b-[1.5px] border-black min-h-[20px] text-center font-bold">

                        {formData.requestorName || ''}

                      </div>

                      <span className="text-[0.833rem] leading-tight">

                        Signature over Printed Name

                      </span>

                    </div>

                  </div>

                  <div className="border-b-[1.5px] border-black ">

                    <p className="text-[~0.833rem] font-bold ml-2">Approved by:</p>

                    <div className="mt-4 flex flex-col items-center text-center">

                      <div className="w-2/3 border-b-[1.5px] border-black  text-center font-bold">

                        {formData.approvedBy || ''}

                      </div>

                      <span className="text-[0.833rem]  leading-tight">

                        Director for Research and Development/

                        <br />

                        Director for Extension and Training

                      </span>

                    </div>

                  </div>

                  <div className="border-b-[1.5px] border-black ">

                    <p className="text-[~0.833rem] font-bold ml-2">Served by:</p>

                    <div className="mt-4 flex flex-col items-center">

                      <div className="w-2/3 border-b-[1.5px] border-black text-center font-bold">

                        {formData.servedBy || ''}

                      </div>

                      <span className="text-[0.833rem] mt-1 ">

                        Name/Signature of RET Staff

                      </span>

                    </div>

                  </div>

                  <div className=" flex-1">

                    <p className="text-[~0.833rem] font-bold pl-2">

                      Received by:{' '}

                      <span className="font-normal">(if document)</span>

                    </p>

                    <div className="mt-1 flex flex-col items-center">

                      <div className="w-2/3 border-b-[1.5px] border-black min-h-[10px] text-center font-bold">

                        {formData.receivedBy || ''}

                      </div>

                      <span className="text-[0.833rem] mt-1 ">

                        Signature over Printed Name

                      </span>

                    </div>

                  </div>

                </div>

              </div>

                <div className="mt-4 flex flex-col px-1">

                <p className=" text-[~0.833rem] ">

                  Note: For RET Conference Room users please always practice

                  CLAYGO (Clean As You Go).

                </p>

                <p className="text-[0.6688rem] mt-4">NVSU-FR-RET-20-00 (080723)</p>

              </div>

            </div>

          </div>

        </div>



        {/* Print Instructions */}

        <div className="px-6 pb-4 text-center text-gray-500 dark:text-gray-400 text-sm print:hidden">

          <p>

            This digital form is optimized for 8.5" x 13" Landscape printing.

            For best results, ensure "Background Graphics" is enabled and

            margins are set to 0.5" in your browser's print dialog.

          </p>

        </div>

      </div>

    </div>

  );

}

