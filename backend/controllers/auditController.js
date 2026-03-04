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

// GET borrowed equipment by client
exports.getBorrowedEquipmentByClient = async (req, res) => {
  try {
    const { clientName } = req.params;
    
    if (!clientName) {
      return res.status(400).json({
        success: false,
        message: 'Client name is required'
      });
    }
    
    const borrowedEquipment = await Audit.getBorrowedEquipmentByClient(clientName);
    res.status(200).json({
      success: true,
      data: borrowedEquipment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch borrowed equipment'
    });
  }
};

// SEARCH clients
exports.searchClients = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }
    
    const clients = await Audit.searchClients(q);
    res.status(200).json({
      success: true,
      data: clients
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to search clients'
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
      borrowedDate
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
      borrowedDate || new Date()
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

// UPDATE equipment return
exports.updateEquipmentReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { returned_quantity, returned_notes, inspected_by } = req.body;
    
    console.log('Update equipment return request received:');
    console.log('ID:', id);
    console.log('returned_quantity:', returned_quantity);
    console.log('returned_notes:', returned_notes);
    console.log('inspected_by:', inspected_by);
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Equipment trail ID is required'
      });
    }
    
    const result = await Audit.updateEquipmentReturn(id, returned_quantity, returned_notes, inspected_by);
    
    console.log('Update result:', result);
    
    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipment trail record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Equipment return updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to update equipment return'
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
      transactionDate,
      requested_items
    } = req.body;
    
    // Validate required fields - RRF number is now optional
    if (!typeOfRequest || !requestedBy) {
      return res.status(400).json({
        success: false,
        message: 'Type of request and requested by are required'
      });
    }
    
    // Get connection from pool for transaction
    const db = require('../config/db');
    const connection = await db.getConnection();
    
    try {
      // Start transaction
      await connection.beginTransaction();
      
      // Create transaction audit record
      const id = await Audit.createTransactionAudit(
        null, // transactionId not used in schema
        rrfNo || null, // Allow null for optional RRF
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
        transactionDate || new Date(),
        connection
      );
      
      // Process requested items and update quantities
      if (requested_items && Array.isArray(requested_items) && requested_items.length > 0) {
        console.log('Processing requested items:', requested_items);
        
        for (const item of requested_items) {
          console.log('Processing item:', item);
          
          if (item.type === 'consumable') {
            // Check current stock first
            const [stockCheck] = await connection.execute(
              'SELECT quantity FROM consumable_products WHERE product_id = ?',
              [item.id]
            );
            
            console.log('Consumable stock check result:', stockCheck);
            
            if (stockCheck.length === 0) {
              await connection.rollback();
              return res.status(400).json({
                success: false,
                message: `Consumable product with ID ${item.id} not found`
              });
            }
            
            const currentStock = stockCheck[0].quantity;
            console.log(`Current stock for ${item.name}: ${currentStock}, Requested: ${item.quantity}`);
            
            if (currentStock < item.quantity) {
              await connection.rollback();
              return res.status(400).json({
                success: false,
                message: `Insufficient stock for ${item.name}. Available: ${currentStock}, Requested: ${item.quantity}`
              });
            }
            
            // Deduct from consumable_products table
            const [updateResult] = await connection.execute(
              'UPDATE consumable_products SET quantity = quantity - ? WHERE product_id = ?',
              [item.quantity, item.id]
            );
            
            console.log('Consumable update result:', updateResult);
            
          } else if (item.type === 'non-consumable') {
            // Check current stock first
            const [stockCheck] = await connection.execute(
              'SELECT quantity FROM non_consumable_products WHERE product_id = ?',
              [item.id]
            );
            
            console.log('Non-consumable stock check result:', stockCheck);
            
            if (stockCheck.length === 0) {
              await connection.rollback();
              return res.status(400).json({
                success: false,
                message: `Non-consumable product with ID ${item.id} not found`
              });
            }
            
            const currentStock = stockCheck[0].quantity;
            console.log(`Current stock for ${item.name}: ${currentStock}, Requested: ${item.quantity}`);
            
            if (currentStock < item.quantity) {
              await connection.rollback();
              return res.status(400).json({
                success: false,
                message: `Insufficient stock for ${item.name}. Available: ${currentStock}, Requested: ${item.quantity}`
              });
            }
            
            // Deduct from non_consumable_products table
            const [updateResult] = await connection.execute(
              'UPDATE non_consumable_products SET quantity = quantity - ? WHERE product_id = ?',
              [item.quantity, item.id]
            );
            
            console.log('Non-consumable update result:', updateResult);
            
            // Save to equipment_trail table for borrow tracking
            try {
              const [trailResult] = await connection.execute(
                'INSERT INTO equipment_trail (client_name, product_id, item_description, borrowed_quantity, borrowed_date, returned_quantity, returned_date, returned_notes, inspected_by) VALUES (?, ?, ?, ?, ?, NULL, NULL, ?, ?)',
                [requestedBy, item.id, item.name, item.quantity, new Date(), '-', '-']
              );
              
              console.log('Equipment trail insert result:', trailResult);
            } catch (insertError) {
              console.error('Failed to insert into equipment_trail:', insertError);
              throw new Error(`Failed to save borrow record for ${item.name}: ${insertError.message}`);
            }
          }
        }
      }
      
      // Commit transaction
      await connection.commit();
      
      res.status(201).json({
        success: true,
        message: 'Transaction audit created successfully and quantities updated',
        data: { id }
      });
    } catch (error) {
      // Rollback on error
      await connection.rollback();
      throw error;
    } finally {
      // Release connection back to pool
      connection.release();
    }
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
