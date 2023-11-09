function SpotifyResultsDisplay({ searchResults, handleGenerateClick }) {
  console.log("searchResults in SpotifyResultsDisplay:", searchResults);

  if (!searchResults || !searchResults.tracks) {
    return <> </>; // needed to prevent empty data
  }

  return (
    <ul className="results-list">
      {searchResults.tracks.map((track, index) => (
        <li key={track.id} className="result-item">
          {/* Display Spotify recommendation details here */}
          <div className="result-details">
            <p>{track.name}</p>
            <p>{track.artists.map((artist) => artist.name).join(", ")}</p>
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
