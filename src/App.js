import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import MovieResultsDisplay from "./components/MovieResultsDisplay";
import SpotifyResultsDisplay from "./components/SpotifyResultsDisplay";
import genreMap from "./util/genreMap";
import {
  searchSpotifyRecommendations,
  addToFavorites,
  getUserFavorites,
  removeFromFavorites,
} from "./services/ApiService";
import CollectionManager from "./components/CollectionManager";
import AuthForm from "./components/AuthForm";
import loginSvg from "./img/log-in.svg";
import logoutSvg from "./img/log-out.svg";
import "./index.css";

function App() {
  //state variables and SearchBar.jsx functionality
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");
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
        if (isLoggedIn) {
          try {
            await addToFavorites(username, selectedSong, token);

            const updatedFavorites = await getUserFavorites(username);

            setAddedSongs(updatedFavorites);
          } catch (error) {
            console.error("Error adding song to favorites:", error);
          }
        } else {
          setAddedSongs([...addedSongs, selectedSong]);
        }
      }
    }
  };

  const handleRemoveClick = async (songId) => {
    const isConfirmed = window.confirm(
      "Would you like to remove this song from your favorites?"
    );

    if (isConfirmed) {
      try {
        if (isLoggedIn) {
          await removeFromFavorites(username, songId, token);
        }

        const updatedSongs = addedSongs.filter((song) => song.id !== songId);
        setAddedSongs(updatedSongs);
      } catch (error) {
        console.error("Error removing song from favorites:", error);
      }
    }
  };

  //AuthForm.jsx functionality
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLoginSuccess = async (token, username) => {
    try {
      setToken(token);
      setUsername(username);
      setIsLoggedIn(true);
      setIsModalOpen(false);
      console.log(username + " logged in, app.js");

      //fetch user favorites and set state
      const favorites = await getUserFavorites(username);
      setAddedSongs(favorites);
    } catch (error) {
      console.error("Error fetching user favorites:", error);
    }
  };

  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");

    if (isConfirmed) {
      setToken("");
      setUsername("");
      setIsLoggedIn(false);
      setAddedSongs([]);
      setMovieResults([]);
      setSpotifyResults([]);
      setGenreIds([]);
      console.log(username + " logged out, app.js");
    }
  };

  return (
    <div className="app-container">
      <div id="navbar-container">
        <CollectionManager
          addedSongs={addedSongs}
          onRemoveClick={handleRemoveClick}
        />

        <img
          src={isLoggedIn ? logoutSvg : loginSvg}
          alt={isLoggedIn ? "Log Out" : "Log In"}
          style={{ cursor: "pointer" }}
          onClick={isLoggedIn ? handleLogout : handleModalClick}
        />
      </div>

      {isModalOpen && (
        <AuthForm
          onClose={handleModalClick}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

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
    </div>
  );
}

export default App;
