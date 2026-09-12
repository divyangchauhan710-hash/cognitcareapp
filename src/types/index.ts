export type UserRole = 'patient' | 'caregiver';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  age?: number;
  caregiverName?: string;
  patientName?: string;
}

export interface GameSession {
  id: string;
  patientId: string;
  gameType: 'memory_recall' | 'attention';
  score: number; // 0 - 100
  accuracy: number; // 0 - 100%
  responseTimeMs: number;
  correctAnswers: number;
  totalQuestions: number;
  difficultyLevel: number; // 1 to 4
  timestamp: string; // ISO String
  syncStatus: 'synced' | 'pending' | 'failed';
}

export interface MemoryItem {
  id: string;
  patientId: string;
  name: string; // e.g. "Aarav"
  relationship: string; // e.g. "Grandson"
  description: string; // e.g. "Loves playing chess and visits every Sunday"
  imageUri?: string;
  category: 'family' | 'friend' | 'place' | 'event';
  createdAt: string;
  updatedAt: string;
  syncStatus: 'synced' | 'pending' | 'failed';
}

export interface ReminderItem {
  id: string;
  patientId: string;
  title: string; // e.g. "Morning Medicine"
  scheduledTime: string; // e.g. "8:00 AM"
  description?: string; // e.g. "Take 1 pill after breakfast"
  status: 'pending' | 'completed' | 'missed' | 'snoozed';
  repeatPattern?: 'daily' | 'weekly' | 'none';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  syncStatus: 'synced' | 'pending' | 'failed';
}

export interface CognitivePerformance {
  patientId: string;
  memoryTaskPerformance: number; // Percentage e.g. 78%
  attentionTaskPerformance: number; // Percentage e.g. 84%
  recognitionPerformance: number; // Percentage e.g. 71%
  recallPerformance: number; // Percentage e.g. 75%
  totalSessionsCompleted: number;
  totalDurationMinutes: number;
  recentTrend: 'improving' | 'stable' | 'needs_training';
  lastUpdated: string;
}

export interface AdaptiveDifficultyState {
  currentDifficulty: number; // 1 - 4
  consecutiveSuccesses: number;
  consecutiveFailures: number;
  itemCount: number;
  timeLimitSeconds: number;
  hintAvailable: boolean;
}
