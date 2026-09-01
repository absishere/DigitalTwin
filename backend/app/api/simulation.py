from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from sqlalchemy import text, func
from geoalchemy2.shape import to_shape
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
    # Fetch spatial data and convert PostGIS geometry back to lat/lon using GeoAlchemy
    ports = db.query(models.Port).all()
    result = []
    for p in ports:
        try:
            pt = to_shape(p.location)
            lat, lon = float(pt.y), float(pt.x)
        except Exception:
            lat, lon = 0.0, 0.0
        result.append({
            "port_id": p.port_id,
            "name": p.name,
            "lat": lat,
            "lon": lon
        })
    return result


@router.post("/start", response_model=schemas.SimStartRes)
def start_simulation(req: schemas.SimStartReq, db: Session = Depends(get_db)):
    # Extract origin and destination coordinates if ports exist
    origin_port = db.query(models.Port).filter(models.Port.port_id == req.origin_id).first()
    dest_port = db.query(models.Port).filter(models.Port.port_id == req.dest_id).first()

    if origin_port and dest_port:
        orig_pt = to_shape(origin_port.location)
        dest_pt = to_shape(dest_port.location)
        start_lat, start_lon = float(orig_pt.y), float(orig_pt.x)
        end_lat, end_lon = float(dest_pt.y), float(dest_pt.x)
        mid_lat, mid_lon = (start_lat + end_lat) / 2.0, (start_lon + end_lon) / 2.0
    else:
        start_lat, start_lon = 18.9438, 72.8223
        mid_lat, mid_lon = 12.0, 85.0
        end_lat, end_lon = 1.2902, 103.8519

    sim = models.Simulation(
        origin_id=req.origin_id,
        dest_id=req.dest_id,
        ship_type=req.ship_type,
        status="active"
    )
    db.add(sim)
    db.commit()
    db.refresh(sim)

    initial_route = [
        {"lat": start_lat, "lon": start_lon, "timestamp": datetime.now(timezone.utc)},
        {"lat": mid_lat, "lon": mid_lon, "timestamp": datetime.now(timezone.utc)},
        {"lat": end_lat, "lon": end_lon, "timestamp": datetime.now(timezone.utc)}
    ]
    return {"sim_id": sim.sim_id, "initial_route": initial_route}


@router.get("/{sim_id}/status", response_model=schemas.SimStatusRes)
def get_simulation_status(sim_id: uuid.UUID, db: Session = Depends(get_db)):
    sim = db.query(models.Simulation).filter(models.Simulation.sim_id == sim_id).first()
    alerts = []
    if not sim:
        alerts.append("Simulation record not found.")
    return {"current_eta": datetime.now(timezone.utc), "alerts": alerts}


@router.websocket("/{sim_id}/live")
async def live_position(websocket: WebSocket, sim_id: str, db: Session = Depends(get_db)):
    await websocket.accept()
    
    current_lat, current_lon = 18.9438, 72.8223 # e.g., Leaving Mumbai
    
    try:
        while True:
            # 1. Update Position
            current_lat -= 0.05
            current_lon += 0.05
            
            # 2. Risk Detection: Check if current position hits bad weather using PostGIS ST_DWithin
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
                payload["heading"] = 90.0 
            
            await websocket.send_json(payload)
            await asyncio.sleep(2)
            
    except WebSocketDisconnect:
        print(f"Simulation {sim_id} tracking ended.")