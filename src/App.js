import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import ResultsDisplay from "./components/ResultsDisplay";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [genreIds, setGenreIds] = useState([]);

  const handleSearch = (results, genres) => {
    setSearchResults(results);
    setGenreIds(genres);
  };

  const handleMovieClick = (index) => {
    const selectedGenres = genreIds[index];
    console.log("Genres:", selectedGenres);
  };

  return (
    <div className="app-container">
      <SearchBar onSearch={handleSearch} />
      {searchResults.length > 0 && (
        <ResultsDisplay
          searchResults={searchResults}
          genreIds={genreIds}
          onMovieClick={handleMovieClick}
        />
      )}
    </div>
  );
}

export default App;
