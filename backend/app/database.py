import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# We will read this from the .env file later, but we will default to a local PostGIS string
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+psycopg2://postgres:postgres@localhost:5432/marineverse"
)

# Initialize the SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=False)

# SessionLocal will act as a factory for individual database sessions per request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency function to inject database sessions into our FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()