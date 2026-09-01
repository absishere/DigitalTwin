import argparse
import sys
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import engine, SessionLocal
from app import models
from app.models import MarineDataSnapshot, AISVesselPosition
from ingestion.fetch_weather import fetch_weather_data
from ingestion.fetch_ocean_currents import fetch_ocean_currents_data
from ingestion.fetch_ais import fetch_ais_vessel_tracks

def initialize_database():
    """Ensure PostGIS extension and database tables exist."""
    try:
        with engine.connect() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
            conn.commit()
        models.Base.metadata.create_all(bind=engine)
        print("Database connection & PostGIS extension verified.")
    except Exception as e:
        print(f"Warning/Error initializing database: {e}")

def run_ingestion_pipeline():
    """Executes all ingestion modules and commits parsed data into PostGIS tables."""
    print("=" * 60)
    print(f"Starting MarineVerse Data Ingestion Job at {datetime.now(timezone.utc).isoformat()}")
    print("=" * 60)

    initialize_database()

    db: Session = SessionLocal()
    total_snapshots = 0
    total_unsafe = 0
    total_ais = 0

    try:
        # 1. Weather Ingestion
        print("\n[1/3] Ingesting Marine Weather Data...")
        weather_df = fetch_weather_data()
        for idx, row in weather_df.iterrows():
            snapshot = MarineDataSnapshot(
                timestamp=row["timestamp"],
                location=row["location_wkt"],
                ocean_temp_c=row["ocean_temp_c"],
                wave_height_m=row["wave_height_m"],
                wind_speed_knots=row["wind_speed_knots"],
                current_speed_knots=row["current_speed_knots"],
                current_direction_deg=row["current_direction_deg"],
                weather_condition=row["weather_condition"],
                is_unsafe=row["is_unsafe"],
                source=row["source"]
            )
            db.add(snapshot)
            total_snapshots += 1
            if row["is_unsafe"]:
                total_unsafe += 1
        print(f" -> Processed {len(weather_df)} weather snapshots ({total_unsafe} marked unsafe).")

        # 2. Ocean Currents Ingestion
        print("\n[2/3] Ingesting Ocean Currents & SST Data...")
        currents_df = fetch_ocean_currents_data(num_samples=10)
        for idx, row in currents_df.iterrows():
            snapshot = MarineDataSnapshot(
                timestamp=row["timestamp"],
                location=row["location_wkt"],
                ocean_temp_c=row["ocean_temp_c"],
                wave_height_m=row["wave_height_m"],
                wind_speed_knots=row["wind_speed_knots"],
                current_speed_knots=row["current_speed_knots"],
                current_direction_deg=row["current_direction_deg"],
                weather_condition=row["weather_condition"],
                is_unsafe=row["is_unsafe"],
                source=row["source"]
            )
            db.add(snapshot)
            total_snapshots += 1
        print(f" -> Processed {len(currents_df)} ocean current snapshots.")

        # 3. AIS Vessel Positions Ingestion
        print("\n[3/3] Ingesting Live AIS Vessel Positions...")
        ais_df = fetch_ais_vessel_tracks()
        for idx, row in ais_df.iterrows():
            vessel = AISVesselPosition(
                mmsi=row["mmsi"],
                vessel_name=row["vessel_name"],
                ship_type=row["ship_type"],
                location=row["location_wkt"],
                speed_knots=row["speed_knots"],
                heading_deg=row["heading_deg"],
                timestamp=row["timestamp"]
            )
            db.add(vessel)
            total_ais += 1
        print(f" -> Processed {len(ais_df)} AIS vessel tracking points.")

        db.commit()
        print("\n" + "=" * 60)
        print(f"SUCCESS: Ingestion completed!")
        print(f"Total Snapshots Ingested: {total_snapshots} (Unsafe Risk Zones: {total_unsafe})")
        print(f"Total AIS Vessel Records: {total_ais}")
        print("=" * 60)

    except Exception as e:
        db.rollback()
        print(f"\nERROR during data ingestion: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="MarineVerse AI Data Ingestion CLI")
    parser.add_argument("--loop", action="store_true", help="Run ingestion continuously in a background loop")
    args = parser.parse_args()

    run_ingestion_pipeline()
