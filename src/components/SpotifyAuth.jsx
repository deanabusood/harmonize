import axios from "axios";
import Cookies from "js-cookie";
import "../css/SpotifyAuth.css";
import SpotifyIcon from "../img/spotify_icon.svg";
import React, { useEffect, useState } from "react";

const SpotifyAuth = ({ addedSongs }) => {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = Cookies.get("spotifyToken");
    // console.log(token);
    if (token) {
      setAuthorized(true);
    }
  }, []);

  const handleAuth = () => {
    //pop out window to not reset main display
    const authUrl = "http://localhost:8000/spotify/authorize?show_dialog=true";
    const spotifyAuthWindow = window.open(
      authUrl,
      "SpotifyAuth",
      "width=400,height=500"
    );

    const checkAuthorization = setInterval(() => {
      const newToken = Cookies.get("spotifyToken");
      if (newToken) {
        clearInterval(checkAuthorization);
        setAuthorized(true);
        spotifyAuthWindow.close();
      }
    }, 100);
  };

  const handleUpload = () => {
    if (addedSongs.length === 0) {
      window.alert("There are no saved songs");
      return;
    }

    const token = Cookies.get("spotifyToken");
    const songIds = addedSongs.map((song) => song.id);

    axios
      .post(
        "http://localhost:8000/spotify/create-playlist",
        { songIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("Playlist uploaded to Spotify:", response.data);
      })
      .catch((error) => {
        console.error("Error uploading playlist:", error);
      });
  };

  const handleLogout = () => {
    Cookies.remove("spotifyToken");
    setAuthorized(false);
  };

  return (
    <div id="spotify-auth-container">
      {!authorized ? (
        <button id="spotify-login-button" onClick={handleAuth}>
          <div className="button-content">
            <img src={SpotifyIcon} alt="Spotify Icon" />
            <span>Link with Spotify</span>
          </div>
        </button>
      ) : (
        <div>
          <button id="spotify-upload-button" onClick={handleUpload}>
            <div className="button-content">
              <img src={SpotifyIcon} alt="Spotify Icon" />
              <span>Upload playlist to Spotify</span>
            </div>
          </button>

          <button id="spotify-logout-button" onClick={handleLogout}>
            <div className="button-content">
              <img src={SpotifyIcon} alt="Spotify Icon" />
              <span>Logout from Spotify</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default SpotifyAuth;
