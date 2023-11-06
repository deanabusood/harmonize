import imageNotFound from "../img/image-not-found.png";

function ResultsDisplay({ searchResults, genreIds, handleGenerateClick }) {
  return (
    <ul className="results-list">
      {searchResults.map((result, index) => (
        <li key={result.id} className="result-item">
          <img
            src={
              result.poster_path
                ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                : imageNotFound
            }
            alt={result.title}
          />
          <div className="result-details">
            <p>{result.title}</p>
            <p>{result.id}</p>
          </div>
          {/* temp onClick */}
          <button onClick={() => handleGenerateClick(index)}>Generate</button>
        </li>
      ))}
    </ul>
  );
}

export default ResultsDisplay;
