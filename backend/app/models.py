import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    simulations = relationship("Simulation", back_populates="user")


class Port(Base):
    __tablename__ = "ports"

    port_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), index=True, nullable=False)
    country = Column(String(100), nullable=False)
    location = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False)

    origin_simulations = relationship("Simulation", foreign_keys="[Simulation.origin_id]", back_populates="origin_port")
    dest_simulations = relationship("Simulation", foreign_keys="[Simulation.dest_id]", back_populates="dest_port")


class Simulation(Base):
    __tablename__ = "simulations"

    sim_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=True)
    origin_id = Column(UUID(as_uuid=True), ForeignKey("ports.port_id"), nullable=False)
    dest_id = Column(UUID(as_uuid=True), ForeignKey("ports.port_id"), nullable=False)
    ship_type = Column(String(50), nullable=False)
    status = Column(String(50), default="active", nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="simulations")
    origin_port = relationship("Port", foreign_keys=[origin_id], back_populates="origin_simulations")
    dest_port = relationship("Port", foreign_keys=[dest_id], back_populates="dest_simulations")


class MarineDataSnapshot(Base):
    __tablename__ = "marine_data_snapshots"

    snapshot_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    timestamp = Column(DateTime(timezone=True), index=True, default=lambda: datetime.now(timezone.utc), nullable=False)
    location = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False)
    ocean_temp_c = Column(Float, nullable=True)
    wave_height_m = Column(Float, nullable=True)
    wind_speed_knots = Column(Float, nullable=True)
    current_speed_knots = Column(Float, nullable=True)
    current_direction_deg = Column(Float, nullable=True)
    weather_condition = Column(String(100), nullable=True)
    is_unsafe = Column(Boolean, default=False, nullable=False)
    source = Column(String(100), default="NOAA/Open-Meteo", nullable=True)


class AISVesselPosition(Base):
    __tablename__ = "ais_vessel_positions"

    ais_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mmsi = Column(String(50), index=True, nullable=False)
    vessel_name = Column(String(100), nullable=False)
    ship_type = Column(String(50), nullable=False)
    location = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False)
    speed_knots = Column(Float, nullable=False)
    heading_deg = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), index=True, default=lambda: datetime.now(timezone.utc), nullable=False)
