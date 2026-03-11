const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

// Import database models
const Consumable = require('../models/consumableModel');
const NonConsumable = require('../models/nonConsumableModel');
const User = require('../models/userModel');

// Backup directory
const BACKUP_DIR = path.join(__dirname, '../backups');

// Ensure backup directory exists
const ensureBackupDir = async () => {
  try {
    await fs.access(BACKUP_DIR);
  } catch (error) {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }
};

// Get all data for backup
const getAllData = async () => {
  try {
    // Fetch real data from database
    const consumable_products = await Consumable.getAllConsumables();
    const non_consumable_products = await NonConsumable.getAllNonConsumables();
    
    return {
      consumable_products,
      non_consumable_products,
      // Add other data as needed
      users: [], // You might want to implement user backup separately
      equipment_trail: [], // Implement if you have equipment trail
      transaction_trail: [] // Implement if you have transaction trail
    };
  } catch (error) {
    console.error('Error getting backup data:', error);
    throw error;
  }
};

// Create backup
router.post('/backup', async (req, res) => {
  try {
    await ensureBackupDir();
    
    const { backupType = 'full' } = req.body;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_${backupType}_${timestamp}.json`;
    const filepath = path.join(BACKUP_DIR, filename);
    
    // Get all data
    const allData = await getAllData();
    
    // Create backup object
    const backup = {
      type: backupType,
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: allData,
      metadata: {
        totalRecords: Object.values(allData).reduce((sum, arr) => sum + arr.length, 0),
        tables: Object.keys(allData),
        size: JSON.stringify(allData).length
      }
    };
    
    // Write backup file
    await fs.writeFile(filepath, JSON.stringify(backup, null, 2));
    
    // Get file stats
    const stats = await fs.stat(filepath);
    
    res.json({
      success: true,
      message: 'Backup created successfully',
      backup: {
        filename,
        size: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
        timestamp: backup.timestamp,
        type: backupType,
        records: backup.metadata.totalRecords
      }
    });
    
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Backup failed',
      error: error.message
    });
  }
});

// Get backup list
router.get('/backups', async (req, res) => {
  try {
    await ensureBackupDir();
    
    const files = await fs.readdir(BACKUP_DIR);
    const backups = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filepath = path.join(BACKUP_DIR, file);
        const stats = await fs.stat(filepath);
        
        // Read backup metadata
        const content = await fs.readFile(filepath, 'utf8');
        const backup = JSON.parse(content);
        
        backups.push({
          id: file,
          filename: file,
          date: new Date(backup.timestamp).toLocaleDateString(),
          time: new Date(backup.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: backup.type,
          size: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
          status: 'Completed',
          timestamp: backup.timestamp,
          records: backup.metadata.totalRecords
        });
      }
    }
    
    // Sort by date (newest first)
    backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({
      success: true,
      data: backups
    });
    
  } catch (error) {
    console.error('Get backups error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get backups',
      error: error.message
    });
  }
});

// Download backup
router.get('/backup/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(BACKUP_DIR, filename);
    
    // Check if file exists
    await fs.access(filepath);
    
    // Send file
    res.download(filepath, filename);
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(404).json({
      success: false,
      message: 'Backup file not found'
    });
  }
});

// Restore from backup
router.post('/restore', async (req, res) => {
  try {
    const { filename, createBackupBeforeRestore = true } = req.body;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Backup filename is required'
      });
    }
    
    const filepath = path.join(BACKUP_DIR, filename);
    
    // Check if file exists
    await fs.access(filepath);
    
    // Create backup before restore if requested
    if (createBackupBeforeRestore) {
      const preRestoreTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const preRestoreFilename = `pre_restore_backup_${preRestoreTimestamp}.json`;
      const preRestoreFilepath = path.join(BACKUP_DIR, preRestoreFilename);
      
      const currentData = await getAllData();
      const preRestoreBackup = {
        type: 'pre-restore',
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: currentData,
        metadata: {
          totalRecords: Object.values(currentData).reduce((sum, arr) => sum + arr.length, 0),
          tables: Object.keys(currentData),
          note: 'Automatic backup created before restore operation'
        }
      };
      
      await fs.writeFile(preRestoreFilepath, JSON.stringify(preRestoreBackup, null, 2));
    }
    
    // Read backup file
    const backupContent = await fs.readFile(filepath, 'utf8');
    const backup = JSON.parse(backupContent);
    
    // Validate backup format
    if (!backup.data || !backup.metadata) {
      return res.status(400).json({
        success: false,
        message: 'Invalid backup file format'
      });
    }
    
    // Perform actual database restore
    const restoreResults = {
      consumable_products: 0,
      non_consumable_products: 0,
      users: 0,
      totalRecords: 0,
      errors: []
    };
    
    try {
      // Clear existing data (optional - you might want to make this configurable)
      // For now, we'll add/replace existing data
      
      // Restore consumable products
      if (backup.data.consumable_products && Array.isArray(backup.data.consumable_products)) {
        for (const product of backup.data.consumable_products) {
          try {
            // Check if product already exists
            const existing = await Consumable.getConsumableById(product.product_id);
            if (existing) {
              // Update existing product
              await Consumable.updateConsumable(
                product.product_id,
                product.item_description,
                product.category,
                product.unit,
                product.quantity,
                product.unit_cost
              );
            } else {
              // Create new product
              await Consumable.createConsumable(
                product.product_id,
                product.item_description,
                product.category,
                product.unit,
                product.quantity,
                product.unit_cost
              );
            }
            restoreResults.consumable_products++;
          } catch (error) {
            restoreResults.errors.push(`Failed to restore consumable product ${product.product_id}: ${error.message}`);
          }
        }
      }
      
      // Restore non-consumable products
      if (backup.data.non_consumable_products && Array.isArray(backup.data.non_consumable_products)) {
        for (const product of backup.data.non_consumable_products) {
          try {
            // Check if product already exists
            const existing = await NonConsumable.getNonConsumableById(product.product_id);
            if (existing) {
              // Update existing product
              await NonConsumable.updateNonConsumable(
                product.product_id,
                product.item_description,
                product.category,
                product.unit,
                product.quantity,
                product.unit_cost,
                product.total_cost
              );
            } else {
              // Create new product
              await NonConsumable.createNonConsumable(
                product.product_id,
                product.item_description,
                product.category,
                product.unit,
                product.quantity,
                product.unit_cost,
                product.total_cost
              );
            }
            restoreResults.non_consumable_products++;
          } catch (error) {
            restoreResults.errors.push(`Failed to restore non-consumable product ${product.product_id}: ${error.message}`);
          }
        }
      }
      
      // Restore users (optional - be careful with passwords)
      if (backup.data.users && Array.isArray(backup.data.users)) {
        for (const user of backup.data.users) {
          try {
            // Note: You might want to skip password restoration or handle it differently
            // For security reasons, passwords should be reset rather than restored
            const userData = {
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email
              // Skip password restoration for security
            };
            // Implement user restore logic as needed
            restoreResults.users++;
          } catch (error) {
            restoreResults.errors.push(`Failed to restore user ${user.email}: ${error.message}`);
          }
        }
      }
      
      restoreResults.totalRecords = restoreResults.consumable_products + 
                                 restoreResults.non_consumable_products + 
                                 restoreResults.users;
      
      res.json({
        success: true,
        message: 'Restore completed successfully',
        restore: {
          timestamp: new Date().toISOString(),
          backupFile: filename,
          recordsRestored: restoreResults,
          type: backup.type,
          errors: restoreResults.errors
        }
      });
      
    } catch (error) {
      console.error('Database restore error:', error);
      res.status(500).json({
        success: false,
        message: 'Database restore failed',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Restore error:', error);
    res.status(500).json({
      success: false,
      message: 'Restore failed',
      error: error.message
    });
  }
});

// Delete backup
router.delete('/backup/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(BACKUP_DIR, filename);
    
    // Check if file exists
    await fs.access(filepath);
    
    // Delete file
    await fs.unlink(filepath);
    
    res.json({
      success: true,
      message: 'Backup deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete error:', error);
    res.status(404).json({
      success: false,
      message: 'Backup file not found'
    });
  }
});

// Get storage information
router.get('/storage-info', async (req, res) => {
  try {
    await ensureBackupDir();
    
    const files = await fs.readdir(BACKUP_DIR);
    let totalSize = 0;
    let backupCount = 0;
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filepath = path.join(BACKUP_DIR, file);
        const stats = await fs.stat(filepath);
        totalSize += stats.size;
        backupCount++;
      }
    }
    
    // Calculate retention (files older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    let oldFiles = 0;
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filepath = path.join(BACKUP_DIR, file);
        const stats = await fs.stat(filepath);
        if (stats.mtime < thirtyDaysAgo) {
          oldFiles++;
        }
      }
    }
    
    res.json({
      success: true,
      data: {
        totalStorageUsed: `${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB`,
        availableStorage: '10 GB', // This would come from your system
        backupFiles: backupCount,
        retentionPeriod: '30 days',
        oldFilesCount: oldFiles,
        autoCleanupEnabled: true
      }
    });
    
  } catch (error) {
    console.error('Storage info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get storage information',
      error: error.message
    });
  }
});

module.exports = router;
