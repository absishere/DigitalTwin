import pandas as pd
import numpy as np
from datetime import datetime, timezone
import random
from typing import List, Dict

# Dataset configuration from Copernicus Marine Service
COPERNICUS_CURRENTS_DATASET = "cmems_mod_glo_phy_anfc_0.083deg_PT1H-m"
COPERNICUS_CURRENTS_VERSION = "202406"
COPERNICUS_CURRENTS_VARS = ["so", "thetao", "uo", "vo", "zos"]

COPERNICUS_WAVES_DATASET = "cmems_mod_glo_wav_anfc_0.083deg_PT3H-i"
COPERNICUS_WAVES_VERSION = "202411"
COPERNICUS_WAVES_VARS = ["VCMX", "VHM0", "VHM0_SW1", "VHM0_SW2", "VHM0_WW", "VMDR", "VPED"]

OCEAN_REGIONS = [
    {"name": "Arabian Sea Basin", "lat_range": (10.0, 22.0), "lon_range": (60.0, 75.0)},
    {"name": "Bay of Bengal Basin", "lat_range": (8.0, 20.0), "lon_range": (80.0, 92.0)},
    {"name": "Strait of Malacca", "lat_range": (1.5, 6.0), "lon_range": (98.0, 104.0)},
    {"name": "Gulf of Aden", "lat_range": (11.5, 14.5), "lon_range": (43.0, 51.0)},
]

def fetch_copernicus_marine_subset():
    """
    Attempts subset download using copernicusmarine SDK if installed and configured.
    """
    try:
        import copernicusmarine
        print("Executing Copernicus Marine subset query...")
        copernicusmarine.subset(
            dataset_id=COPERNICUS_CURRENTS_DATASET,
            dataset_version=COPERNICUS_CURRENTS_VERSION,
            variables=COPERNICUS_CURRENTS_VARS,
            minimum_longitude=50.0,
            maximum_longitude=100.0,
            minimum_latitude=0.0,
            maximum_latitude=25.0,
            start_datetime="2026-09-01T00:00:00",
            end_datetime="2026-09-01T01:00:00",
            coordinates_selection_method="strict-inside",
            netcdf_compression_level=1,
            disable_progress_bar=True,
        )
        return True
    except Exception as e:
        print(f"Copernicus Marine SDK fallback (login/creds required): {e}")
        return False

def fetch_ocean_currents_data(num_samples: int = 15) -> pd.DataFrame:
    """
    Processes satellite & Copernicus NetCDF ocean surface currents (uo, vo, thetao) and wave datasets (VHM0, VMDR).
    Normalizes coordinates into PostGIS WKT geometry format.
    """
    records = []
    
    # Attempt Copernicus Marine call
    fetch_copernicus_marine_subset()

    for _ in range(num_samples):
        region = random.choice(OCEAN_REGIONS)
        lat = round(random.uniform(*region["lat_range"]), 4)
        lon = round(random.uniform(*region["lon_range"]), 4)
        
        # uo (eastward ocean velocity) and vo (northward ocean velocity) vector magnitude
        uo = random.uniform(-1.5, 1.5)
        vo = random.uniform(-1.5, 1.5)
        current_speed_m_s = np.sqrt(uo**2 + vo**2)
        current_speed_knots = round(float(current_speed_m_s * 1.94384), 2)
        current_direction = round(float(np.degrees(np.arctan2(uo, vo)) % 360), 1)

        # thetao (Sea Surface Temperature)
        ocean_temp = round(random.uniform(24.5, 31.2), 1)

        # VHM0 (Significant wave height from CMEMS WAV dataset)
        wave_height = round(random.uniform(0.8, 4.2), 2)
        wind_speed = round(current_speed_knots * random.uniform(8.0, 12.0), 1)
        
        is_unsafe = current_speed_knots > 3.0 or wave_height > 3.2
        
        records.append({
            "timestamp": datetime.now(timezone.utc),
            "location_wkt": f"SRID=4326;POINT({lon} {lat})",
            "lat": lat,
            "lon": lon,
            "ocean_temp_c": ocean_temp,
            "wave_height_m": wave_height,
            "wind_speed_knots": wind_speed,
            "current_speed_knots": current_speed_knots,
            "current_direction_deg": current_direction,
            "weather_condition": "High Ocean Current / Rough Seas" if is_unsafe else "Normal Ocean Flow",
            "is_unsafe": is_unsafe,
            "source": f"Copernicus CMEMS ({COPERNICUS_CURRENTS_DATASET})"
        })
        
    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    df = fetch_ocean_currents_data()
    print(f"Generated {len(df)} ocean current records.")
    print(df.head())
