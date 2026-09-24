import { UserProfile, CognitivePerformance, MemoryItem, ReminderItem, GameSession } from '../types';

export const DEMO_PATIENT: UserProfile = {
  id: 'patient-rita-72',
  name: 'Rita Devi',
  role: 'patient',
  age: 72,
  caregiverName: 'Demo Caregiver',
};

export const DEMO_CAREGIVER: UserProfile = {
  id: 'caregiver-demo-01',
  name: 'Demo Caregiver',
  role: 'caregiver',
  patientName: 'Rita Devi',
};

export const INITIAL_PERFORMANCE: CognitivePerformance = {
  patientId: 'patient-rita-72',
  memoryTaskPerformance: 78,
  attentionTaskPerformance: 84,
  recognitionPerformance: 71,
  recallPerformance: 75,
  totalSessionsCompleted: 14,
  totalDurationMinutes: 112,
  recentTrend: 'improving',
  lastUpdated: new Date().toISOString(),
};

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    patientId: 'patient-rita-72',
    name: 'Aarav',
    relationship: 'Grandson',
    description: 'Enjoys playing chess and comes to visit every Sunday afternoon.',
    category: 'family',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncStatus: 'synced',
  },
  {
    id: 'mem-2',
    patientId: 'patient-rita-72',
    name: 'Priya',
    relationship: 'Daughter',
    description: 'Lives nearby, calls every evening at 6 PM.',
    category: 'family',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncStatus: 'synced',
  },
  {
    id: 'mem-3',
    patientId: 'patient-rita-72',
    name: 'Shillong',
    relationship: 'Family Vacation',
    description: 'Beautiful hill station visited during summer family trip.',
    category: 'place',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncStatus: 'synced',
  },
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    patientId: 'patient-rita-72',
    title: 'Morning Medicine',
    scheduledTime: '8:00 AM',
    description: 'Take 1 blood pressure tablet with water after breakfast.',
    status: 'pending',
    repeatPattern: 'daily',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'Demo Caregiver',
    syncStatus: 'synced',
  },
  {
    id: 'rem-2',
    patientId: 'patient-rita-72',
    title: 'Lunch',
    scheduledTime: '1:00 PM',
    description: 'Warm meal in dining room. Remember to drink water.',
    status: 'pending',
    repeatPattern: 'daily',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'Demo Caregiver',
    syncStatus: 'synced',
  },
  {
    id: 'rem-3',
    patientId: 'patient-rita-72',
    title: 'Evening Walk',
    scheduledTime: '5:30 PM',
    description: 'Light 15-minute walk in garden with Priya.',
    status: 'pending',
    repeatPattern: 'daily',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'Demo Caregiver',
    syncStatus: 'synced',
  },
];

export const INITIAL_GAME_SESSIONS: GameSession[] = [
  {
    id: 'gs-101',
    patientId: 'patient-rita-72',
    gameType: 'memory_recall',
    score: 85,
    accuracy: 85,
    responseTimeMs: 3200,
    correctAnswers: 5,
    totalQuestions: 6,
    difficultyLevel: 2,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    syncStatus: 'synced',
  },
  {
    id: 'gs-102',
    patientId: 'patient-rita-72',
    gameType: 'pattern_sequence',
    score: 80,
    accuracy: 80,
    responseTimeMs: 2800,
    correctAnswers: 4,
    totalQuestions: 5,
    difficultyLevel: 2,
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    syncStatus: 'synced',
  },
];
