from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.database import Base, engine
from server.routers import api, auth, connections

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

app.include_router(auth.router)
app.include_router(connections.router)
app.include_router(api.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "CogniCare API Backend",
        "version": "1.0.0",
        "docs": "/docs",
    }
