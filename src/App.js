import React, { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import MovieResultsDisplay from "./components/MovieResultsDisplay";
import SpotifyResultsDisplay from "./components/SpotifyResultsDisplay";
import genreMap from "./util/genreMap";
import {
  searchSpotifyRecommendations,
  addToUserFavorites,
  getUserFavorites,
  removeFromUserFavorites,
} from "./util/apiHandler";
import CollectionManager from "./components/CollectionManager";
import AuthForm from "./components/AuthForm";
import loginSvg from "./img/log-in.svg";
import logoutSvg from "./img/log-out.svg";
import "./index.css";

function App() {
  //state variables and SearchBar.jsx functionality
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
      const selectedGenres = convertMovieGenreToMusicGenre(index);
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
    const uniqueGenres = [...new Set(selectedGenres.split(","))]; //remove duplicate genres
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

  const fetchUserFavorites = async () => {
    try {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        setIsLoggedIn(true);
        const favorites = await getUserFavorites(storedToken);
        setAddedSongs(favorites);
      } else {
        localStorage.removeItem("token"); //test
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error fetching user favorites:", error);
    }
  };

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
          const storedToken = localStorage.getItem("token");

          if (storedToken) {
            await addToUserFavorites(selectedSong, storedToken);
            await fetchUserFavorites();
          } else {
            setAddedSongs([...addedSongs, selectedSong]);
          }
        } catch (error) {
          console.error("Error adding song to favorites:", error);
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
        const storedToken = localStorage.getItem("token");

        if (isLoggedIn && storedToken) {
          await removeFromUserFavorites(songId, storedToken);
          const updatedSongs = addedSongs.filter((song) => song.id !== songId);
          setAddedSongs(updatedSongs);
        } else {
          const updatedSongs = addedSongs.filter((song) => song.id !== songId); //not logged in
          setAddedSongs(updatedSongs);
        }
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

  const handleLoginSuccess = async (token) => {
    try {
      localStorage.setItem("token", token);

      setIsLoggedIn(true);
      setIsModalOpen(false);

      //fetch user favorites and set state
      await fetchUserFavorites();
    } catch (error) {
      console.error("Error fetching user favorites:", error);
    }
  };

  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");

    if (isConfirmed) {
      localStorage.removeItem("token");

      setIsLoggedIn(false);
      setAddedSongs([]);
      setMovieResults([]);
      setSpotifyResults([]);
      setGenreIds([]);
    }
  };

  useEffect(() => {
    fetchUserFavorites();
  }, []);

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
