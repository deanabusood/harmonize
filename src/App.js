import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import ResultsDisplay from "./components/ResultsDisplay";

function App() {
  const [movieResults, setMovieResults] = useState([]);
  const [genreIds, setGenreIds] = useState([]);

  const handleMovieSearch = (results, genres) => {
    setMovieResults(results);
    setGenreIds(genres);
  };

  const handleMovieClick = (index) => {
    const selectedGenres = genreIds[index];
    console.log("Movie ID:", selectedGenres);
  };

  return (
    <div className="app-container">
      <SearchBar handleMovieSearch={handleMovieSearch} />
      {movieResults.length > 0 && (
        <ResultsDisplay
          searchResults={movieResults}
          genreIds={genreIds}
          onMovieGenerate={handleMovieClick}
        />
      )}
      {/* {used for spotify api with same resultsdisplay component} */}
    </div>
  );
}

export default App;
