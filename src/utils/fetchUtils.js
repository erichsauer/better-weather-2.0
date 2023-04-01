import request from 'superagent';
import { createLatLonMatrix, filterForecasts } from './miscUtils';

const API_KEY = process.env.REACT_APP_API_KEY;

async function fetchLatLon(zipCode) {
  const { body: { lat, lon, name } } = await request.get(`http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${API_KEY}`);
  return {
    centerLat: lat, centerLon: lon, name,
  };
}

async function fetchCityName(lat, lon) {
  const { body: [{ name }] } = await request.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);

  return name;
}

// TODO update to be right
/**
 * Fetches 8-day forecast, 48-hour forecast, or both.
 *
 * @param   {number} lat  Valid latitude.
 * @param   {number} lon  Valid longitude.
 * @param   {array} timeFrame  Include "day" and/or "hour".
 * @returns {object} Forecast with daily and/or hourly data.
 */
// TODO finish hourly functionality
async function fetchForecast({
  lat, lon, dayIndex, hourIndex = 0, interval: { day, hour },
}) {
  let exclude = '';
  if (!day) exclude = 'daily';
  if (!hour) exclude = 'hourly';
  const { body } = await request.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}&exclude=current,minutely,alerts,${exclude}`);

  let daily = {};
  let hourly = [];

  if (day) {
    const {
      feels_like: temp,
      wind_speed: windSpeed,
      clouds: cloudCover,
      humidity,
      sunset,
      moon_phase: phase,
      moonset: set,
      rain = 0,
      snow = 0,
      pop: chanceOf,
    } = body.daily[dayIndex];

    daily = {
      temp,
      windSpeed,
      cloudCover,
      humidity,
      sunset,
      moon: {
        phase,
        set,
      },
      precipitation: {
        rain,
        snow,
        chanceOf,
      },
    };
  }

  if (hour) {
    hourly = body.hourly.map(({
      feels_like: feelsLike,
      wind_speed: windSpeed,
      clouds: cloudCover,
      humidity,
      pop: chanceOfPrecipitation,
    }) => ({
      cloudCover,
      feelsLike,
      humidity,
      chanceOfPrecipitation,
      windSpeed,
    }));
  }

  return {
    daily,
    hourly,
    lat,
    lon,
  };
}

async function fetchAllForecasts(geoLocations, dayIndex) {
  const forecasts = await Promise.all(geoLocations
    .map(async ({ lat, lon }) => fetchForecast({
      lat, lon, dayIndex, interval: { day: true, hour: false },
    })));

  return forecasts;
}

export default async function getDestinations({
  zipCode, radius, clouds, rain, temp, dayIndex,
}) {
  const { centerLat, centerLon } = await fetchLatLon(zipCode);

  const geoLocations = createLatLonMatrix({ centerLat, centerLon, radius });
  debugger;
  const allForecasts = await fetchAllForecasts(geoLocations, dayIndex);

  const filteredForecasts = filterForecasts(allForecasts, {
    clouds, rain, temp,
  });

  const destinations = await Promise
    .all(filteredForecasts
      .map(async ({ lat, lon, ...rest }) => {
        const cityName = await fetchCityName(lat, lon);
        return {
          ...rest, lat, lon, cityName,
        };
      }));

  return destinations;
}
