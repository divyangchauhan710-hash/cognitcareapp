from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from server.database import get_db
from server.models import (
    UserModel,
    GameSessionModel,
    MemoryModel,
    ReminderModel,
)
from server.schemas import (
    UserResponse,
    GameSessionSchema,
    MemorySchema,
    ReminderSchema,
    SyncPayload,
    SyncResponse,
)

router = APIRouter(prefix="/api", tags=["CogniCare API"])

# --- PATIENTS ---
@router.get("/patients", response_model=List[UserResponse])
def get_patients(db: Session = Depends(get_db)):
    patients = db.query(UserModel).filter(UserModel.role == "patient").all()
    return patients

@router.get("/patients/{patient_id}", response_model=UserResponse)
def get_patient_detail(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(UserModel).filter(UserModel.id == patient_id, UserModel.role == "patient").first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

# --- GAME SESSIONS ---
@router.get("/game-sessions", response_model=List[GameSessionSchema])
def get_game_sessions(patient_id: str = "patient-rita-72", db: Session = Depends(get_db)):
    sessions = db.query(GameSessionModel).filter(GameSessionModel.patient_id == patient_id).all()
    return [
        GameSessionSchema(
            id=s.id,
            patientId=s.patient_id,
            gameType=s.game_type,
            score=s.score,
            accuracy=s.accuracy,
            responseTimeMs=s.response_time_ms,
            correctAnswers=s.correct_answers,
            totalQuestions=s.total_questions,
            difficultyLevel=s.difficulty_level,
            timestamp=s.timestamp,
            syncStatus=s.sync_status,
        )
        for s in sessions
    ]

@router.post("/game-sessions", response_model=GameSessionSchema)
def create_game_session(payload: GameSessionSchema, db: Session = Depends(get_db)):
    db_session = GameSessionModel(
        id=payload.id,
        patient_id=payload.patientId,
        game_type=payload.gameType,
        score=payload.score,
        accuracy=payload.accuracy,
        response_time_ms=payload.responseTimeMs,
        correct_answers=payload.correctAnswers,
        total_questions=payload.totalQuestions,
        difficulty_level=payload.difficultyLevel,
        timestamp=payload.timestamp,
        sync_status="synced",
    )
    db.merge(db_session)
    db.commit()
    return payload

# --- MEMORIES ---
@router.get("/memories", response_model=List[MemorySchema])
def get_memories(patient_id: str = "patient-rita-72", db: Session = Depends(get_db)):
    memories = db.query(MemoryModel).filter(MemoryModel.patient_id == patient_id).all()
    return [
        MemorySchema(
            id=m.id,
            patientId=m.patient_id,
            name=m.name,
            relationship=m.relationship,
            description=m.description or "",
            category=m.category or "family",
            imageUri=m.image_uri,
            createdAt=m.created_at,
            updatedAt=m.updated_at,
            syncStatus=m.sync_status,
        )
        for m in memories
    ]

@router.post("/memories", response_model=MemorySchema)
def create_memory(payload: MemorySchema, db: Session = Depends(get_db)):
    db_memory = MemoryModel(
        id=payload.id,
        patient_id=payload.patientId,
        name=payload.name,
        relationship=payload.relationship,
        description=payload.description,
        category=payload.category,
        image_uri=payload.imageUri,
        created_at=payload.createdAt,
        updated_at=payload.updatedAt,
        sync_status="synced",
    )
    db.merge(db_memory)
    db.commit()
    return payload

@router.delete("/memories/{memory_id}")
def delete_memory(memory_id: str, db: Session = Depends(get_db)):
    db.query(MemoryModel).filter(MemoryModel.id == memory_id).delete()
    db.commit()
    return {"success": True, "deletedId": memory_id}

# --- REMINDERS ---
@router.get("/reminders", response_model=List[ReminderSchema])
def get_reminders(patient_id: str = "patient-rita-72", db: Session = Depends(get_db)):
    reminders = db.query(ReminderModel).filter(ReminderModel.patient_id == patient_id).all()
    return [
        ReminderSchema(
            id=r.id,
            patientId=r.patient_id,
            title=r.title,
            scheduledTime=r.scheduled_time,
            description=r.description or "",
            status=r.status,
            repeatPattern=r.repeat_pattern,
            createdBy=r.created_by,
            createdAt=r.created_at,
            updatedAt=r.updated_at,
            syncStatus=r.sync_status,
        )
        for r in reminders
    ]

@router.post("/reminders", response_model=ReminderSchema)
def create_reminder(payload: ReminderSchema, db: Session = Depends(get_db)):
    db_reminder = ReminderModel(
        id=payload.id,
        patient_id=payload.patientId,
        title=payload.title,
        scheduled_time=payload.scheduledTime,
        description=payload.description,
        status=payload.status,
        repeat_pattern=payload.repeatPattern,
        created_by=payload.createdBy,
        created_at=payload.createdAt,
        updated_at=payload.updatedAt,
        sync_status="synced",
    )
    db.merge(db_reminder)
    db.commit()
    return payload

# --- SYNC ENDPOINT ---
@router.post("/sync", response_model=SyncResponse)
def sync_data(payload: SyncPayload, db: Session = Depends(get_db)):
    synced_ids = []

    # Sync Sessions
    for s in payload.sessions:
        db_s = GameSessionModel(
            id=s.id,
            patient_id=s.patientId,
            game_type=s.gameType,
            score=s.score,
            accuracy=s.accuracy,
            response_time_ms=s.responseTimeMs,
            correct_answers=s.correctAnswers,
            total_questions=s.totalQuestions,
            difficulty_level=s.difficultyLevel,
            timestamp=s.timestamp,
            sync_status="synced",
        )
        db.merge(db_s)
        synced_ids.append(s.id)

    # Sync Memories
    for m in payload.memories:
        db_m = MemoryModel(
            id=m.id,
            patient_id=m.patientId,
            name=m.name,
            relationship=m.relationship,
            description=m.description,
            category=m.category,
            image_uri=m.imageUri,
            created_at=m.createdAt,
            updated_at=m.updatedAt,
            sync_status="synced",
        )
        db.merge(db_m)
        synced_ids.append(m.id)

    # Sync Reminders
    for r in payload.reminders:
        db_r = ReminderModel(
            id=r.id,
            patient_id=r.patientId,
            title=r.title,
            scheduled_time=r.scheduledTime,
            description=r.description,
            status=r.status,
            repeat_pattern=r.repeatPattern,
            created_by=r.createdBy,
            created_at=r.createdAt,
            updated_at=r.updatedAt,
            sync_status="synced",
        )
        db.merge(db_r)
        synced_ids.append(r.id)

    db.commit()

    return SyncResponse(
        success=True,
        syncedIds=synced_ids,
        message=f"Successfully synchronized {len(synced_ids)} records to PostgreSQL/SQLite cloud store."
    )

# --- ANALYTICS ---
@router.get("/analytics/{patient_id}")
def get_analytics(patient_id: str, db: Session = Depends(get_db)):
    sessions = db.query(GameSessionModel).filter(GameSessionModel.patient_id == patient_id).all()
    reminders = db.query(ReminderModel).filter(ReminderModel.patient_id == patient_id).all()

    total_sessions = len(sessions)
    avg_accuracy = round(sum(s.accuracy for s in sessions) / total_sessions) if total_sessions > 0 else 0
    avg_response_time = round(sum(s.response_time_ms for s in sessions) / total_sessions) if total_sessions > 0 else 0

    return {
        "patientId": patient_id,
        "totalSessions": total_sessions,
        "averageAccuracy": avg_accuracy,
        "averageResponseTimeMs": avg_response_time,
        "totalReminders": len(reminders),
        "completedReminders": len([r for r in reminders if r.status == "completed"]),
        "recentTrend": "improving" if avg_accuracy >= 75 else "stable"
    }
