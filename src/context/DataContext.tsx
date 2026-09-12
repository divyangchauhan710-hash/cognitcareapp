import React, { createContext, useContext, useState } from 'react';
import { MemoryItem, ReminderItem, GameSession } from '../types';
import {
  INITIAL_MEMORIES,
  INITIAL_REMINDERS,
  INITIAL_GAME_SESSIONS,
} from '../constants/demoData';

interface DataContextType {
  memories: MemoryItem[];
  reminders: ReminderItem[];
  gameSessions: GameSession[];
  addMemory: (item: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>) => void;
  deleteMemory: (id: string) => void;
  addReminder: (item: Omit<ReminderItem, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>) => void;
  updateReminderStatus: (id: string, status: 'pending' | 'completed' | 'missed' | 'snoozed') => void;
  deleteReminder: (id: string) => void;
  addGameSession: (session: GameSession) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [reminders, setReminders] = useState<ReminderItem[]>(INITIAL_REMINDERS);
  const [gameSessions, setGameSessions] = useState<GameSession[]>(INITIAL_GAME_SESSIONS);

  const addMemory = (item: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>) => {
    const newMemory: MemoryItem = {
      ...item,
      id: `mem-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
    };
    setMemories((prev) => [newMemory, ...prev]);
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const addReminder = (item: Omit<ReminderItem, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>) => {
    const newReminder: ReminderItem = {
      ...item,
      id: `rem-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending',
    };
    setReminders((prev) => [newReminder, ...prev]);
  };

  const updateReminderStatus = (
    id: string,
    status: 'pending' | 'completed' | 'missed' | 'snoozed'
  ) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              updatedAt: new Date().toISOString(),
              syncStatus: 'pending',
            }
          : r
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const addGameSession = (session: GameSession) => {
    setGameSessions((prev) => [session, ...prev]);
  };

  return (
    <DataContext.Provider
      value={{
        memories,
        reminders,
        gameSessions,
        addMemory,
        deleteMemory,
        addReminder,
        updateReminderStatus,
        deleteReminder,
        addGameSession,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
