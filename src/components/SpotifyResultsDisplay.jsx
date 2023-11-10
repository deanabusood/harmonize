import imageNotFound from "../img/image-not-found.png";

function SpotifyResultsDisplay({ searchResults, handleGenerateClick }) {
  if (!searchResults || !searchResults.tracks) {
    return <> </>; // needed to prevent empty data
  }

  return (
    <ul className="results-list">
      {searchResults.tracks.map((result, index) => (
        <li key={result.id} className="result-item">
          <img
            src={
              result.album.images.length > 0
                ? result.album.images[0].url
                : imageNotFound
            }
            alt={result.name}
          />
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
