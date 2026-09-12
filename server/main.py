from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.database import Base, engine, SessionLocal
from server.models import PatientProfileModel, MemoryModel, ReminderModel, GameSessionModel
from server.routers import api

# Create Database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CogniCare API Backend (SIH26003)",
    description="AI-Based Cognitive Gaming & Memory Assistance Platform API Server",
    version="1.0.0",
)

# Enable CORS for React Native / Expo local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router)

@app.on_event("startup")
def seed_demo_data():
    db = SessionLocal()
    try:
        # Seed patient profile if empty
        patient = db.query(PatientProfileModel).filter(PatientProfileModel.id == "patient-rita-72").first()
        if not patient:
            db_patient = PatientProfileModel(
                id="patient-rita-72",
                name="Rita Devi",
                age=72,
                caregiver_name="Demo Caregiver",
            )
            db.add(db_patient)

        # Seed initial memories if empty
        if db.query(MemoryModel).count() == 0:
            db.add_all([
                MemoryModel(
                    id="mem-1",
                    patient_id="patient-rita-72",
                    name="Aarav",
                    relationship="Grandson",
                    description="Enjoys playing chess and comes to visit every Sunday afternoon.",
                    category="family",
                    created_at="2026-09-12T10:00:00Z",
                    updated_at="2026-09-12T10:00:00Z",
                    sync_status="synced",
                ),
                MemoryModel(
                    id="mem-2",
                    patient_id="patient-rita-72",
                    name="Priya",
                    relationship="Daughter",
                    description="Lives nearby, calls every evening at 6 PM.",
                    category="family",
                    created_at="2026-09-12T10:00:00Z",
                    updated_at="2026-09-12T10:00:00Z",
                    sync_status="synced",
                ),
                MemoryModel(
                    id="mem-3",
                    patient_id="patient-rita-72",
                    name="Shillong",
                    relationship="Family Vacation",
                    description="Beautiful hill station visited during summer family trip.",
                    category="place",
                    created_at="2026-09-12T10:00:00Z",
                    updated_at="2026-09-12T10:00:00Z",
                    sync_status="synced",
                ),
            ])

        # Seed initial reminders if empty
        if db.query(ReminderModel).count() == 0:
            db.add_all([
                ReminderModel(
                    id="rem-1",
                    patient_id="patient-rita-72",
                    title="Morning Medicine",
                    scheduled_time="8:00 AM",
                    description="Take 1 blood pressure tablet with water after breakfast.",
                    status="pending",
                    repeat_pattern="daily",
                    created_by="Demo Caregiver",
                    created_at="2026-09-12T08:00:00Z",
                    updated_at="2026-09-12T08:00:00Z",
                    sync_status="synced",
                ),
                ReminderModel(
                    id="rem-2",
                    patient_id="patient-rita-72",
                    title="Lunch",
                    scheduled_time="1:00 PM",
                    description="Warm meal in dining room. Remember to drink water.",
                    status="pending",
                    repeat_pattern="daily",
                    created_by="Demo Caregiver",
                    created_at="2026-09-12T13:00:00Z",
                    updated_at="2026-09-12T13:00:00Z",
                    sync_status="synced",
                ),
            ])

        db.commit()
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "CogniCare API Backend (SIH26003)",
        "version": "1.0.0",
        "patient": "Rita Devi",
        "docs": "/docs",
    }
