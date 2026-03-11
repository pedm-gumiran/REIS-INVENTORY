import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotificationCount = async () => {
    try {
      setLoading(true);
      console.log('=== NOTIFICATION CONTEXT FETCH START ===');
      const response = await fetch('/api/notifications/count');
      const data = await response.json();
      
      console.log('Notification context received API response:', data);
      
      if (data.success) {
        console.log('Setting notification count to:', data.data.count);
        setNotificationCount(data.data.count);
      } else {
        console.error('API returned error:', data.message);
        setNotificationCount(0);
      }
      console.log('=== NOTIFICATION CONTEXT FETCH END ===');
    } catch (error) {
      console.error('Error fetching notification count:', error);
      setNotificationCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationCount();
    
    // Set up polling to refresh notification count every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const refetchNotifications = () => {
    console.log('Manual notification refresh triggered');
    fetchNotificationCount();
  };

  const value = {
    notificationCount,
    loading,
    refetchNotifications,
    fetchNotificationCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
