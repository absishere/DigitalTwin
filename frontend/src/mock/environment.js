export const mockEnvironment = {
  primary: {
    seaSurfaceTemp: 28.5,
    salinity: 35.2,
    currentSpeed: 1.2,
    currentDirection: 145,
    waveHeight: 2.4,
    wavePeriod: 8.5,
    windSpeed: 18,
    windDirection: 240,
    airTemperature: 29,
    humidity: 78,
    pressure: 1012,
    visibility: 12,
    cloudCover: 45,
    weather: 'partly_cloudy',
  },
  forecast: [
    { hours: 1, temp: 28.7, wind: 19, waves: 2.5, weather: 'partly_cloudy' },
    { hours: 2, temp: 28.9, wind: 21, waves: 2.8, weather: 'cloudy' },
    { hours: 3, temp: 29.0, wind: 24, waves: 3.2, weather: 'cloudy' },
    { hours: 4, temp: 28.8, wind: 26, waves: 3.5, weather: 'overcast' },
    { hours: 5, temp: 28.5, wind: 28, waves: 3.8, weather: 'rainy' },
    { hours: 6, temp: 28.2, wind: 30, waves: 4.2, weather: 'stormy' },
  ]
};

export const weatherIcons = {
  clear: '☀️',
  partly_cloudy: '⛅',
  cloudy: '☁️',
  overcast: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
};
