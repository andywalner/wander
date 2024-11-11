import { useState } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [submittedCity, setSubmittedCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedCity(city);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Wander</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter a city..."
          />
          <button type="submit">Search</button>
        </form>
        {submittedCity && (
          <div className="city-result">
            <h2>Showing results for: {submittedCity}</h2>
          </div>
        )}
      </header>
    </div>
  );
}

export default App; 