function RecommendationList({ recommendations }) {
    if (!recommendations?.length) return null;
  
    return (
      <div className="recommendations">
        <h2>Top 5 Places to Visit</h2>
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index}>
              <h3>{rec.name}</h3>
              <p>{rec.description}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default RecommendationList;