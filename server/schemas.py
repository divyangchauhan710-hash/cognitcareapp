from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    role: str
    name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    pfp_url: Optional[str] = None
    emergency_number: Optional[str] = None

class GoogleLogin(BaseModel):
    id_token: str
    role: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    pfp_url: Optional[str] = None
    emergency_number: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ConnectionRequestBase(BaseModel):
    patient_email: EmailStr

class ConnectionRequestResponse(BaseModel):
    id: str
    caregiver_id: str
    patient_id: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ConnectionResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    pfp_url: Optional[str] = None

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
    createdBy: Optional[str] = None
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
