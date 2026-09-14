from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from typing import List

router = APIRouter(prefix="/connections", tags=["connections"])

@router.post("/request", response_model=schemas.ConnectionRequestResponse)
def request_connection(req: schemas.ConnectionRequestBase, caregiver_id: str, db: Session = Depends(get_db)):
    patient = db.query(models.UserModel).filter(models.UserModel.email == req.patient_email, models.UserModel.role == "patient").first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found with this email")
    
    existing = db.query(models.ConnectionRequestModel).filter(
        models.ConnectionRequestModel.caregiver_id == caregiver_id,
        models.ConnectionRequestModel.patient_id == patient.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Connection request already exists")

    new_req = models.ConnectionRequestModel(
        caregiver_id=caregiver_id,
        patient_id=patient.id
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    return new_req

@router.get("/pending/{patient_id}", response_model=List[schemas.ConnectionRequestResponse])
def get_pending_requests(patient_id: str, db: Session = Depends(get_db)):
    return db.query(models.ConnectionRequestModel).filter(
        models.ConnectionRequestModel.patient_id == patient_id,
        models.ConnectionRequestModel.status == "pending"
    ).all()

@router.post("/respond/{request_id}")
def respond_to_request(request_id: str, status: str, db: Session = Depends(get_db)):
    if status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    req = db.query(models.ConnectionRequestModel).filter(models.ConnectionRequestModel.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    req.status = status
    db.commit()
    return {"message": f"Request {status}"}

@router.get("/my-patients/{caregiver_id}", response_model=List[schemas.ConnectionResponse])
def get_my_patients(caregiver_id: str, db: Session = Depends(get_db)):
    connections = db.query(models.ConnectionRequestModel).filter(
        models.ConnectionRequestModel.caregiver_id == caregiver_id,
        models.ConnectionRequestModel.status == "accepted"
    ).all()
    
    patients = []
    for conn in connections:
        p = db.query(models.UserModel).filter(models.UserModel.id == conn.patient_id).first()
        if p:
            patients.append(p)
    return patients
