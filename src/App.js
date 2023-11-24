import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import MovieResultsDisplay from "./components/MovieResultsDisplay";
import SpotifyResultsDisplay from "./components/SpotifyResultsDisplay";
import genreMap from "./util/genreMap";
import {
  searchSpotifyRecommendations,
  addToFavorites,
} from "./services/ApiService";
import CollectionManager from "./components/CollectionManager";
import AuthForm from "./components/AuthForm";

function App() {
  //state variables and SearchBar.jsx functionality
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      const selectedGenres = convertMovieGenreToMusicGenre(index); //temp variable, not saved
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
    const uniqueGenres = [...new Set(selectedGenres.split(","))]; //remove duplicates
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

  const handleAddClick = async (index) => {
    const selectedSong = spotifyResults.tracks[index];
    const isAlreadyAdded = addedSongs.some(
      (song) => song.id === selectedSong.id
    );
    if (isAlreadyAdded) {
      alert("This song is already in your favorites!");
    } else {
      const isConfirmed = window.confirm(
        "Would you like to add this song to your favorites?"
      );

      if (isConfirmed) {
        try {
          await addToFavorites(username, selectedSong, token);

          setAddedSongs([...addedSongs, selectedSong]); //TEMP
        } catch (error) {
          console.error("Error adding song to favorites:", error);
        }
      }
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
  //AuthForm.jsx functionality
  const handleModalClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLoginSuccess = (token, username) => {
    setToken(token);
    setUsername(username);
    setIsLoggedIn(true);
    setIsModalOpen(false);
    console.log("User logged in, app.js");
  };

  const handleLogout = () => {
    setToken("");
    setUsername("");
    setIsLoggedIn(false);
    console.log("User logged out, app.js");
  };

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

      <button onClick={isLoggedIn ? handleLogout : handleModalClick}>
        {isLoggedIn ? "Logout" : "Open"}
      </button>

      {isModalOpen && (
        <AuthForm
          onClose={handleModalClick}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default App;
