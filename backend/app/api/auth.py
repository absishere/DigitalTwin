from datetime import datetime, timedelta, timezone

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-super-secret-production-key"  # Move to .env for deployment
ALGORITHM = "HS256"


@router.post("/register", response_model=schemas.AuthTokenRes)
def register_user(req: schemas.UserRegisterReq, db: Session = Depends(get_db)):
    # Check existing user
    if db.query(models.User).filter(models.User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password and store
    hashed_pwd = pwd_context.hash(req.password)
    new_user = models.User(name=req.name, email=req.email, password_hash=hashed_pwd)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate JWT
    token_exp = datetime.now(timezone.utc) + timedelta(hours=24)
    token = jwt.encode(
        {"sub": str(new_user.user_id), "exp": token_exp},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return {"token": token, "user_id": new_user.user_id}
