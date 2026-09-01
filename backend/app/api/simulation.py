from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
import asyncio
import uuid
import random

from app.database import get_db
from app import schemas, models

router = APIRouter()

@router.get("/ports", response_model=List[schemas.PortRes])
def get_ports(db: Session = Depends(get_db)):
    # Fetch spatial data and convert PostGIS geometry back to lat/lon
    ports = db.query(models.Port).all()
    result = []
    for p in ports:
        # We will mock the lat/lon extraction for this response model 
        # in production, GeoAlchemy functions like ST_X and ST_Y are used
        result.append({
            "port_id": p.port_id,
            "name": p.name,
            "lat": 18.9438, # Placeholder for extracted latitude
            "lon": 72.8223  # Placeholder for extracted longitude
        })
    return result


@router.post("/start", response_model=schemas.SimStartRes)
def start_simulation(req: schemas.SimStartReq, db: Session = Depends(get_db)):
    # Generate a new simulation ID and a mock static route for now
    sim_id = uuid.uuid4()
    initial_route = [
        {"lat": 18.9438, "lon": 72.8223, "timestamp": datetime.now(timezone.utc)},
        {"lat": 15.0, "lon": 80.0, "timestamp": datetime.now(timezone.utc)},
        {"lat": 1.2902, "lon": 103.8519, "timestamp": datetime.now(timezone.utc)}
    ]
    return {"sim_id": sim_id, "initial_route": initial_route}

@router.get("/{sim_id}/status", response_model=schemas.SimStatusRes)
def get_simulation_status(sim_id: uuid.UUID, db: Session = Depends(get_db)):
    # TODO: Fetch active alerts and current ETA
    return {"current_eta": datetime.now(timezone.utc), "alerts": []}

@router.websocket("/{sim_id}/live")
async def live_position(websocket: WebSocket, sim_id: str):
    await websocket.accept()
    
    # Starting coordinates (e.g., leaving Mumbai)
    current_lat = 18.9438
    current_lon = 72.8223
    
    try:
        while True:
            # Simulate vessel movement along the route
            current_lat -= 0.05
            current_lon += 0.05
            
            payload = {
                "lat": current_lat,
                "lon": current_lon,
                "speed": random.uniform(14.0, 16.5),  # Knots
                "heading": 135.0 # Degrees
            }
            
            await websocket.send_json(payload)
            
            # Control the frequency of the live updates (e.g., every 2 seconds)
            await asyncio.sleep(2)
            
    except WebSocketDisconnect:
        print(f"Simulation {sim_id} disconnected.")