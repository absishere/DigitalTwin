from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import schemas
import uuid

router = APIRouter()

@router.post("/register", response_model=schemas.AuthTokenRes)
def register_user(req: schemas.UserRegisterReq, db: Session = Depends(get_db)):
    # TODO: Implement hashing and insert into DB
    return {"token": "dummy-token", "user_id": uuid.uuid4()}

@router.post("/login", response_model=schemas.AuthTokenRes)
def login_user(req: schemas.UserLoginReq, db: Session = Depends(get_db)):
    # TODO: Implement DB check and token generation
    return {"token": "dummy-token", "user_id": uuid.uuid4()}