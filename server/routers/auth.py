from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt
import requests
from ..database import get_db
from .. import models, schemas

SECRET_KEY = "dummy-secret-key-for-dev"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

import bcrypt
router = APIRouter(prefix="/auth", tags=["auth"])

def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Dependency to get current user
def get_current_user(token: str, db: Session):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
    except:
        return None
    return db.query(models.UserModel).filter(models.UserModel.id == user_id).first()

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.UserModel).filter(models.UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = models.UserModel(
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        name=user.name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.UserModel).filter(models.UserModel.email == user.email).first()
    if not db_user or not db_user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": db_user.id, "role": db_user.role})
    return {"access_token": access_token, "token_type": "bearer", "user": db_user}

@router.post("/google-login")
def google_login(google_data: schemas.GoogleLogin, db: Session = Depends(get_db)):
    try:
        response = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={google_data.id_token}")
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid Google token")
        
        user_info = response.json()
        email = user_info.get("email")
        name = user_info.get("name")
        google_id = user_info.get("sub")
        pfp_url = user_info.get("picture")

        if not email:
            raise HTTPException(status_code=400, detail="Token did not provide an email")
            
        db_user = db.query(models.UserModel).filter(models.UserModel.email == email).first()
        
        if not db_user:
            db_user = models.UserModel(
                email=email,
                role=google_data.role,
                name=name,
                google_id=google_id,
                pfp_url=pfp_url
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
        elif not db_user.google_id:
            db_user.google_id = google_id
            db.commit()
            db.refresh(db_user)
            
        access_token = create_access_token(data={"sub": db_user.id, "role": db_user.role})
        return {"access_token": access_token, "token_type": "bearer", "user": db_user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.patch("/user/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: str, updates: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.UserModel).filter(models.UserModel.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if updates.pfp_url is not None:
        db_user.pfp_url = updates.pfp_url
    if updates.emergency_number is not None:
        db_user.emergency_number = updates.emergency_number
        
    db.commit()
    db.refresh(db_user)
    return db_user
