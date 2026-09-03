from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 1. Hard-routing strictly to the 'marineverse' database on IPv4
# Replace YOUR_DOCKER_PASSWORD with the password from docker-compose.yml
SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://postgres:123456@127.0.0.1:5432/marineverse"

# 2. Forcing the engine to look in the public schema where PostGIS lives
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    echo=False,
    connect_args={"options": "-csearch_path=public,postgis"}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()