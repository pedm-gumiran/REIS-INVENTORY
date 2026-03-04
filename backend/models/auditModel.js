const db = require('../config/db');
const nonConsumableModel = require('./nonConsumableModel');

/* Equipment Audit/Returns */
exports.getAllEquipmentReturns = async () => {
  const [rows] = await db.execute(
    'SELECT *, DATE_FORMAT(borrowed_date, "%Y-%m-%d") as borrowed_date_only, DATE_FORMAT(borrowed_date, "%h:%i:%s %p") as borrowed_time, IFNULL(DATE_FORMAT(returned_date, "%Y-%m-%d"), "-") as returned_date_only, IFNULL(DATE_FORMAT(returned_date, "%h:%i:%s %p"), "-") as returned_time FROM equipment_trail ORDER BY borrowed_date DESC'
  );
  
  // Format the data to include the separated date and time fields
  return rows.map(row => ({
    ...row,
    borrowed_date: row.borrowed_date_only,
    borrowed_time: row.borrowed_time || '-',
    returned_date: row.returned_date_only,
    returned_time: row.returned_time
  }));
};

exports.getEquipmentReturnById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM equipment_trail WHERE et_id = ?', [id]);
  return rows[0];
};

exports.getBorrowedEquipmentByClient = async (clientName) => {
  const [rows] = await db.execute(
    'SELECT *, DATE_FORMAT(borrowed_date, "%Y-%m-%d") as borrowed_date_only, DATE_FORMAT(borrowed_date, "%h:%i:%s %p") as borrowed_time, IFNULL(DATE_FORMAT(returned_date, "%Y-%m-%d"), "-") as returned_date_only, IFNULL(DATE_FORMAT(returned_date, "%h:%i:%s %p"), "-") as returned_time FROM equipment_trail WHERE client_name LIKE ? AND (returned_quantity IS NULL OR returned_quantity = 0 OR returned_date IS NULL OR returned_notes = "" OR inspected_by = "") ORDER BY borrowed_date DESC',
    [`%${clientName}%`]
  );
  
  // Format the data to include the separated date and time fields
  return rows.map(row => ({
    ...row,
    borrowed_date: row.borrowed_date_only,
    borrowed_time: row.borrowed_time || '-',
    returned_date: row.returned_date_only,
    returned_time: row.returned_time
  }));
};

exports.searchClients = async (query) => {
  const [rows] = await db.execute(
    'SELECT DISTINCT client_name as name FROM equipment_trail WHERE client_name LIKE ? ORDER BY client_name LIMIT 10',
    [`%${query}%`]
  );
  return rows;
};

exports.createEquipmentReturn = async (returnId, clientName, productId, itemDescription, borrowedQuantity, borrowedDate) => {
  const [result] = await db.execute(
    'INSERT INTO equipment_trail (client_name, product_id, item_description, borrowed_quantity, borrowed_date, returned_quantity, returned_date, returned_notes, inspected_by) VALUES (?, ?, ?, ?, ?, NULL, NULL, NULL, NULL)',
    [clientName, productId, itemDescription, borrowedQuantity, borrowedDate]
  );
  return result.insertId;
};

exports.updateEquipmentReturn = async (etId, returnedQuantity, returnedNotes, inspectedBy) => {
  console.log('Model updateEquipmentReturn called with:');
  console.log('etId:', etId);
  console.log('returnedQuantity:', returnedQuantity);
  console.log('returnedNotes:', returnedNotes);
  console.log('inspectedBy:', inspectedBy);
  
  try {
    // Get the equipment trail record to find the product_id
    const [equipmentRecord] = await db.execute(
      'SELECT product_id FROM equipment_trail WHERE et_id = ?',
      [etId]
    );
    
    if (equipmentRecord.length === 0) {
      throw new Error('Equipment trail record not found');
    }
    
    const productId = equipmentRecord[0].product_id;
    
    // Update equipment_trail table
    const [result] = await db.execute(
      'UPDATE equipment_trail SET returned_quantity = ?,returned_date = NOW(), returned_notes = ?, inspected_by = ? WHERE et_id = ?',
      [returnedQuantity, returnedNotes, inspectedBy, etId]
    );
    
    // Add returned quantity to non_consumable_products table
    if (productId && returnedQuantity > 0) {
      const updateResult = await nonConsumableModel.addReturnedQuantity(productId, returnedQuantity);
      console.log('Non-consumable quantity update result:', updateResult);
    }
    
    console.log('SQL update result:', result);
    return result.affectedRows;
  } catch (error) {
    console.error('Error in updateEquipmentReturn:', error);
    throw error;
  }
};

/* Transaction Audit */
exports.getAllTransactionAudits = async () => {
  const [rows] = await db.execute('SELECT * FROM transaction_trail ORDER BY transaction_id DESC');
  return rows;
};

exports.getTransactionAuditById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM transaction_trail WHERE transaction_id = ?', [id]);
  return rows[0];
};

exports.createTransactionAudit = async (transactionId, rrfNo, typeOfRequest, itemsRequested, dateOfActivity, startTime, endTime, purpose, requestedBy, approvedBy, servedBy, receivedBy, transactionDate, connection = db) => {
  const [result] = await connection.execute(
    'INSERT INTO transaction_trail (rrf_no, type_of_request, items_requested, date_of_activity, start_time, end_time, purpose, requested_by, approved_by, served_by, received_by, transaction_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [rrfNo, typeOfRequest, itemsRequested, dateOfActivity, startTime, endTime, purpose, requestedBy, approvedBy, servedBy, receivedBy, transactionDate]
  );
  return result.insertId;
};

/* Delete transaction audit */
exports.deleteTransactionAudit = async (id) => {
  const [result] = await db.execute('DELETE FROM transaction_trail WHERE transaction_id = ?', [id]);
  return result.affectedRows;
};

/* Delete all transaction audits */
exports.deleteAllTransactionAudits = async () => {
  const [result] = await db.execute('DELETE FROM transaction_trail');
  return result.affectedRows;
};

/* Delete equipment return */
exports.deleteEquipmentReturn = async (id) => {
  const [result] = await db.execute('DELETE FROM equipment_trail WHERE et_id = ?', [id]);
  return result.affectedRows;
};

/* Delete all equipment returns */
exports.deleteAllEquipmentReturns = async () => {
  const [result] = await db.execute('DELETE FROM equipment_trail');
  return result.affectedRows;
};
