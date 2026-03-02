import React, { useState, useEffect } from 'react';
import Card from '../../components/cards/Card';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

export default function Backup_Restore_Page() {
  const [backupType, setBackupType] = useState('full');
  const [restoreFile, setRestoreFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [backups, setBackups] = useState([]);
  const [storageInfo, setStorageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [understandRisks, setUnderstandRisks] = useState(false);
  const [createBackupBeforeRestore, setCreateBackupBeforeRestore] = useState(true);

  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch backups and storage info
  useEffect(() => {
    fetchBackups();
    fetchStorageInfo();
  }, []);

  const fetchBackups = async () => {
    try {
      const response = await axiosInstance.get('/backup-restore/backups');
      if (response.data.success) {
        setBackups(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching backups:', error);
      toast.error('Failed to fetch backups');
    } finally {
      setLoading(false);
    }
  };

  const fetchStorageInfo = async () => {
    try {
      const response = await axiosInstance.get('/backup-restore/storage-info');
      if (response.data.success) {
        setStorageInfo(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching storage info:', error);
    }
  };

  const handleBackup = async () => {
    try {
      setIsProcessing(true);
      const response = await axiosInstance.post('/backup-restore/backup', {
        backupType
      });
      
      if (response.data.success) {
        toast.success(`Backup created successfully! File: ${response.data.backup.filename}`);
        await fetchBackups();
        await fetchStorageInfo();
      } else {
        toast.error('Backup failed');
      }
    } catch (error) {
      console.error('Backup error:', error);
      toast.error(error.response?.data?.message || 'Backup failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedBackup && !restoreFile) {
      toast.error('Please select a backup file to restore');
      return;
    }
    
    if (!understandRisks) {
      toast.error('Please acknowledge the risks before proceeding');
      return;
    }

    try {
      setIsProcessing(true);
      const filename = selectedBackup || restoreFile?.name;
      
      const response = await axiosInstance.post('/backup-restore/restore', {
        filename,
        createBackupBeforeRestore
      });
      
      if (response.data.success) {
        toast.success('Restore completed successfully!');
        await fetchBackups();
        await fetchStorageInfo();
        setSelectedBackup(null);
        setRestoreFile(null);
        setUnderstandRisks(false);
      } else {
        toast.error('Restore failed');
      }
    } catch (error) {
      console.error('Restore error:', error);
      toast.error(error.response?.data?.message || 'Restore failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadBackup = async (filename) => {
    try {
      const response = await axiosInstance.get(`/backup-restore/backup/download/${filename}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Backup downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download backup');
    }
  };

  const handleRestoreFromBackup = (filename) => {
    setSelectedBackup(filename);
    setRestoreFile(null);
  };

  const handleDeleteBackup = async (filename) => {
    if (!window.confirm('Are you sure you want to delete this backup?')) {
      return;
    }
    
    try {
      const response = await axiosInstance.delete(`/backup-restore/backup/${filename}`);
      if (response.data.success) {
        toast.success('Backup deleted successfully');
        await fetchBackups();
        await fetchStorageInfo();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete backup');
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Backup & Restore</h1>
            <p className="text-green-100">
              Manage system backups and restore data when needed.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold">{formatTime(currentDateTime)}</div>
            <div className="text-green-100">{formatDate(currentDateTime)}</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup Section */}
        <Card title="Create Backup">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="full"
                    checked={backupType === 'full'}
                    onChange={(e) => setBackupType(e.target.value)}
                    className="mr-2"
                  />
                  <div>
                    <span className="font-medium">Full Backup</span>
                    <p className="text-sm text-gray-600">Complete system backup including all data</p>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="incremental"
                    checked={backupType === 'incremental'}
                    onChange={(e) => setBackupType(e.target.value)}
                    className="mr-2"
                  />
                  <div>
                    <span className="font-medium">Incremental Backup</span>
                    <p className="text-sm text-gray-600">Only changes since last backup</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup Schedule
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="daily">Daily at 2:00 AM</option>
                <option value="weekly">Weekly on Sunday</option>
                <option value="monthly">Monthly on 1st</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Next Scheduled Backup</h4>
              <p className="text-blue-600">Today at 2:00 AM (Full Backup)</p>
              <p className="text-sm text-blue-500">Estimated size: ~{storageInfo ? (parseFloat(storageInfo.totalStorageUsed) * 0.2).toFixed(2) : '250'} MB</p>
            </div>

            <button
              onClick={handleBackup}
              disabled={isProcessing}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Creating Backup...' : 'Create Backup Now'}
            </button>
          </div>
        </Card>

        {/* Restore Section */}
        <Card title="Restore from Backup">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Backup File
              </label>
              <input
                type="file"
                accept=".bak,.backup,.zip"
                onChange={(e) => setRestoreFile(e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: .bak, .backup, .zip
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Warning</h4>
              <p className="text-yellow-600 text-sm">
                Restoring from backup will overwrite current data. This action cannot be undone. 
                Please ensure you have a current backup before proceeding.
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={understandRisks}
                  onChange={(e) => setUnderstandRisks(e.target.checked)}
                  className="mr-2" 
                />
                <span className="text-sm">I understand the risks and want to proceed</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={createBackupBeforeRestore}
                  onChange={(e) => setCreateBackupBeforeRestore(e.target.checked)}
                  className="mr-2" 
                />
                <span className="text-sm">Create backup before restore</span>
              </label>
            </div>

            {selectedBackup && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  Selected backup: <strong>{selectedBackup}</strong>
                </p>
              </div>
            )}

            <button
              onClick={handleRestore}
              disabled={isProcessing}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Restoring...' : 'Restore Backup'}
            </button>
          </div>
        </Card>
      </div>

      {/* Backup History */}
      <Card title="Backup History">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Size</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Records</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    Loading backups...
                  </td>
                </tr>
              ) : backups.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No backups found
                  </td>
                </tr>
              ) : (
                backups.map((backup) => (
                  <tr key={backup.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{backup.date}</td>
                    <td className="py-3 px-4">{backup.time}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded ${
                        backup.type === 'Full' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {backup.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">{backup.size}</td>
                    <td className="py-3 px-4">{backup.records || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded ${
                        backup.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {backup.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDownloadBackup(backup.filename)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Download
                        </button>
                        {backup.status === 'Completed' && (
                          <button 
                            onClick={() => handleRestoreFromBackup(backup.filename)}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Restore
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteBackup(backup.filename)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Storage Information */}
      <Card title="Storage Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Storage Used</p>
            <p className="text-2xl font-bold text-gray-900">{storageInfo?.totalStorageUsed || 'Loading...'}</p>
            <p className="text-xs text-gray-500">Of {storageInfo?.availableStorage || '10 GB'} available</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Backup Files</p>
            <p className="text-2xl font-bold text-gray-900">{storageInfo?.backupFiles || '0'}</p>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Retention Period</p>
            <p className="text-2xl font-bold text-gray-900">{storageInfo?.retentionPeriod || '30 days'}</p>
            <p className="text-xs text-gray-500">Auto-cleanup {storageInfo?.autoCleanupEnabled ? 'enabled' : 'disabled'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
