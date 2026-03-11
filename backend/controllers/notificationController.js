const Consumable = require('../models/consumableModel');

// GET all low stock notifications
exports.getLowStockNotifications = async (req, res) => {
  try {
    // Get low stock consumables only (quantity <= 10)
    const lowStockConsumables = await Consumable.getLowStockConsumables();
    
    // Format data for frontend
    const formattedConsumables = lowStockConsumables.map(item => ({
      id: item.product_id,
      name: item.item_description,
      type: 'Consumable',
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      threshold: 10 // Fixed threshold
    }));
    
    // Only return consumables since non-consumables don't get low stock
    const allNotifications = formattedConsumables;
    
    // Sort by quantity
    allNotifications.sort((a, b) => a.quantity - b.quantity);
    
    res.status(200).json({
      success: true,
      data: {
        notifications: allNotifications,
        totalCount: allNotifications.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

// GET notification count only (for badge)
exports.getNotificationCount = async (req, res) => {
  try {
    console.log('=== NOTIFICATION COUNT DEBUG START ===');
    // Get low stock consumables only
    const lowStockConsumables = await Consumable.getLowStockConsumables();
    
    console.log('Low stock consumables found:', lowStockConsumables.length);
    console.log('Low stock items details:', lowStockConsumables.map(item => ({
      name: item.item_description,
      quantity: item.quantity,
      isLowStock: item.quantity <= 10
    })));
    
    const totalCount = lowStockConsumables.length;
    
    console.log('Final total count:', totalCount);
    console.log('=== NOTIFICATION COUNT DEBUG END ===');
    
    res.status(200).json({
      success: true,
      data: {
        count: totalCount
      }
    });
  } catch (err) {
    console.error('Error in getNotificationCount:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification count'
    });
  }
};
