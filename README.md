# MarineVerse AI — Digital Twin Backend & Marine Data Infrastructure

Welcome to the **MarineVerse AI Digital Twin** data infrastructure and backend engine. MarineVerse AI is an interactive marine simulation, decision support, and AI marine assistant platform powered by PostgreSQL + PostGIS, FastAPI, and Open-Meteo/NOAA/Copernicus data ingestion feeds.

---

## 🌊 Architecture & Data Flow

The system is organized into four technical layers, with spatial data flowing from external providers into the PostGIS geospatial layer and API services:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      1. External Data Sources                          │
│     (NOAA, Open-Meteo Marine API, Copernicus CMEMS, AIS Feeds)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Scheduled Ingestion Jobs
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 2. Data Layer (PostgreSQL + PostGIS)                   │
│   • ports (Spatial POINT SRID=4326)                                    │
│   • marine_data_snapshots (Wave, Wind, Temp, ST_DWithin Risk Index)   │
│   • ais_vessel_positions (Live MMSI & Spatial Tracks)                 │
│   • simulations & users                                                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ GeoAlchemy2 / SQLAlchemy ORM
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   3. Backend Services (FastAPI)                         │
│   • Simulation Engine & Dynamic Rerouting (`/api/v1/simulation`)        │
│   • Live WebSocket Position Stream (`/api/v1/simulation/{id}/live`)     │
│   • AI Marine Assistant NL→SQL (`/api/v1/ai/query`)                    │
│   • Authentication & User Management (`/api/v1/auth`)                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST / WebSocket API
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   4. Frontend (React + Leaflet UI)                     │
│     Dashboard • Interactive Map • Simulation Controls • AI Chat       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Member D Role & Deliverables (Data / Integration Lead)

- **Database Models & Schema**: Designed PostgreSQL + PostGIS spatial schema using SQLAlchemy and GeoAlchemy2 (`models.py`).
- **Data Ingestion Pipeline**: Created modules for weather (`fetch_weather.py`), ocean currents & sea surface temperature (`fetch_ocean_currents.py`), and AIS vessel tracking (`fetch_ais.py`).
- **CLI Ingestion Runner**: Built `ingest_marine_data.py` to populate spatial records into PostGIS tables and flag hazardous weather zones.
- **Containerization & DevOps**: Configured `Dockerfile`, `docker-compose.yml` (`postgis/postgis:15-3.3`), and `.env.example`.
- **QA & Automated Testing**: Implemented unit and integration test suite (`backend/tests/test_database.py`, `backend/tests/test_ingestion.py`).

---

## 🗄️ PostGIS Database Schema

### 1. `ports`
- `port_id` (UUID, Primary Key)
- `name` (VARCHAR)
- `country` (VARCHAR)
- `location` (Geometry POINT, SRID 4326)

### 2. `marine_data_snapshots`
- `snapshot_id` (UUID, Primary Key)
- `timestamp` (TIMESTAMPTZ, Indexed)
- `location` (Geometry POINT, SRID 4326)
- `ocean_temp_c` (FLOAT)
- `wave_height_m` (FLOAT)
- `wind_speed_knots` (FLOAT)
- `current_speed_knots` (FLOAT)
- `current_direction_deg` (FLOAT)
- `weather_condition` (VARCHAR)
- `is_unsafe` (BOOLEAN) — *Triggers dynamic rerouting when vessel comes within 50km (`ST_DWithin`)*
- `source` (VARCHAR)

### 3. `ais_vessel_positions`
- `ais_id` (UUID, Primary Key)
- `mmsi` (VARCHAR, Indexed)
- `vessel_name` (VARCHAR)
- `ship_type` (VARCHAR)
- `location` (Geometry POINT, SRID 4326)
- `speed_knots` (FLOAT)
- `heading_deg` (FLOAT)
- `timestamp` (TIMESTAMPTZ, Indexed)

### 4. `simulations` & `users`
- `sim_id` (UUID, Primary Key)
- `user_id` (UUID, FK to `users`)
- `origin_id` (UUID, FK to `ports`)
- `dest_id` (UUID, FK to `ports`)
- `ship_type` (VARCHAR: cargo | tanker | passenger)
- `status` (VARCHAR: active | completed)

---

## 🚀 Quick Start Guide

### Option A: Running with Docker Compose (Recommended)

1. Clone repository and copy environment variables:
   ```bash
   cp .env.example .env
   ```

2. Spin up PostGIS, FastAPI Backend, and Data Ingestion container:
   ```bash
   docker-compose up --build
   ```

3. Access the FastAPI interactive API documentation:
   - Swagger UI: `http://localhost:8000/docs`

---

### Option B: Local Python Development Setup

1. Create a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Ensure PostgreSQL + PostGIS is running locally and update `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/marineverse
   ```

4. Initialize PostGIS tables and seed baseline data:
   ```bash
   PYTHONPATH=backend python backend/seed_data.py
   ```

5. Run data ingestion job:
   ```bash
   PYTHONPATH=backend python backend/ingest_marine_data.py
   ```

6. Start FastAPI development server:
   ```bash
   PYTHONPATH=backend uvicorn app.main:app --reload --port 8000
   ```

---

## 🧪 Running Automated Tests

Run pytest across database models, PostGIS spatial geometries, and data ingestion pipelines:

```bash
PYTHONPATH=backend pytest backend/tests
```

All 10 unit & integration tests verify:
- GeoAlchemy2 PostGIS WKT spatial geometry parsing.
- Weather API data fetching, cleaning, and formatting.
- Wave height and wind speed safety threshold flagging (`is_unsafe`).
- Database model instantiation and foreign key relationships.

---

## 👥 Team Split & Responsibility Matrix

| Team Member | System Role | Core Responsibilities |
|---|---|---|
| **Member A** | AI/ML Lead | Ollama setup, LangChain NL→SQL pipeline, ChromaDB vector store |
| **Member B** | Backend / Simulation Lead | FastAPI structure, vessel movement loop, WebSocket stream |
| **Member C** | Frontend Lead | React/Vite UI, Leaflet map, dashboard, AI chat interface |
| **Member D** | Data / Integration Lead | PostGIS schema, weather/currents/AIS ingestion, Docker, QA |
