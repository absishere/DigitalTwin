import pytest
import pandas as pd
from ingestion.fetch_weather import fetch_weather_data
from ingestion.fetch_ocean_currents import fetch_ocean_currents_data
from ingestion.fetch_ais import fetch_ais_vessel_tracks

def test_fetch_weather_data_structure():
    df = fetch_weather_data()
    assert isinstance(df, pd.DataFrame)
    assert not df.empty
    expected_cols = [
        "timestamp", "location_wkt", "lat", "lon",
        "ocean_temp_c", "wave_height_m", "wind_speed_knots",
        "current_speed_knots", "weather_condition", "is_unsafe", "source"
    ]
    for col in expected_cols:
        assert col in df.columns, f"Missing expected column '{col}'"

def test_fetch_weather_unsafe_flag():
    df = fetch_weather_data()
    for idx, row in df.iterrows():
        if row["wave_height_m"] > 3.2 or row["wind_speed_knots"] > 28.0:
            assert row["is_unsafe"] is True
        else:
            assert row["is_unsafe"] is False

def test_fetch_ocean_currents_data_structure():
    df = fetch_ocean_currents_data(num_samples=5)
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 5
    assert "current_speed_knots" in df.columns
    assert "current_direction_deg" in df.columns
    assert "location_wkt" in df.columns

def test_fetch_ais_vessel_tracks_structure():
    df = fetch_ais_vessel_tracks()
    assert isinstance(df, pd.DataFrame)
    assert not df.empty
    assert "mmsi" in df.columns
    assert "vessel_name" in df.columns
    assert "speed_knots" in df.columns
    assert "heading_deg" in df.columns
    assert "location_wkt" in df.columns

def test_wkt_format():
    df = fetch_weather_data()
    wkt_sample = df["location_wkt"].iloc[0]
    assert wkt_sample.startswith("SRID=4326;POINT(")
    assert ")" in wkt_sample
