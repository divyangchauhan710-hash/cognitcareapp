from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime
from server.database import Base

class PatientProfileModel(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    caregiver_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class GameSessionModel(Base):
    __tablename__ = "game_sessions"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, index=True, nullable=False)
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
    patient_id = Column(String, index=True, nullable=False)
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
    patient_id = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    scheduled_time = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="pending") # pending / completed / missed / snoozed
    repeat_pattern = Column(String, default="daily")
    created_by = Column(String, default="Demo Caregiver")
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)
    sync_status = Column(String, default="synced")
