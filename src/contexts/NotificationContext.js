// contexts/NotificationContext.js
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const incrementUnreadCount = () => setUnreadCount(prev => prev + 1);
  const decrementUnreadCount = () => setUnreadCount(prev => Math.max(prev - 1, 0));

  return (
    <NotificationContext.Provider
      value={{ unreadCount, setUnreadCount, incrementUnreadCount, decrementUnreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
