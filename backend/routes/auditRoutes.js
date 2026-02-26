const express = require('express');
const router = express.Router();
const {
  getEquipmentReturns,
  getTransactionAudits,
  createEquipmentReturn,
  createTransactionAudit,
  deleteTransactionAudit,
  deleteAllTransactionAudits,
  deleteAllEquipmentReturns
} = require('../controllers/auditController');

// Equipment Returns routes
router.get('/equipment-returns', getEquipmentReturns);
router.post('/equipment-returns', createEquipmentReturn);
router.delete('/equipment-returns', deleteAllEquipmentReturns);

// Transaction Audit routes
router.get('/transaction-audits', getTransactionAudits);
router.post('/transaction-audits', createTransactionAudit);
router.delete('/transaction-audits/:id', deleteTransactionAudit);
router.delete('/transaction-audits', deleteAllTransactionAudits);

module.exports = router;
