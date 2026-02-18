import React, { useState } from 'react';
import Card from '../../components/cards/Card';

export default function Backup_Restore_Page() {
  const [backupType, setBackupType] = useState('full');
  const [restoreFile, setRestoreFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBackup = async () => {
    setIsProcessing(true);
    // Simulate backup process
    setTimeout(() => {
      setIsProcessing(false);
      alert('Backup completed successfully!');
    }, 3000);
  };

  const handleRestore = async () => {
    if (!restoreFile) {
      alert('Please select a backup file to restore');
      return;
    }
    setIsProcessing(true);
    // Simulate restore process
    setTimeout(() => {
      setIsProcessing(false);
      alert('Restore completed successfully!');
    }, 3000);
  };

  const recentBackups = [
    { id: 1, date: '2024-01-15', time: '02:00 AM', type: 'Full', size: '245 MB', status: 'Completed' },
    { id: 2, date: '2024-01-14', time: '02:00 AM', type: 'Full', size: '242 MB', status: 'Completed' },
    { id: 3, date: '2024-01-13', time: '02:00 AM', type: 'Full', size: '238 MB', status: 'Completed' },
    { id: 4, date: '2024-01-12', time: '02:00 AM', type: 'Incremental', size: '15 MB', status: 'Completed' },
    { id: 5, date: '2024-01-11', time: '02:00 AM', type: 'Full', size: '235 MB', status: 'Failed' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div>
          <h1 className="text-3xl font-bold mb-2">Backup & Restore</h1>
          <p className="text-green-100">
            Manage system backups and restore data when needed.
          </p>
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
              <p className="text-sm text-blue-500">Estimated size: ~250 MB</p>
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
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">I understand the risks and want to proceed</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Create backup before restore</span>
              </label>
            </div>

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
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentBackups.map((backup) => (
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
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      backup.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {backup.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Download</button>
                      {backup.status === 'Completed' && (
                        <button className="text-green-600 hover:text-green-800 text-sm">Restore</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Storage Information */}
      <Card title="Storage Information">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Storage Used</p>
            <p className="text-2xl font-bold text-gray-900">1.2 GB</p>
            <p className="text-xs text-gray-500">Of 10 GB available</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Backup Files</p>
            <p className="text-2xl font-bold text-gray-900">24</p>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Retention Period</p>
            <p className="text-2xl font-bold text-gray-900">30 days</p>
            <p className="text-xs text-gray-500">Auto-cleanup enabled</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
