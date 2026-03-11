const express = require('express');
const router = express.Router();
const {
  getLowStockNotifications,
  getNotificationCount
} = require('../controllers/notificationController');

// GET all low stock notifications
router.get('/low-stock', getLowStockNotifications);

// GET notification count for badge
router.get('/count', getNotificationCount);

// DEBUG: Test endpoint to check database connection
router.get('/debug', async (req, res) => {
  try {
    const db = require('../config/db');
    const Consumable = require('../models/consumableModel');
    
    // Test the fixed low stock query
    const [lowStockItems] = await db.execute('SELECT * FROM consumable_products WHERE quantity <= 10 ORDER BY quantity ASC');
    
    // Get all consumables for comparison
    const allConsumables = await Consumable.getAllConsumables();
    
    res.status(200).json({
      success: true,
      data: {
        totalConsumables: allConsumables.length,
        lowStockCount: lowStockItems.length,
        lowStockItems: lowStockItems.map(item => ({
          product_id: item.product_id,
          name: item.item_description,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          isLowStock: item.quantity <= 10,
          isCritical: item.quantity <= 5
        })),
        allItems: allConsumables.map(item => ({
          product_id: item.product_id,
          name: item.item_description,
          quantity: item.quantity,
          isLowStock: item.quantity <= 10
        }))
      }
    });
  } catch (err) {
    console.error('Debug endpoint error:', err);
    res.status(500).json({
      success: false,
      message: 'Debug endpoint failed',
      error: err.message
    });
  }
});

module.exports = router;
