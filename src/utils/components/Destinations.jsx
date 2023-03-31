/* eslint-disable react/prop-types */
import React from 'react';

function Destinations({ destinations }) {
  return (
    <div>
      {destinations.map((destination) => (
        <div>{destination.name}</div>))}

    </div>
  );
}

export default Destinations;
