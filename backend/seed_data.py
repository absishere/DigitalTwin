import asyncio
from datetime import datetime, timezone
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal
from app import models
from app.models import Port, User, MarineDataSnapshot, AISVesselPosition
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_db():
    """Ensure PostGIS extension and database tables are created."""
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        conn.commit()
    models.Base.metadata.create_all(bind=engine)
    print("Database schema and PostGIS extension verified.")

def seed_data():
    init_db()
    db: Session = SessionLocal()
    try:
        # 1. Seed Demo User
        if not db.query(User).filter(User.email == "captain@marineverse.ai").first():
            demo_user = User(
                name="Captain Avery",
                email="captain@marineverse.ai",
                password_hash=pwd_context.hash("MarineVerse2026!")
            )
            db.add(demo_user)
            print("Seeded demo user: captain@marineverse.ai")

        # 2. Seed World Port Index & UN/LOCODE Ports
        if not db.query(Port).first():
            sample_ports = [
                Port(name="Mumbai Port (INBOM)", country="India", location="SRID=4326;POINT(72.8223 18.9438)"),
                Port(name="Port of Singapore (SGSIN)", country="Singapore", location="SRID=4326;POINT(103.8519 1.2902)"),
                Port(name="Jebel Ali Port (AEJEA)", country="UAE", location="SRID=4326;POINT(55.0273 24.9857)"),
                Port(name="Port of Colombo (LKCMB)", country="Sri Lanka", location="SRID=4326;POINT(79.8612 6.9271)"),
                Port(name="Port of Rotterdam (NLRTM)", country="Netherlands", location="SRID=4326;POINT(4.4777 51.9244)"),
                Port(name="Port of Shanghai (CNSHA)", country="China", location="SRID=4326;POINT(121.4737 31.2304)"),
                Port(name="Port Said / Suez Canal (EGSUZ)", country="Egypt", location="SRID=4326;POINT(32.3019 31.2653)"),
            ]
            db.add_all(sample_ports)
            print(f"Seeded {len(sample_ports)} World Port Index / UN LOCODE ports.")

        # 3. Seed Baseline Marine Weather Snapshots (Open-Meteo & Copernicus CMEMS)
        if not db.query(MarineDataSnapshot).first():
            snapshots = [
                MarineDataSnapshot(
                    location="SRID=4326;POINT(72.83 18.95)",
                    ocean_temp_c=28.4,
                    wave_height_m=2.1,
                    wind_speed_knots=14.5,
                    current_speed_knots=1.2,
                    current_direction_deg=180.0,
                    weather_condition="Clear",
                    is_unsafe=False,
                    source="Open-Meteo Marine API"
                ),
                MarineDataSnapshot(
                    location="SRID=4326;POINT(75.0 12.0)", # Rough sea storm zone
                    ocean_temp_c=27.1,
                    wave_height_m=4.8,
                    wind_speed_knots=34.0,
                    current_speed_knots=3.5,
                    current_direction_deg=220.0,
                    weather_condition="Tropical Storm / Rough Seas",
                    is_unsafe=True,
                    source="Copernicus CMEMS (cmems_mod_glo_wav_anfc_0.083deg_PT3H-i)"
                ),
                MarineDataSnapshot(
                    location="SRID=4326;POINT(80.0 6.0)",
                    ocean_temp_c=29.0,
                    wave_height_m=1.8,
                    wind_speed_knots=10.0,
                    current_speed_knots=0.8,
                    current_direction_deg=120.0,
                    weather_condition="Moderate",
                    is_unsafe=False,
                    source="Copernicus CMEMS (cmems_mod_glo_phy_anfc_0.083deg_PT1H-m)"
                ),
            ]
            db.add_all(snapshots)
            print(f"Seeded {len(snapshots)} baseline marine snapshots.")

        # 4. Seed AIS Vessel Positions (AISStream.io Feed)
        if not db.query(AISVesselPosition).first():
            vessels = [
                AISVesselPosition(
                    mmsi="352001000",
                    vessel_name="MV Ocean Pioneer",
                    ship_type="cargo",
                    location="SRID=4326;POINT(73.1 17.2)",
                    speed_knots=15.2,
                    heading_deg=165.0
                ),
                AISVesselPosition(
                    mmsi="636018200",
                    vessel_name="ST Neptune Star",
                    ship_type="tanker",
                    location="SRID=4326;POINT(57.5 23.8)",
                    speed_knots=12.8,
                    heading_deg=120.0
                ),
                AISVesselPosition(
                    mmsi="413000100",
                    vessel_name="Ever Given II",
                    ship_type="cargo",
                    location="SRID=4326;POINT(74.2 12.5)",
                    speed_knots=18.0,
                    heading_deg=140.0
                )
            ]
            db.add_all(vessels)
            print(f"Seeded {len(vessels)} AIS active vessel tracking points.")

        db.commit()
        print("Data seeding completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()