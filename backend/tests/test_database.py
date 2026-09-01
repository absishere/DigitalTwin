import pytest
import uuid
from datetime import datetime, timezone

from app.models import User, Port, Simulation, MarineDataSnapshot, AISVesselPosition

def test_user_model_instantiation():
    user = User(
        name="Test Captain",
        email="testcaptain@marineverse.ai",
        password_hash="hashed_password_sample"
    )
    assert user.name == "Test Captain"
    assert user.email == "testcaptain@marineverse.ai"

def test_port_model_instantiation():
    port = Port(
        name="Mumbai Port",
        country="India",
        location="SRID=4326;POINT(72.8223 18.9438)"
    )
    assert port.name == "Mumbai Port"
    assert port.country == "India"
    assert "POINT(72.8223 18.9438)" in port.location

def test_simulation_model_instantiation():
    orig_id = uuid.uuid4()
    dest_id = uuid.uuid4()
    sim = Simulation(
        origin_id=orig_id,
        dest_id=dest_id,
        ship_type="cargo",
        status="active"
    )
    assert sim.ship_type == "cargo"
    assert sim.status == "active"
    assert sim.origin_id == orig_id
    assert sim.dest_id == dest_id

def test_marine_snapshot_instantiation():
    snapshot = MarineDataSnapshot(
        location="SRID=4326;POINT(75.0 15.0)",
        ocean_temp_c=28.5,
        wave_height_m=4.2,
        wind_speed_knots=32.0,
        current_speed_knots=2.1,
        weather_condition="Storm Warning",
        is_unsafe=True,
        source="Open-Meteo Test"
    )
    assert snapshot.wave_height_m == 4.2
    assert snapshot.is_unsafe is True

def test_ais_vessel_position_instantiation():
    ais = AISVesselPosition(
        mmsi="352001000",
        vessel_name="MV Test Trader",
        ship_type="container",
        location="SRID=4326;POINT(73.5 16.5)",
        speed_knots=16.4,
        heading_deg=145.0
    )
    assert ais.mmsi == "352001000"
    assert ais.speed_knots == 16.4
