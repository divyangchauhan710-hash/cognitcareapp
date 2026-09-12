from pydantic import BaseModel, Field
from typing import List, Optional

class PatientSchema(BaseModel):
    id: str
    name: str
    age: int
    caregiverName: Optional[str] = "Demo Caregiver"

class GameSessionSchema(BaseModel):
    id: str
    patientId: str = Field(..., alias="patientId")
    gameType: str
    score: int
    accuracy: int
    responseTimeMs: int
    correctAnswers: int
    totalQuestions: int
    difficultyLevel: int
    timestamp: str
    syncStatus: Optional[str] = "synced"

    class Config:
        populate_by_name = True

class MemorySchema(BaseModel):
    id: str
    patientId: str
    name: str
    relationship: str
    description: Optional[str] = ""
    category: Optional[str] = "family"
    imageUri: Optional[str] = None
    createdAt: str
    updatedAt: str
    syncStatus: Optional[str] = "synced"

    class Config:
        populate_by_name = True

class ReminderSchema(BaseModel):
    id: str
    patientId: str
    title: str
    scheduledTime: str
    description: Optional[str] = ""
    status: str = "pending"
    repeatPattern: Optional[str] = "daily"
    createdBy: Optional[str] = "Demo Caregiver"
    createdAt: str
    updatedAt: str
    syncStatus: Optional[str] = "synced"

    class Config:
        populate_by_name = True

class SyncPayload(BaseModel):
    sessions: List[GameSessionSchema] = []
    memories: List[MemorySchema] = []
    reminders: List[ReminderSchema] = []

class SyncResponse(BaseModel):
    success: bool
    syncedIds: List[str]
    message: str
