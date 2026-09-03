import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load DATABASE_URL from .env/backend/.env before the SQLAlchemy engine is created.
load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:123456@localhost:5432/marineverse",
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
