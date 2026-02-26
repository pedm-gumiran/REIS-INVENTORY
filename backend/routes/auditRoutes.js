const express = require('express');
const router = express.Router();
const {
  getEquipmentReturns,
  getTransactionAudits,
  createEquipmentReturn,
  createTransactionAudit
} = require('../controllers/auditController');

// Equipment Returns routes
router.get('/equipment-returns', getEquipmentReturns);
router.post('/equipment-returns', createEquipmentReturn);

// Transaction Audit routes
router.get('/transaction-audits', getTransactionAudits);
router.post('/transaction-audits', createTransactionAudit);

module.exports = router;
