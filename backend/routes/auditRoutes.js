const express = require('express');
const router = express.Router();
const {
  getEquipmentReturns,
  getTransactionAudits,
  createEquipmentReturn,
  createTransactionAudit,
  deleteTransactionAudit,
  deleteAllTransactionAudits,
  deleteEquipmentReturn,
  deleteAllEquipmentReturns,
  getBorrowedEquipmentByClient,
  updateEquipmentReturn,
  searchClients
} = require('../controllers/auditController');

// Equipment Returns routes
router.get('/equipment-returns', getEquipmentReturns);
router.get('/equipment-returns/client/:clientName', getBorrowedEquipmentByClient);
router.get('/clients/search', searchClients);
router.post('/equipment-returns', createEquipmentReturn);
router.put('/equipment-returns/:id', updateEquipmentReturn);
router.delete('/equipment-returns/:id', deleteEquipmentReturn);
router.delete('/equipment-returns', deleteAllEquipmentReturns);

// Transaction Audit routes
router.get('/transaction-audits', getTransactionAudits);
router.post('/transaction-audits', createTransactionAudit);
router.delete('/transaction-audits/:id', deleteTransactionAudit);
router.delete('/transaction-audits', deleteAllTransactionAudits);

module.exports = router;
