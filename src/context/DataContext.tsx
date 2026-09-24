import React, { createContext, useContext, useState, useEffect } from 'react';
import { MemoryItem, ReminderItem, GameSession } from '../types';

const API_URL = "https://aeterna-1.onrender.com";

interface DataContextType {
  memories: MemoryItem[];
  reminders: ReminderItem[];
  gameSessions: GameSession[];
  analytics: any | null;
  activePatientId: string | null;
  gameDifficulties: Record<string, number>;
  setActivePatientId: (id: string | null) => void;
  updateGameDifficulty: (gameType: string, level: number) => void;
  fetchPatientData: (patientId: string) => Promise<void>;
  addMemory: (item: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>) => void;
  deleteMemory: (id: string) => void;
  addReminder: (item: Omit<ReminderItem, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>) => void;
  updateReminderStatus: (id: string, status: 'pending' | 'completed' | 'missed' | 'snoozed') => void;
  deleteReminder: (id: string) => void;
  addGameSession: (session: GameSession) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [gameDifficulties, setGameDifficulties] = useState<Record<string, number>>({});

  const updateGameDifficulty = (gameType: string, level: number) => {
    setGameDifficulties((prev) => ({ ...prev, [gameType]: level }));
  };

  const fetchPatientData = async (patientId: string) => {
    try {
      // Fetch Game Sessions
      const resGS = await fetch(`${API_URL}/api/game-sessions?patient_id=${patientId}`);
      if (resGS.ok) setGameSessions(await resGS.json());

      // Fetch Memories
      const resMem = await fetch(`${API_URL}/api/memories?patient_id=${patientId}`);
      if (resMem.ok) setMemories(await resMem.json());

      // Fetch Reminders
      const resRem = await fetch(`${API_URL}/api/reminders?patient_id=${patientId}`);
      if (resRem.ok) setReminders(await resRem.json());

      // Fetch Analytics
      const resAna = await fetch(`${API_URL}/api/analytics/${patientId}`);
      if (resAna.ok) setAnalytics(await resAna.json());
    } catch (e) {
      console.error("Error fetching patient data:", e);
    }
  };

  const addMemory = async (item: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>) => {
    if (!activePatientId) return;
    const newMemory: MemoryItem = {
      ...item,
      patientId: activePatientId,
      id: `mem-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'synced',
    };
    
    // Optimistic update
    setMemories((prev) => [newMemory, ...prev]);

    try {
      await fetch(`${API_URL}/api/memories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemory)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteMemory = async (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    try {
      await fetch(`${API_URL}/api/memories/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  const addReminder = async (item: Omit<ReminderItem, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>) => {
    if (!activePatientId) return;
    const newReminder: ReminderItem = {
      ...item,
      patientId: activePatientId,
      id: `rem-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'synced',
    };
    setReminders((prev) => [newReminder, ...prev]);

    try {
      await fetch(`${API_URL}/api/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReminder)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const updateReminderStatus = (
    id: string,
    status: 'pending' | 'completed' | 'missed' | 'snoozed'
  ) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status, updatedAt: new Date().toISOString() }
          : r
      )
    );
    // You could add a PATCH endpoint for reminders, but for now we'll just optimistically update locally
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const addGameSession = async (session: GameSession) => {
    setGameSessions((prev) => [session, ...prev]);
    try {
      await fetch(`${API_URL}/api/game-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      });
      // Refresh analytics after game
      if (activePatientId) fetchPatientData(activePatientId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DataContext.Provider
      value={{
        memories,
        reminders,
        gameSessions,
        analytics,
        activePatientId,
        gameDifficulties,
        setActivePatientId,
        updateGameDifficulty,
        fetchPatientData,
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
