// @ts-ignore
import * as SQLite from 'expo-sqlite';
import { GameSession, MemoryItem, ReminderItem } from '../types';
import { INITIAL_GAME_SESSIONS, INITIAL_MEMORIES, INITIAL_REMINDERS } from '../constants/demoData';

let db: SQLite.SQLiteDatabase | null = null;

// Memory storage fallback for web/testing environment where native SQLite isn't compiled
const localMemoryStore: {
  gameSessions: GameSession[];
  memories: MemoryItem[];
  reminders: ReminderItem[];
} = {
  gameSessions: [...INITIAL_GAME_SESSIONS],
  memories: [...INITIAL_MEMORIES],
  reminders: [...INITIAL_REMINDERS],
};

export const initDatabase = async (): Promise<void> => {
  try {
    if (SQLite.openDatabaseAsync) {
      db = await SQLite.openDatabaseAsync('cognitcare.db');
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS game_sessions (
          id TEXT PRIMARY KEY,
          patient_id TEXT,
          game_type TEXT,
          score INTEGER,
          accuracy INTEGER,
          response_time_ms INTEGER,
          correct_answers INTEGER,
          total_questions INTEGER,
          difficulty_level INTEGER,
          timestamp TEXT,
          sync_status TEXT
        );
        CREATE TABLE IF NOT EXISTS memories (
          id TEXT PRIMARY KEY,
          patient_id TEXT,
          name TEXT,
          relationship TEXT,
          description TEXT,
          category TEXT,
          image_uri TEXT,
          created_at TEXT,
          updated_at TEXT,
          sync_status TEXT
        );
        CREATE TABLE IF NOT EXISTS reminders (
          id TEXT PRIMARY KEY,
          patient_id TEXT,
          title TEXT,
          scheduled_time TEXT,
          description TEXT,
          status TEXT,
          repeat_pattern TEXT,
          created_by TEXT,
          created_at TEXT,
          updated_at TEXT,
          sync_status TEXT
        );
      `);
      console.log('SQLite database initialized successfully');
    }
  } catch (error) {
    console.warn('SQLite native init warning, falling back to local store:', error);
  }
};

// --- GAME SESSIONS ---
export const saveGameSessionDB = async (session: GameSession): Promise<void> => {
  localMemoryStore.gameSessions.unshift(session);
  if (!db) return;
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO game_sessions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.id,
        session.patientId,
        session.gameType,
        session.score,
        session.accuracy,
        session.responseTimeMs,
        session.correctAnswers,
        session.totalQuestions,
        session.difficultyLevel,
        session.timestamp,
        session.syncStatus,
      ]
    );
  } catch (err) {
    console.error('Error saving game session to SQLite:', err);
  }
};

export const getGameSessionsDB = async (): Promise<GameSession[]> => {
  if (!db) return localMemoryStore.gameSessions;
  try {
    const rows = await db.getAllAsync<any>('SELECT * FROM game_sessions ORDER BY timestamp DESC');
    return rows.map((r: any) => ({
      id: r.id,
      patientId: r.patient_id,
      gameType: r.game_type,
      score: r.score,
      accuracy: r.accuracy,
      responseTimeMs: r.response_time_ms,
      correctAnswers: r.correct_answers,
      totalQuestions: r.total_questions,
      difficultyLevel: r.difficulty_level,
      timestamp: r.timestamp,
      syncStatus: r.sync_status,
    }));
  } catch (err) {
    return localMemoryStore.gameSessions;
  }
};

// --- MEMORIES ---
export const saveMemoryDB = async (memory: MemoryItem): Promise<void> => {
  localMemoryStore.memories.unshift(memory);
  if (!db) return;
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO memories VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        memory.id,
        memory.patientId,
        memory.name,
        memory.relationship,
        memory.description,
        memory.category,
        memory.imageUri || '',
        memory.createdAt,
        memory.updatedAt,
        memory.syncStatus,
      ]
    );
  } catch (err) {
    console.error('Error saving memory to SQLite:', err);
  }
};

export const getMemoriesDB = async (): Promise<MemoryItem[]> => {
  if (!db) return localMemoryStore.memories;
  try {
    const rows = await db.getAllAsync<any>('SELECT * FROM memories ORDER BY created_at DESC');
    return rows.map((r: any) => ({
      id: r.id,
      patientId: r.patient_id,
      name: r.name,
      relationship: r.relationship,
      description: r.description,
      category: r.category,
      imageUri: r.image_uri,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      syncStatus: r.sync_status,
    }));
  } catch (err) {
    return localMemoryStore.memories;
  }
};

export const deleteMemoryDB = async (id: string): Promise<void> => {
  localMemoryStore.memories = localMemoryStore.memories.filter((m) => m.id !== id);
  if (!db) return;
  try {
    await db.runAsync('DELETE FROM memories WHERE id = ?', [id]);
  } catch (err) {
    console.error('Error deleting memory from SQLite:', err);
  }
};

// --- REMINDERS ---
export const saveReminderDB = async (reminder: ReminderItem): Promise<void> => {
  localMemoryStore.reminders.unshift(reminder);
  if (!db) return;
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO reminders VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reminder.id,
        reminder.patientId,
        reminder.title,
        reminder.scheduledTime,
        reminder.description || '',
        reminder.status,
        reminder.repeatPattern || 'daily',
        reminder.createdBy,
        reminder.createdAt,
        reminder.updatedAt,
        reminder.syncStatus,
      ]
    );
  } catch (err) {
    console.error('Error saving reminder to SQLite:', err);
  }
};

export const getRemindersDB = async (): Promise<ReminderItem[]> => {
  if (!db) return localMemoryStore.reminders;
  try {
    const rows = await db.getAllAsync<any>('SELECT * FROM reminders ORDER BY created_at DESC');
    return rows.map((r: any) => ({
      id: r.id,
      patientId: r.patient_id,
      title: r.title,
      scheduledTime: r.scheduled_time,
      description: r.description,
      status: r.status,
      repeatPattern: r.repeat_pattern,
      createdBy: r.created_by,
      createdAt: r.createdAt || r.created_at,
      updatedAt: r.updatedAt || r.updated_at,
      syncStatus: r.sync_status,
    }));
  } catch (err) {
    return localMemoryStore.reminders;
  }
};

export const updateReminderStatusDB = async (
  id: string,
  status: 'pending' | 'completed' | 'missed' | 'snoozed'
): Promise<void> => {
  localMemoryStore.reminders = localMemoryStore.reminders.map((r) =>
    r.id === id ? { ...r, status, syncStatus: 'pending' } : r
  );
  if (!db) return;
  try {
    await db.runAsync('UPDATE reminders SET status = ?, sync_status = ? WHERE id = ?', [
      status,
      'pending',
      id,
    ]);
  } catch (err) {
    console.error('Error updating reminder in SQLite:', err);
  }
};

// --- SYNC PENDING RECORDS ---
export const getPendingSyncRecordsDB = async () => {
  const pendingSessions = localMemoryStore.gameSessions.filter((s) => s.syncStatus === 'pending');
  const pendingMemories = localMemoryStore.memories.filter((m) => m.syncStatus === 'pending');
  const pendingReminders = localMemoryStore.reminders.filter((r) => r.syncStatus === 'pending');

  return {
    sessions: pendingSessions,
    memories: pendingMemories,
    reminders: pendingReminders,
  };
};

export const markRecordsSyncedDB = async (ids: string[]): Promise<void> => {
  localMemoryStore.gameSessions = localMemoryStore.gameSessions.map((s) =>
    ids.includes(s.id) ? { ...s, syncStatus: 'synced' } : s
  );
  localMemoryStore.memories = localMemoryStore.memories.map((m) =>
    ids.includes(m.id) ? { ...m, syncStatus: 'synced' } : m
  );
  localMemoryStore.reminders = localMemoryStore.reminders.map((r) =>
    ids.includes(r.id) ? { ...r, syncStatus: 'synced' } : r
  );

  if (!db) return;
  for (const id of ids) {
    try {
      await db.runAsync("UPDATE game_sessions SET sync_status = 'synced' WHERE id = ?", [id]);
      await db.runAsync("UPDATE memories SET sync_status = 'synced' WHERE id = ?", [id]);
      await db.runAsync("UPDATE reminders SET sync_status = 'synced' WHERE id = ?", [id]);
    } catch (err) {
      console.error('Error marking sync status:', err);
    }
  }
};
