const db = require('../config/db');

/* Equipment Audit/Returns */
exports.getAllEquipmentReturns = async () => {
  const [rows] = await db.execute('SELECT * FROM equipment_trail ORDER BY borrowed_date DESC');
  return rows;
};

exports.getEquipmentReturnById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM equipment_trail WHERE et_id = ?', [id]);
  return rows[0];
};

exports.createEquipmentReturn = async (returnId, clientName, productId, itemDescription, borrowedQuantity, borrowedDate, returnedQuantity, returnedDate, returnedNotes, inspectedBy) => {
  const [result] = await db.execute(
    'INSERT INTO equipment_trail (client_name, product_id, item_description, borrowed_quantity, borrowed_date, returned_quantity, returned_date, returned_notes, inspected_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [clientName, productId, itemDescription, borrowedQuantity, borrowedDate, returnedQuantity, returnedDate, returnedNotes, inspectedBy]
  );
  return result.insertId;
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

exports.createTransactionAudit = async (transactionId, rrfNo, typeOfRequest, itemsRequested, dateOfActivity, startTime, endTime, purpose, requestedBy, approvedBy, servedBy, receivedBy, transactionDate) => {
  const [result] = await db.execute(
    'INSERT INTO transaction_trail (rrf_no, type_of_request, items_requested, date_of_activity, start_time, end_time, purpose, requested_by, approved_by, served_by, received_by, transaction_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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

/* Delete all equipment returns */
exports.deleteAllEquipmentReturns = async () => {
  const [result] = await db.execute('DELETE FROM equipment_trail');
  return result.affectedRows;
};
