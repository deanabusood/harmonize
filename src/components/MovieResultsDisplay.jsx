import imageNotFound from "../img/image-not-found.png";
import "../css/ResultsDisplay.css";

function MovieResultsDisplay({ searchResults, handleGenerateClick }) {
  if (!searchResults) {
    return <> </>; // needed to prevent empty data
  }

  return (
    <ul className="results-list">
      {searchResults.map((result, index) => (
        <li key={result.id} className="result-item">
          <a
            href={`https://www.themoviedb.org/movie/${result.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={
                result.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                  : imageNotFound
              }
              alt={result.title}
            />
          </a>
          <div className="result-details">
            <p>{result.title}</p>
            {result.release_date && <p>({result.release_date})</p>}
          </div>
          <button onClick={() => handleGenerateClick(index)}>
            Generate songs
          </button>
        </li>
      ))}
    </ul>
  );
}

export default MovieResultsDisplay;
