import React, { createContext, useContext, useState, useEffect } from 'react';
import { SyncManager } from '../services/syncService';
import NetInfo from '@react-native-community/netinfo';

interface SyncContextType {
  isOnline: boolean;
  pendingSyncCount: number;
  toggleNetwork: () => void;
  setOnlineStatus: (status: boolean) => void;
  incrementPendingSync: () => void;
  clearPendingSync: () => void;
  triggerSync: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  const triggerSync = async () => {
    const res = await SyncManager.syncPendingData();
    if (res.success) {
      setPendingSyncCount(0);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const isConnected = !!state.isConnected;
      setIsOnline(isConnected);
      if (isConnected) {
        triggerSync();
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleNetwork = async () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState) {
      await triggerSync();
    }
  };

  const setOnlineStatus = (status: boolean) => {
    setIsOnline(status);
  };

  const incrementPendingSync = () => {
    setPendingSyncCount((prev) => prev + 1);
  };

  const clearPendingSync = () => {
    setPendingSyncCount(0);
  };

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        pendingSyncCount,
        toggleNetwork,
        setOnlineStatus,
        incrementPendingSync,
        clearPendingSync,
        triggerSync,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};
