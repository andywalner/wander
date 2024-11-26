import { useState } from 'react';
import './App.css';
import OpenAI from "openai";

function App() {
  const [city, setCity] = useState('');
  const [submittedCity, setSubmittedCity] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    
    if (loading) return;

    setSubmittedCity(city);
    setLoading(true);
    
    try {
      const openai = new OpenAI({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { 
            role: "system", 
            content: "You are a travel guide expert. Return only a raw JSON array of objects, each with 'name' and 'description' properties. Do not include markdown formatting or code blocks." 
          },
          {
            role: "user",
            content: `Give me exactly 5 must-visit places in ${city}. Response must be a JSON array of objects, each with 'name' and 'description' fields.`
          }
        ],
      });

      const cleanedContent = completion.choices[0].message.content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const recommendations = JSON.parse(cleanedContent);
      setRecommendations(recommendations);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? (
              <span className="loading-spinner">↻</span>
            ) : (
              'Search'
            )}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-message">
            <span className="loading-spinner">↻</span>
            <p>Finding the best places in {submittedCity}...</p>
          </div>
        )}

        {submittedCity && !loading && !error && (
          <div className="city-result">
            <h2>Showing results for: {submittedCity}</h2>
            {recommendations.length > 0 && (
              <div className="recommendations">
                {recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-card">
                    <div className="recommendation-header">
                      <h3>{rec.name}</h3>
                      <button
                        onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(rec.name)}`, '_blank')}
                        className="youtube-button"
                        title="Search on YouTube"
                      >
                        🎥
                      </button>
                    </div>
                    <p>{rec.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App; 