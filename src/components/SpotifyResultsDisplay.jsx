import imageNotFound from "../img/image-not-found.png";
import "../css/ResultsDisplay.css";

function SpotifyResultsDisplay({ searchResults, handleGenerateClick }) {
  if (!searchResults || !searchResults.tracks) {
    return <> </>; // needed to prevent empty data
  }

  return (
    <ul className="results-list">
      {searchResults.tracks.map((result, index) => (
        <li key={result.id} className="result-item">
          <a
            href={result.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={
                result.album.images.length > 0
                  ? result.album.images[0].url
                  : imageNotFound
              }
              alt={result.name}
            />
          </a>
          <div className="result-details">
            <p>{result.name}</p>
            <p>{result.artists.map((artist) => artist.name).join(", ")}</p>
          </div>
          <button onClick={() => handleGenerateClick(index)}>
            Add to Favorites
          </button>
        </li>
      ))}
    </ul>
  );
}

export default SpotifyResultsDisplay;
