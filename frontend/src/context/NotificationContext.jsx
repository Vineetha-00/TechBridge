import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/users/dashboard-summary');
      if (res.data?.success && res.data.notifications) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.notifications.filter(n => !n.is_read).length);
      }
    } catch (e) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const addNotification = (notif) => {
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        created_at: new Date().toISOString(),
        is_read: false,
        ...notif
      },
      ...prev
    ]);
    setUnreadCount(c => c + 1);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAllAsRead,
      addNotification,
      refreshNotifications: fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

