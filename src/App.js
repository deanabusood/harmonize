import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import MovieResultsDisplay from "./components/MovieResultsDisplay";
import SpotifyResultsDisplay from "./components/SpotifyResultsDisplay";
import genreMap from "./util/genreMap";
import { searchSpotifyRecommendations } from "./services/ApiService";

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
    const selectedGenres = genreIds[index].map((id) => genreMap[id]).join(",");
    return selectedGenres;
  }

  //spotify results
  const [spotifyResults, setSpotifyResults] = useState([]);

  //spotify api request
  const handleGenerateClick = async (index) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to generate songs similar to this movie?"
    );

    if (isConfirmed) {
      const selectedGenres = convertMovieGenreToMusicGenre(index); // temp variable, not saved
      try {
        const recommendations = await searchSpotifyRecommendations(
          selectedGenres
        );
        updateResultStates(recommendations);
      } catch (error) {
        console.error(error);
      }
    }
  };

  function updateResultStates(recommendations) {
    setSpotifyResults(recommendations);
    setMovieResults([]);
  }

  const handleAddClick = (index) => {
    const isConfirmed = window.confirm(
      "Would you like to add this song to your favorites?"
    );

    if (isConfirmed) {
      console.log("SAVED SONG: " + index);
    }
  };

  return (
    <div className="app-container">
      <SearchBar handleMovieSearch={handleMovieSearch} />
      {spotifyResults && (
        <SpotifyResultsDisplay
          searchResults={spotifyResults}
          handleGenerateClick={handleAddClick}
        />
      )}
      {movieResults && (
        <MovieResultsDisplay
          searchResults={movieResults}
          handleGenerateClick={handleGenerateClick}
        />
      )}
    </div>
  );
}

export default App;
