const Consumable = require('../models/consumableModel');

// GET all consumables
exports.getConsumables = async (req, res) => {
  try {
    const consumables = await Consumable.getAllConsumables();
    res.status(200).json({
      success: true,
      data: consumables
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consumables'
    });
  }
};

// GET single consumable by ID
exports.getConsumableById = async (req, res) => {
  try {
    const { id } = req.params;
    const consumable = await Consumable.getConsumableById(id);
    
    if (!consumable) {
      return res.status(404).json({
        success: false,
        message: 'Consumable not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: consumable
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consumable'
    });
  }
};

// CREATE new consumable
exports.createConsumable = async (req, res) => {
  try {
    const { product_id, item_description, category, unit, quantity, unit_cost } = req.body;
    
    // Validate required fields
    if (!product_id || !item_description || quantity === undefined || unit_cost === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, item description, quantity, and unit cost are required'
      });
    }
    
    // Check if product_id already exists
    const existing = await Consumable.getConsumableById(product_id);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Product ID already exists'
      });
    }
    
    // Convert undefined values to null for database
    const safeCategory = category !== undefined ? category : null;
    const safeUnit = unit !== undefined ? unit : null;
    const safeQuantity = parseInt(quantity) || 0;
    const safeUnitCost = parseFloat(unit_cost) || 0;
    
    const id = await Consumable.createConsumable(product_id, item_description, safeCategory, safeUnit, safeQuantity, safeUnitCost);
    
    res.status(201).json({
      success: true,
      message: 'Consumable created successfully',
      data: { id }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to create consumable'
    });
  }
};

// UPDATE consumable
exports.updateConsumable = async (req, res) => {
  try {
    const { id } = req.params;
    const { item_description, category, unit, quantity, unit_cost } = req.body;
    
    // Check if consumable exists
    const existingConsumable = await Consumable.getConsumableById(id);
    if (!existingConsumable) {
      return res.status(404).json({
        success: false,
        message: 'Consumable not found'
      });
    }
    
    // Convert undefined values to null for database
    const safeCategory = category !== undefined ? category : null;
    const safeUnit = unit !== undefined ? unit : null;
    const safeQuantity = quantity !== undefined ? parseInt(quantity) || 0 : existingConsumable.quantity;
    const safeUnitCost = unit_cost !== undefined ? parseFloat(unit_cost) || 0 : existingConsumable.unit_cost;
    
    const result = await Consumable.updateConsumable(id, item_description, safeCategory, safeUnit, safeQuantity, safeUnitCost);
    
    if (result === 0) {
      return res.status(400).json({
        success: false,
        message: 'No changes made to consumable'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Consumable updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to update consumable'
    });
  }
};

// DELETE consumable
exports.deleteConsumable = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if consumable exists
    const existingConsumable = await Consumable.getConsumableById(id);
    if (!existingConsumable) {
      return res.status(404).json({
        success: false,
        message: 'Consumable not found'
      });
    }
    
    const result = await Consumable.deleteConsumable(id);
    
    if (result === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete consumable'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Consumable deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete consumable'
    });
  }
};

// UPDATE consumable quantity
exports.updateConsumableQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }
    
    // Check if consumable exists
    const existingConsumable = await Consumable.getConsumableById(id);
    if (!existingConsumable) {
      return res.status(404).json({
        success: false,
        message: 'Consumable not found'
      });
    }
    
    const result = await Consumable.updateConsumableQuantity(id, quantity);
    
    if (result === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update quantity'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Quantity updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to update quantity'
    });
  }
};

// GET low stock consumables
exports.getLowStockConsumables = async (req, res) => {
  try {
    const lowStockItems = await Consumable.getLowStockConsumables();
    res.status(200).json({
      success: true,
      data: lowStockItems
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch low stock items'
    });
  }
};
