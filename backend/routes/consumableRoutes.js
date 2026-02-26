const express = require('express');
const router = express.Router();
const consumableController = require('../controllers/consumableController');

// GET /api/consumables - Get all consumables
router.get('/', consumableController.getConsumables);

// GET /api/consumables/low-stock - Get low stock consumables
router.get('/low-stock', consumableController.getLowStockConsumables);

// GET /api/consumables/:id - Get single consumable by ID
router.get('/:id', consumableController.getConsumableById);

// POST /api/consumables - Create new consumable
router.post('/', consumableController.createConsumable);

// PUT /api/consumables/:id - Update consumable
router.put('/:id', consumableController.updateConsumable);

// PATCH /api/consumables/:id/quantity - Update consumable quantity
router.patch('/:id/quantity', consumableController.updateConsumableQuantity);

// DELETE /api/consumables/:id - Delete consumable
router.delete('/:id', consumableController.deleteConsumable);

module.exports = router;
