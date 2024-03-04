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
import repeatSvg from "./img/repeat.svg";
import "./index.css";

function App() {
  //state variables and SearchBar.jsx functionality
  const [movieResults, setMovieResults] = useState([]);
  const [selectedMovieGenres, setSelectedMovieGenres] = useState([]);
  const [lastSelectedMovieIndex, setLastSelectedMovieIndex] = useState(null);
  const [hasGeneratedSongs, setHasGeneratedSongs] = useState(false);
  const [spotifyResults, setSpotifyResults] = useState([]);

  //MovieResultsDisplay.jsx functionality
  const handleMovieSearch = (results, genres, index) => {
    setMovieResults(results);
    setSelectedMovieGenres(genres);
    setSpotifyResults([]);
    if (hasGeneratedSongs) {
      setHasGeneratedSongs(false); //reset flag to hide repeat button
    }
    setLastSelectedMovieIndex(index); //store last movie index for repeat button
  };

  function convertMovieGenreToMusicGenre(index) {
    const selectedGenres = selectedMovieGenres[index]
      .map((id) => genreMap[id])
      .join(",");
    const uniqueGenres = [...new Set(selectedGenres.split(","))]; //remove duplicate genres
    const sanitizedGenres = uniqueGenres.slice(0, 5).join(",");
    return sanitizedGenres;
  }
  //used in handleGenerateClick
  const confirmGenerate = async (index) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to generate songs similar to this movie?"
    );

    if (isConfirmed) {
      await generateRecommendations(index);
    }
  };

  const generateRecommendations = async (index) => {
    const selectedGenres = convertMovieGenreToMusicGenre(index);
    try {
      const recommendations = await searchSpotifyRecommendations(
        selectedGenres
      );
      updateResultStates(recommendations);

      if (!hasGeneratedSongs) {
        setHasGeneratedSongs(true);
      }

      setLastSelectedMovieIndex(index);
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateClick = async (index) => {
    if (!hasGeneratedSongs) {
      await confirmGenerate(index);
    } else if (index !== null) {
      await generateRecommendations(index);
    } else {
      console.error("No movie selected to repeat recommendations.");
    }
  };

  //SpotifyResultsDisplay.jsx functionality
  function updateResultStates(recommendations) {
    setSpotifyResults(recommendations);
    setMovieResults([]);
  }

  //CollectionManager.jsx favorite songs functionality
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
      setSelectedMovieGenres([]);
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

        {isModalOpen && (
          <AuthForm
            handleModalClick={handleModalClick}
            handleLoginSuccess={handleLoginSuccess}
          />
        )}
      </div>


      <div id="search-container">
      <SearchBar handleMovieSearch={handleMovieSearch} />
      {hasGeneratedSongs &&
        (movieResults.length !== 0 || spotifyResults.length !== 0) && (
          <button
            onClick={() => handleGenerateClick(lastSelectedMovieIndex)}
            className="repeat-button"
          >
            <img src={repeatSvg} alt="Repeat Recommendations" />
          </button>
        )}
        </div>
      
      <div id="result-container">
      {movieResults && (
        <MovieResultsDisplay
          searchResults={movieResults}
          handleGenerateClick={handleGenerateClick}
        />
      )}
      {spotifyResults && (
        <SpotifyResultsDisplay
          searchResults={spotifyResults}
          handleAddClick={handleAddClick}
        />
      )}
      </div>
    </div>
  );
}

export default App;
