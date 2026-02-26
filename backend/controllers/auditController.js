const Audit = require('../models/auditModel');

// GET all equipment returns
exports.getEquipmentReturns = async (req, res) => {
  try {
    const equipmentReturns = await Audit.getAllEquipmentReturns();
    res.status(200).json({
      success: true,
      data: equipmentReturns
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch equipment returns'
    });
  }
};

// GET all transaction audits
exports.getTransactionAudits = async (req, res) => {
  try {
    const transactionAudits = await Audit.getAllTransactionAudits();
    res.status(200).json({
      success: true,
      data: transactionAudits
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction audits'
    });
  }
};

// CREATE equipment return
exports.createEquipmentReturn = async (req, res) => {
  try {
    const { 
      clientName, 
      productId, 
      itemDescription, 
      borrowedQuantity, 
      borrowedDate, 
      returnedQuantity, 
      returnedDate, 
      returnedNotes, 
      inspectedBy 
    } = req.body;
    
    // Validate required fields
    if (!clientName || !productId || !itemDescription || !borrowedQuantity) {
      return res.status(400).json({
        success: false,
        message: 'Client name, product ID, item description, and borrowed quantity are required'
      });
    }
    
    const id = await Audit.createEquipmentReturn(
      null, // returnId not used in schema
      clientName,
      productId,
      itemDescription,
      borrowedQuantity,
      borrowedDate || new Date(),
      returnedQuantity || 0,
      returnedDate || null,
      returnedNotes || '',
      inspectedBy || 'System'
    );
    
    res.status(201).json({
      success: true,
      message: 'Equipment return created successfully',
      data: { id }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to create equipment return'
    });
  }
};

// CREATE transaction audit
exports.createTransactionAudit = async (req, res) => {
  try {
    const { 
      rrfNo,
      typeOfRequest,
      itemsRequested,
      dateOfActivity,
      startTime,
      endTime,
      purpose,
      requestedBy,
      approvedBy,
      servedBy,
      receivedBy,
      transactionDate
    } = req.body;
    
    // Validate required fields
    if (!rrfNo || !typeOfRequest || !requestedBy) {
      return res.status(400).json({
        success: false,
        message: 'RRF number, type of request, and requested by are required'
      });
    }
    
    const id = await Audit.createTransactionAudit(
      null, // transactionId not used in schema
      rrfNo,
      typeOfRequest,
      itemsRequested || '',
      dateOfActivity,
      startTime,
      endTime,
      purpose || '',
      requestedBy,
      approvedBy || '',
      servedBy || '',
      receivedBy || '',
      transactionDate || new Date()
    );
    
    res.status(201).json({
      success: true,
      message: 'Transaction audit created successfully',
      data: { id }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction audit'
    });
  }
};
