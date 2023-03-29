/* eslint-disable react/prop-types */
import React from 'react';

function Destinations({ destinations }) {
  return (
    <div>{destinations.map((destination) => console.log(destination))}</div>
  );
}

export default Destinations;
