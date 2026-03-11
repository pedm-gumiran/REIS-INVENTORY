import React, { useState, useEffect } from 'react';
import Card from '../../components/cards/Card';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../../components/Forms/Edit_Forms/DeleteConfirmationModal';

export default function Backup_Restore_Page() {
  const [backupType, setBackupType] = useState('full');
  const [restoreFile, setRestoreFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [understandRisks, setUnderstandRisks] = useState(false);
  const [createBackupBeforeRestore, setCreateBackupBeforeRestore] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [backupToDelete, setBackupToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Reset scroll position to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch backups
  useEffect(() => {
    fetchBackups();
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


  const handleBackup = async () => {
    try {
      setIsProcessing(true);
      const response = await axiosInstance.post('/backup-restore/backup', {
        backupType
      });
      
      if (response.data.success) {
        toast.success(`Backup created successfully! File: ${response.data.backup.filename}`);
        await fetchBackups();
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

  // Check if restore form is valid
  const isRestoreFormValid = () => {
    return (restoreFile || selectedBackup) && understandRisks;
  };

  const handleDeleteBackup = (filename) => {
    setBackupToDelete(filename);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteBackup = async (selectedItems) => {
    if (!selectedItems || selectedItems.length === 0) return;
    
    setIsDeleting(true);
    try {
      const filename = Array.isArray(selectedItems) ? selectedItems[0] : selectedItems;
      const response = await axiosInstance.delete(`/backup-restore/backup/${filename}`);
      if (response.data.success) {
        toast.success('Backup deleted successfully');
        await fetchBackups();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete backup');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setBackupToDelete(null);
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup Type
              </label>
              <select 
                value={backupType} 
                onChange={(e) => setBackupType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="full">📦 Full Backup - All data</option>
                <option value="incremental">🔄 Incremental Backup - Recent changes only</option>
              </select>
            </div>

            <button
              onClick={handleBackup}
              disabled={isProcessing}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium cursor-pointer"
            >
              {isProcessing ? '⏳ Creating Backup...' : '🚀 Create Backup Now'}
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
              <div className="relative">
                <input
                  type="file"
                  accept=".bak,.backup,.zip,.json"
                  onChange={(e) => setRestoreFile(e.target.files[0])}
                  className="hidden"
                  id="backup-file-input"
                />
                <label
                  htmlFor="backup-file-input"
                  className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all duration-200 bg-white"
                >
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-3"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 16m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {restoreFile ? (
                      <div>
                        <p className="text-sm font-medium text-green-600">
                          {restoreFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(restoreFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Supported formats: .bak, .backup, .zip, .json
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
              {restoreFile && (
                <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-green-700 font-medium">
                      File selected: {restoreFile.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRestoreFile(null)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
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
              <label className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={createBackupBeforeRestore}
                  onChange={(e) => setCreateBackupBeforeRestore(e.target.checked)}
                  className="mr-3 mt-1" 
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-blue-800 block">
                    🛡️ Create backup before restore
                  </span>
                  <span className="text-xs text-blue-600 block mt-1">
                    Automatically backs up current data before restoring. This creates a safety net in case the restore fails or causes issues.
                  </span>
                </div>
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
              disabled={isProcessing || !isRestoreFormValid()}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
                isRestoreFormValid()
                  ? 'bg-orange-600 text-white hover:bg-orange-700 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isProcessing ? '⏳ Restoring...' : '🔄 Restore'}
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
                          className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                        >
                          Download
                        </button>
                        <button 
                          onClick={() => handleDeleteBackup(backup.filename)}
                          className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteBackup}
        selectedItems={backupToDelete ? [backupToDelete] : []}
        title="Delete Backup"
        confirmButtonText="Delete Backup"
        isLoading={isDeleting}
      />
    </div>
  );
}
