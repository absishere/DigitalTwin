from fastapi import FastAPI
from app.api import auth, simulation, ai
from app.database import engine
from app import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="MarineVerse AI Digital Twin", version="1.0.0")

@app.get("/")
def read_root():
    return {"status": "MarineVerse AI Backend is running."}

# Register the routers under their respective prefixes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(simulation.router, prefix="/api/v1/simulation", tags=["Simulation"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Marine Assistant"])

@app.get("/")
def read_root():
    return {"status": "MarineVerse AI Backend is running."}