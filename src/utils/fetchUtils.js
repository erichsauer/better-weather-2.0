import request from 'superagent';

const API_KEY = process.env.REACT_APP_API_KEY;

export async function fetchLatLon(zipCode) {
  const { body: { lat, lon, name } } = await request.get(`http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${API_KEY}`);
  return {
    centerLat: lat, centerLon: lon, name,
  };
}

// async function fetchCity(lat, lon) {
//   const { body: { name } } = await request.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);

//   return name;
// }

function createLatLonMatrix({ centerLat, centerLon, radius }) {
  const matrixStep = 0.8;
  const northBoundary = centerLat + radius;
  const southBoundary = centerLat - radius;
  const eastBoundary = centerLon - radius;
  const westBoundary = centerLon + radius;

  const matrix = [];

  for (let newLat = northBoundary; newLat >= southBoundary; newLat -= matrixStep) {
    for (let newLon = westBoundary; newLon >= eastBoundary; newLon -= matrixStep) {
      matrix.push([newLat, newLon]);
    }
  }
  return matrix;
}

async function fetchForecast(lat, lon, { timeframe }) {
  let { body: { daily, hourly } } = await request.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`);

  daily = daily.map(({
    feels_like: feelsLike,
    wind_speed: windSpeed,
    clouds: cloudCover,
    humidity,
    sunset,
    moon_phase: moonPhase,
    moonset,
    rain = '',
    snow = '',
    pop,
  }) => ({
    temp: feelsLike,
    wind: windSpeed,
    cloudCover,
    humidity,
    sunset,
    moon: {
      phase: moonPhase,
      set: moonset,
    },
    precipitation: {
      rain,
      snow,
      chanceOf: pop,
    },
  }));

  hourly = hourly.map(({
    feels_like: feelsLike,
    wind_speed: windSpeed,
    clouds: cloudCover,
    humidity,
    pop,
  }) => ({
    cloudCover,
    feelsLike,
    humidity,
    chanceOfPrecipitation: pop,
    windSpeed,
  }));

  return {
    daily: (timeframe === 'daily' || timeframe === 'both') && daily,
    hourly: (timeframe === 'hourly' || timeframe === 'both') && hourly,
  };
}

function filterWeather({ daily }, {
  clouds, rain, temp, dayIndex,
}) {
  const {
    cloudCover, temp: { day: dayTemp }, precipitation: { rain: dayRain }, windSpeed,
  } = daily[dayIndex];

  console.log(daily);

  return cloudCover <= clouds
    && dayRain <= rain
    && dayTemp >= temp
    && windSpeed <= 10;
}

export async function getDestinations(centerLat, centerLon, {
  radius, clouds, rain, temp, dayIndex = 0,
}) {
  // use center lat/lon to create matrix of lat/lon lookups
  const geoLocations = createLatLonMatrix({ centerLat, centerLon, radius });
  const forecasts = await Promise
    .all(geoLocations.map(async ([lat, lon]) => fetchForecast(lat, lon, { timeframe: 'daily' })));

  return forecasts.filter((forecast) => filterWeather(forecast, {
    clouds, rain, temp, dayIndex,
  }));
}
