import React from "react";
import imageNotFound from "../img/image-not-found.png";
import genreMap from "../genreMap";

function ResultsDisplay({ searchResults, genreIds, onMovieClick }) {
  const handleGenerateClick = (index) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to generate this?"
    );

    if (isConfirmed) {
      onMovieClick(index);
      const selectedGenres = genreIds[index]
        .map((id) => genreMap[id])
        .join(", ");
      console.log("Genres:", selectedGenres);
    }
  };

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
            {/* temp genre ids output  SOMETIME NO GENRE IDS, NEED TO CHECK BEFORE SECOND API CALL*/}
            <p>Genre IDs: {genreIds[index].join(", ")}</p>
          </div>
          {/* temp onClick */}
          <button onClick={() => handleGenerateClick(index)}>
            Generate
          </button>{" "}
        </li>
      ))}
    </ul>
  );
}

export default ResultsDisplay;
