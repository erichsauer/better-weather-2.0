/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import './App.css';
import Destinations from './components/Destinations';
import FormControls from './components/FormControls';

function App() {
  const [destinations, setDestinations] = useState([]);

  return (
    <div className="App">
      <main className="App-main">
        Better Weather
        <FormControls {...{ setDestinations }} />
        <Destinations destinations={destinations} />
      </main>
    </div>
  );
}

export default App;
