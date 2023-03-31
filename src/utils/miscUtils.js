export function createLatLonMatrix({ centerLat, centerLon, radius }) {
  const matrixStep = 1;
  const northBoundary = centerLat + radius;
  const southBoundary = centerLat - radius;
  const eastBoundary = centerLon - radius;
  const westBoundary = centerLon + radius;
  const innerNorthBoundary = northBoundary - 1;
  const innerSouthBoundary = southBoundary + 1;
  const innerEastBoundary = eastBoundary + 1;
  const innerWestBoundary = westBoundary - 1;

  const matrix = [];

  function coordinatesInVoid(newLat, newLon) {
    return (newLat <= innerNorthBoundary && newLat >= innerSouthBoundary)
    && (newLon <= innerWestBoundary && newLon >= innerEastBoundary);
  }

  for (let newLat = northBoundary; newLat >= southBoundary; newLat -= matrixStep) {
    for (let newLon = westBoundary; newLon >= eastBoundary; newLon -= matrixStep) {
      if (!coordinatesInVoid(newLat, newLon)) {
        matrix.push({ lat: newLat, lon: newLon });
      }
    }
  }
  return matrix;
}

export function filterForecasts(allForecasts, {
  clouds, rain, temp,
}) {
  const MAX_WIND_SPEED = 10;
  return allForecasts.filter(({
    daily: {
      precipitation: { rain: dayRain }, windSpeed, cloudCover, temp: { day: dayTemp },
    },
  }) => cloudCover <= clouds
    && dayRain <= rain
    && dayTemp >= temp
    && windSpeed <= MAX_WIND_SPEED);
}
