import { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotificationCount = async () => {
    try {
      setLoading(true);
      console.log('=== FRONTEND NOTIFICATION DEBUG START ===');
      const response = await fetch('/api/notifications/count');
      const data = await response.json();
      
      console.log('Frontend received API response:', data);
      
      if (data.success) {
        console.log('Setting notification count to:', data.data.count);
        setNotificationCount(data.data.count);
      } else {
        console.error('API returned error:', data.message);
        setNotificationCount(0);
      }
      console.log('=== FRONTEND NOTIFICATION DEBUG END ===');
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

  return {
    notificationCount,
    loading,
    refetch: fetchNotificationCount
  };
};
