const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

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
  // This would typically fetch from your database
  // For now, we'll simulate with sample data structure matching REIMS inventory tables
  return {
    consumable_products: [
      { 
        product_id: 'CP001', 
        item_description: 'Office Paper A4 Premium', 
        category: 'Office Supplies', 
        unit: 'ream', 
        quantity: 100, 
        unit_cost: 250.00, 
        total_cost: 25000.00, 
        status: 'In Stock',
        created_at: '2024-01-01 10:00:00',
        updated_at: '2024-01-15 14:30:00'
      },
      // Add more consumable product data
    ],
    non_consumable_products: [
      { 
        product_id: 'EQ001', 
        item_description: 'Dell Laptop Latitude 7420', 
        category: 'Computers', 
        unit: 'unit', 
        quantity: 5, 
        unit_cost: 45000.00, 
        total_cost: 225000.00, 
        status: 'Available',
        created_at: '2024-01-01 10:00:00',
        updated_at: '2024-01-15 14:30:00'
      },
      // Add more non-consumable product data
    ],
    equipment_trail: [
      { 
        et_id: 1,
        client_name: 'ABC Corporation', 
        product_id: 'EQ001', 
        item_description: 'Dell Laptop Latitude 7420', 
        borrowed_quantity: 2, 
        borrowed_date: '2024-01-10 09:00:00',
        returned_quantity: 2, 
        returned_date: '2024-01-15 16:30:00',
        returned_notes: 'Equipment in good condition, all accessories returned',
        inspected_by: 'Mike Johnson'
      },
      // Add more equipment trail data
    ],
    transaction_trail: [
      { 
        transaction_id: 1,
        rrf_no: 'RRF-2024-001',
        type_of_request: 'Issue', 
        items_requested: 'Office Paper A4 Premium - 5 reams', 
        date_of_activity: '2024-01-15',
        start_time: '09:30:00',
        end_time: '09:45:00',
        purpose: 'Monthly office supplies replenishment',
        requested_by: 'John Doe', 
        approved_by: 'Jane Smith',
        served_by: 'Mike Johnson',
        received_by: 'Sarah Lee',
        transaction_date: '2024-01-15 09:45:00'
      },
      // Add more transaction trail data
    ],
    users: [
      { 
        user_id: 1,
        first_name: 'John', 
        last_name: 'Doe', 
        email: 'john.doe@company.com',
        password: 'hashed_password_here'
      },
      // Add more user data
    ]
  };
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
    
    // Here you would typically restore the data to your database
    // For this example, we'll simulate the restore process
    
    const restoreResults = {
      consumable_products: backup.data.consumable_products?.length || 0,
      non_consumable_products: backup.data.non_consumable_products?.length || 0,
      equipment_trail: backup.data.equipment_trail?.length || 0,
      transaction_trail: backup.data.transaction_trail?.length || 0,
      users: backup.data.users?.length || 0,
      totalRecords: backup.metadata.totalRecords
    };
    
    res.json({
      success: true,
      message: 'Restore completed successfully',
      restore: {
        timestamp: new Date().toISOString(),
        backupFile: filename,
        recordsRestored: restoreResults,
        type: backup.type
      }
    });
    
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
