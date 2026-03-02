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

// DELETE transaction audit
exports.deleteTransactionAudit = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Audit.deleteTransactionAudit(id);
    
    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete transaction'
    });
  }
};

// DELETE all transaction audits
exports.deleteAllTransactionAudits = async (req, res) => {
  try {
    const result = await Audit.deleteAllTransactionAudits();
    
    res.status(200).json({
      success: true,
      message: 'All transactions deleted successfully',
      deletedCount: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete all transactions'
    });
  }
};

// DELETE equipment return
exports.deleteEquipmentReturn = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Audit.deleteEquipmentReturn(id);
    
    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipment return not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Equipment return deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete equipment return'
    });
  }
};

// DELETE all equipment returns
exports.deleteAllEquipmentReturns = async (req, res) => {
  try {
    const result = await Audit.deleteAllEquipmentReturns();
    
    res.status(200).json({
      success: true,
      message: 'All equipment returns deleted successfully',
      deletedCount: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete all equipment returns'
    });
  }
};
