import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import ResultsDisplay from "./components/ResultsDisplay";
import genreMap from "./util/genreMap";

function App() {
  // state variables and SearchBar.jsx functionality
  const [movieResults, setMovieResults] = useState([]);
  const [genreIds, setGenreIds] = useState([]);

  const handleMovieSearch = (results, genres) => {
    setMovieResults(results);
    setGenreIds(genres);
  };

  //ResultsDisplay.jsx functionality
  function convertMovieGenreToMusicGenre(index) {
    const selectedGenres = genreIds[index].map((id) => genreMap[id]).join(", ");
    return selectedGenres;
  }

  const handleGenerateClick = (index) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to generate songs similar to this movie?"
    );

    if (isConfirmed) {
      const selectedGenres = convertMovieGenreToMusicGenre(index); // temp variable, not saved
      console.log(selectedGenres);
      //spotify api call
    }
  };

  //spotify results
  // create state var to pass into resultsdisplay

  return (
    <div className="app-container">
      <SearchBar handleMovieSearch={handleMovieSearch} />
      {/* for future:
      if-else {spotifyResults.length > 0 && (
        <ResultsDisplay
          searchResults={spotifyResults}
          handleGenerateClick={handleGenerateClick} - handle add/favorite click
        />
      )} */}
      {movieResults.length > 0 && (
        <ResultsDisplay
          searchResults={movieResults}
          genreIds={genreIds}
          handleGenerateClick={handleGenerateClick}
        />
      )}
    </div>
  );
}

export default App;
