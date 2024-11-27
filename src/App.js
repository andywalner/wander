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
    setError(null);
    
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
            content: "You are a no bullshit travel guide who shares useful details in the tone of a helpful friend. Return only a raw JSON array of objects. Each object must have exactly these fields: 'name', 'vibe', 'bestFor', 'customField1Name', 'customField1Value', 'customField2Name', 'customField2Value'. The custom fields should be relevant to the type of place (e.g., for a restaurant: customField1Name='Cuisine', customField1Value='Italian'). Do not include markdown formatting or code blocks."
          },
          {
            role: "user",
            content: `Give me exactly 5 must-visit places in ${city}. For each place, include name, vibe, what it's best for, and two custom fields that are relevant to that specific place. For example, a restaurant might have 'Food' with highlights of the food and 'Price Range', a cocktail bar might have "Drinks", a park might have 'Activities', a museum might have 'Famous Works', a mall might have "Things to See". These don't need to be literal examples - feel free to use whatever custom fields are most interesting and useful to highlight the place! Return details in full sentences in the tone of a helpful friend.`
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
                        onClick={() => window.open(`https://www.tiktok.com/search?q=${encodeURIComponent(rec.name)}`, '_blank')}
                        className="youtube-button"
                        title="Search on TikTok"
                      >
                        📱
                      </button>
                    </div>
                    <p><strong>Vibe:</strong> {rec.vibe}</p>
                    <p><strong>Best For:</strong> {rec.bestFor}</p>
                    <p><strong>{rec.customField1Name}:</strong> {rec.customField1Value}</p>
                    <p><strong>{rec.customField2Name}:</strong> {rec.customField2Value}</p>
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