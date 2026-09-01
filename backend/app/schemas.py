from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class UserBase(BaseModel):
    model_config = ConfigDict(strict=True, str_strip_whitespace=True)
    email: EmailStr

class UserRegisterReq(UserBase):
    name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=8)

class UserLoginReq(UserBase):
    password: str

class AuthTokenRes(BaseModel):
    token: str
    user_id: uuid.UUID

class PortRes(BaseModel):
    port_id: uuid.UUID
    name: str
    lat: float = Field(..., ge=-90.0, le=90.0)
    lon: float = Field(..., ge=-180.0, le=180.0)

class RoutePoint(BaseModel):
    lat: float = Field(..., ge=-90.0, le=90.0)
    lon: float = Field(..., ge=-180.0, le=180.0)
    timestamp: datetime

class SimStartReq(BaseModel):
    origin_id: uuid.UUID
    dest_id: uuid.UUID
    ship_type: str = Field(..., pattern="^(cargo|tanker|passenger)$")

class SimStartRes(BaseModel):
    sim_id: uuid.UUID
    initial_route: List[RoutePoint]

class SimStatusRes(BaseModel):
    current_eta: datetime
    alerts: List[str] = Field(default_factory=list, description="Unsafe weather or rough sea alerts")

class LivePositionWS(BaseModel):
    lat: float = Field(..., ge=-90.0, le=90.0)
    lon: float = Field(..., ge=-180.0, le=180.0)
    speed: float = Field(..., ge=0.0)
    heading: float = Field(..., ge=0.0, lt=360.0)

class AIQueryReq(BaseModel):
    sim_id: Optional[uuid.UUID] = None
    query: str = Field(..., min_length=5, max_length=500)

class AIQueryRes(BaseModel):
    text_answer: str
    sql_used: Optional[str] = None
    viz_type: str = Field(..., pattern="^(chart|table|map|none)$")
    data: List[Dict[str, Any]] = Field(default_factory=list)

