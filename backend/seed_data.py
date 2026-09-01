import asyncio
from sqlalchemy.orm import Session
from app.database import engine, SessionLocal
from app.models import Port
from app import models

# Ensure tables are created
models.Base.metadata.create_all(bind=engine)

def seed_ports():
    db: Session = SessionLocal()
    
    # Check if ports already exist
    if db.query(Port).first():
        print("Ports already seeded.")
        return

    # Using WKT (Well-Known Text) for PostGIS POINT geometry
    sample_ports = [
        Port(name="Mumbai Port", country="India", location="SRID=4326;POINT(72.8223 18.9438)"),
        Port(name="Port of Singapore", country="Singapore", location="SRID=4326;POINT(103.8519 1.2902)"),
        Port(name="Jebel Ali Port", country="UAE", location="SRID=4326;POINT(55.0273 24.9857)")
    ]
    
    db.add_all(sample_ports)
    db.commit()
    print("Successfully seeded origin and destination ports.")
    db.close()

if __name__ == "__main__":
    seed_ports()