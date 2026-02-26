const NonConsumable = require('../models/nonConsumableModel');

// GET all non-consumables
exports.getNonConsumables = async (req, res) => {
  try {
    const nonConsumables = await NonConsumable.getAllNonConsumables();
    res.status(200).json({
      success: true,
      data: nonConsumables
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch non-consumables'
    });
  }
};

// GET single non-consumable by ID
exports.getNonConsumableById = async (req, res) => {
  try {
    const { id } = req.params;
    const nonConsumable = await NonConsumable.getNonConsumableById(id);
    
    if (!nonConsumable) {
      return res.status(404).json({
        success: false,
        message: 'Non-consumable not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: nonConsumable
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch non-consumable'
    });
  }
};

// CREATE new non-consumable
exports.createNonConsumable = async (req, res) => {
  try {
    const { item_description, category, unit, quantity, unit_cost, status } = req.body;
    
    // Validate required fields
    if (!item_description) {
      return res.status(400).json({
        success: false,
        message: 'Item description is required'
      });
    }
    
    // Ensure all values are properly defined (not undefined)
    const safeCategory = category !== undefined ? category : 'Equipment';
    const safeUnit = unit !== undefined ? unit : 'per unit';
    const safeQuantity = quantity !== undefined ? quantity : 1;
    const safeUnitCost = unit_cost !== undefined ? unit_cost : 0;
    const safeStatus = status !== undefined ? status : 'Available';
    
    // Calculate total cost
    const total_cost = (safeQuantity || 0) * (safeUnitCost || 0);
    
    const id = await NonConsumable.createNonConsumable(
      item_description,
      safeCategory,
      safeUnit,
      safeQuantity,
      safeUnitCost,
      total_cost,
      safeStatus
    );
    
    res.status(201).json({
      success: true,
      message: 'Non-consumable created successfully',
      data: { id }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to create non-consumable'
    });
  }
};

// UPDATE non-consumable
exports.updateNonConsumable = async (req, res) => {
  try {
    const { id } = req.params;
    const { item_description, category, unit, quantity, unit_cost, status } = req.body;
    
    // Check if non-consumable exists
    const existingNonConsumable = await NonConsumable.getNonConsumableById(id);
    if (!existingNonConsumable) {
      return res.status(404).json({
        success: false,
        message: 'Non-consumable not found'
      });
    }
    
    // Ensure all values are properly defined (not undefined)
    const safeItemDescription = item_description !== undefined ? item_description : existingNonConsumable.item_description;
    const safeCategory = category !== undefined ? category : existingNonConsumable.category;
    const safeUnit = unit !== undefined ? unit : existingNonConsumable.unit;
    const safeQuantity = quantity !== undefined ? quantity : existingNonConsumable.quantity;
    const safeUnitCost = unit_cost !== undefined ? unit_cost : existingNonConsumable.unit_cost;
    const safeStatus = status !== undefined ? status : existingNonConsumable.status;
    
    // Calculate total cost
    const total_cost = (safeQuantity || 0) * (safeUnitCost || 0);
    
    const result = await NonConsumable.updateNonConsumable(
      id,
      safeItemDescription,
      safeCategory,
      safeUnit,
      safeQuantity,
      safeUnitCost,
      total_cost,
      safeStatus
    );
    
    if (result === 0) {
      return res.status(400).json({
        success: false,
        message: 'No changes made to non-consumable'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Non-consumable updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to update non-consumable'
    });
  }
};

// DELETE non-consumable
exports.deleteNonConsumable = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if non-consumable exists
    const existingNonConsumable = await NonConsumable.getNonConsumableById(id);
    if (!existingNonConsumable) {
      return res.status(404).json({
        success: false,
        message: 'Non-consumable not found'
      });
    }
    
    const result = await NonConsumable.deleteNonConsumable(id);
    
    if (result === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete non-consumable'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Non-consumable deleted successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete non-consumable'
    });
  }
};

// UPDATE non-consumable condition
exports.updateNonConsumableCondition = async (req, res) => {
  try {
    const { id } = req.params;
    const { condition } = req.body;
    
    if (!condition) {
      return res.status(400).json({
        success: false,
        message: 'Condition is required'
      });
    }
    
    // Check if non-consumable exists
    const existingNonConsumable = await NonConsumable.getNonConsumableById(id);
    if (!existingNonConsumable) {
      return res.status(404).json({
        success: false,
        message: 'Non-consumable not found'
      });
    }
    
    const result = await NonConsumable.updateNonConsumableCondition(id, condition);
    
    if (result === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update condition'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Condition updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to update condition'
    });
  }
};

// UPDATE non-consumable assignment
exports.updateNonConsumableAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_to } = req.body;
    
    // Check if non-consumable exists
    const existingNonConsumable = await NonConsumable.getNonConsumableById(id);
    if (!existingNonConsumable) {
      return res.status(404).json({
        success: false,
        message: 'Non-consumable not found'
      });
    }
    
    const result = await NonConsumable.updateNonConsumableAssignment(id, assigned_to);
    
    if (result === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update assignment'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to update assignment'
    });
  }
};

// GET non-consumables by location
exports.getNonConsumablesByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    
    if (!location) {
      return res.status(400).json({
        success: false,
        message: 'Location is required'
      });
    }
    
    const nonConsumables = await NonConsumable.getNonConsumablesByLocation(location);
    res.status(200).json({
      success: true,
      data: nonConsumables
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch non-consumables by location'
    });
  }
};

// GET non-consumables by assigned user
exports.getNonConsumablesByAssignedUser = async (req, res) => {
  try {
    const { assigned_to } = req.params;
    
    if (!assigned_to) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user is required'
      });
    }
    
    const nonConsumables = await NonConsumable.getNonConsumablesByAssignedUser(assigned_to);
    res.status(200).json({
      success: true,
      data: nonConsumables
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch non-consumables by assigned user'
    });
  }
};

// GET expiring warranty items
exports.getExpiringWarrantyItems = async (req, res) => {
  try {
    const { days } = req.query;
    const daysParam = days ? parseInt(days) : 30;
    
    const expiringItems = await NonConsumable.getExpiringWarrantyItems(daysParam);
    res.status(200).json({
      success: true,
      data: expiringItems
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expiring warranty items'
    });
  }
};
