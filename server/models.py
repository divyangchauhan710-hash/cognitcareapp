from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from server.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True) # nullable for Google auth
    role = Column(String, nullable=False) # 'patient' or 'caregiver'
    name = Column(String, nullable=False)
    pfp_url = Column(String, nullable=True)
    emergency_number = Column(String, nullable=True)
    google_id = Column(String, nullable=True, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ConnectionRequestModel(Base):
    __tablename__ = "connection_requests"

    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    caregiver_id = Column(String, ForeignKey("users.id"), nullable=False)
    patient_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="pending") # pending, accepted, rejected
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class GameSessionModel(Base):
    __tablename__ = "game_sessions"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    game_type = Column(String, nullable=False) # memory_recall / attention
    score = Column(Integer, nullable=False)
    accuracy = Column(Integer, nullable=False)
    response_time_ms = Column(Integer, nullable=False)
    correct_answers = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    difficulty_level = Column(Integer, nullable=False)
    timestamp = Column(String, nullable=False)
    sync_status = Column(String, default="synced")

class MemoryModel(Base):
    __tablename__ = "memories"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    name = Column(String, nullable=False)
    relationship = Column(String, nullable=False)
    description = Column(String, nullable=True)
    category = Column(String, default="family")
    image_uri = Column(String, nullable=True)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)
    sync_status = Column(String, default="synced")

class ReminderModel(Base):
    __tablename__ = "reminders"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    title = Column(String, nullable=False)
    scheduled_time = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="pending") # pending / completed / missed / snoozed
    repeat_pattern = Column(String, default="daily")
    created_by = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)
    sync_status = Column(String, default="synced")
