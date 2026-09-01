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
async def live_position(websocket: WebSocket, sim_id: str, db: Session = Depends(get_db)):
    await websocket.accept()
    
    current_lat, current_lon = 18.9438, 72.8223 # e.g., Leaving Mumbai
    
    try:
        while True:
            # 1. Update Position
            current_lat -= 0.05
            current_lon += 0.05
            
            # 2. Risk Detection: Check if current position hits bad weather
            # Using PostGIS ST_DWithin to check a 50km radius for unsafe marine snapshots
            risk_query = """
                SELECT wave_height_m, wind_speed_knots FROM marine_data_snapshots 
                WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), 0.5)
                AND is_unsafe = true LIMIT 1;
            """
            risk_result = db.execute(text(risk_query), {"lon": current_lon, "lat": current_lat}).fetchone()
            
            payload = {
                "lat": current_lat,
                "lon": current_lon,
                "speed": random.uniform(14.0, 16.5),
                "heading": 135.0,
                "alerts": [],
                "route_status": "optimal"
            }
            
            # 3. Dynamic Route Planning Trigger
            if risk_result:
                payload["alerts"].append(f"Unsafe conditions detected: {risk_result.wave_height_m}m waves.")
                payload["route_status"] = "rerouting"
                # Implement alternate heading/waypoint logic here
                payload["heading"] = 90.0 
            
            await websocket.send_json(payload)
            await asyncio.sleep(2) # Stream frequency
            
    except WebSocketDisconnect:
        print(f"Simulation {sim_id} tracking ended.")