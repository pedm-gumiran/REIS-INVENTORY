const express = require('express');
const router = express.Router();
const nonConsumableController = require('../controllers/nonConsumableController');

// GET /api/non-consumables - Get all non-consumables
router.get('/', nonConsumableController.getNonConsumables);

// GET /api/non-consumables/expiring-warranty - Get expiring warranty items
router.get('/expiring-warranty', nonConsumableController.getExpiringWarrantyItems);

// GET /api/non-consumables/location/:location - Get non-consumables by location
router.get('/location/:location', nonConsumableController.getNonConsumablesByLocation);

// GET /api/non-consumables/assigned/:assigned_to - Get non-consumables by assigned user
router.get('/assigned/:assigned_to', nonConsumableController.getNonConsumablesByAssignedUser);

// GET /api/non-consumables/:id - Get single non-consumable by ID
router.get('/:id', nonConsumableController.getNonConsumableById);

// POST /api/non-consumables - Create new non-consumable
router.post('/', nonConsumableController.createNonConsumable);

// PUT /api/non-consumables/:id - Update non-consumable
router.put('/:id', nonConsumableController.updateNonConsumable);

// PATCH /api/non-consumables/:id/condition - Update non-consumable condition
router.patch('/:id/condition', nonConsumableController.updateNonConsumableCondition);

// PATCH /api/non-consumables/:id/assignment - Update non-consumable assignment
router.patch('/:id/assignment', nonConsumableController.updateNonConsumableAssignment);

// PUT /api/non-consumables/:id/stock - Update non-consumable stock
router.put('/:id/stock', nonConsumableController.updateStock);

// DELETE /api/non-consumables/:id - Delete non-consumable
router.delete('/:id', nonConsumableController.deleteNonConsumable);

module.exports = router;
