import React, { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import MovieResultsDisplay from "./components/MovieResultsDisplay";
import SpotifyResultsDisplay from "./components/SpotifyResultsDisplay";
import genreMap from "./util/genreMap";
import { searchSpotifyRecommendations } from "./services/ApiService";
import CollectionManager from "./components/CollectionManager";

function App() {
  // state variables and SearchBar.jsx functionality
  const [movieResults, setMovieResults] = useState([]);
  const [spotifyResults, setSpotifyResults] = useState([]);
  const [genreIds, setGenreIds] = useState([]);

  const handleMovieSearch = (results, genres) => {
    setMovieResults(results);
    setGenreIds(genres);
    setSpotifyResults([]); //if user updates current movie query
  };

  //MovieResultsDisplay.jsx functionality
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

  function convertMovieGenreToMusicGenre(index) {
    const selectedGenres = genreIds[index].map((id) => genreMap[id]).join(",");
    const uniqueGenres = [...new Set(selectedGenres.split(","))]; // remove duplicates
    const sanitizedGenres = uniqueGenres.slice(0, 5).join(",");
    return sanitizedGenres;
  }

  //SpotifyResultsDisplay.jsx functionality
  function updateResultStates(recommendations) {
    setSpotifyResults(recommendations);
    setMovieResults([]);
  }

  //CollectionManager.jsx favorite songs functionality
  const [addedSongs, setAddedSongs] = useState([]);

  const handleAddClick = (index) => {
    const isConfirmed = window.confirm(
      "Would you like to add this song to your favorites?"
    );

    if (isConfirmed) {
      const selectedSong = spotifyResults.tracks[index];
      setAddedSongs([...addedSongs, selectedSong]);
    }
  };

  const handleRemoveClick = (index) => {
    const isConfirmed = window.confirm(
      "Would you like to remove this song from your favorites?"
    );
    if (isConfirmed) {
      const updatedSongs = addedSongs.filter((song, i) => i !== index);

      setAddedSongs(updatedSongs);
    }
  };

  // FOR TESTING:
  // useEffect(() => {
  //   console.log("SPOTIFY RESULTS: ", spotifyResults);
  // }, [spotifyResults]);
  // useEffect(() => {
  //   console.log("MOVIE RESULTS: ", movieResults);
  // }, [movieResults]);
  // useEffect(() => {
  //   console.log("fav: ", addedSongs);
  // }, [addedSongs]);

  return (
    <div className="app-container">
      <SearchBar handleMovieSearch={handleMovieSearch} />

      {movieResults && (
        <MovieResultsDisplay
          searchResults={movieResults}
          handleGenerateClick={handleGenerateClick}
        />
      )}
      {spotifyResults && (
        <SpotifyResultsDisplay
          searchResults={spotifyResults}
          handleGenerateClick={handleAddClick}
        />
      )}

      <CollectionManager
        addedSongs={addedSongs}
        onRemoveClick={handleRemoveClick}
      />
    </div>
  );
}

export default App;
