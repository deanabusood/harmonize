const express = require("express");
const axios = require("axios");
const router = express.Router();

//SPOTIFY - request access token using client id and secret
const getAccessToken = async () => {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const authorizationString = clientId + ":" + clientSecret;

    // post request to obtain access token
    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization: `Basic ${Buffer.from(authorizationString).toString(
          "base64"
        )}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: "grant_type=client_credentials",
    });

    const accessToken = response.data.access_token;

    return accessToken;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Spotify recommendations route
router.get("/get-spotify-recommendations", async (req, res) => {
  try {
    const { seed_genres, limit } = req.query; //selectedGenres, 20
    const accessToken = await getAccessToken();

    // get request to spotify recommendations endpoint using the access token
    const response = await axios.get(
      "https://api.spotify.com/v1/recommendations",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          seed_genres,
          limit,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
  }
});

//USER AUTH FOR PLAYLIST CREATION
const getUserAccessToken = async (code) => {
  try {
    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://harmonize-server.onrender.com/spotify/callback",
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to obtain user access token");
  }
};
//FETCH ID SERVER-SIDE
const getUserId = async (accessToken) => {
  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.id;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch user id");
  }
};
//AUTH FORM
router.get("/authorize", (req, res) => {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = "https://harmonize-server.onrender.com/spotify/callback";
  const scopes = "playlist-modify-private";

  const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(
    scopes
  )}`;

  res.redirect(authorizeUrl);
});
//CALLBACK
router.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const userAccessToken = await getUserAccessToken(code);
    res.cookie("spotifyToken", userAccessToken);

    res.redirect("https://harmonized.vercel.app");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to authenticate");
  }
});

const createPlaylist = async (userAccessToken, songIds) => {
  const playlistName = "Harmonize";
  const playlistDescription = "This playlist was created by harmonize";
  const userId = await getUserId(userAccessToken);

  try {
    //create playlist
    const playlistResponse = await axios({
      method: "post",
      url: `https://api.spotify.com/v1/users/${userId}/playlists`,
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
        "Content-Type": "application/json",
      },
      data: {
        name: playlistName,
        public: false,
        description: playlistDescription,
      },
    });
    //get playlist id
    const playlistId = playlistResponse.data.id;
    //add items to playlist
    const addItemsResponse = await axios({
      method: "post",
      url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
        "Content-Type": "application/json",
      },
      data: {
        uris: songIds.map((songId) => `spotify:track:${songId}`),
      },
    });

    return addItemsResponse.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create or add tracks to the playlist");
  }
};

router.post("/create-playlist", async (req, res) => {
  const { songIds } = req.body;
  const userAccessToken = req.headers.authorization.split(" ")[1];

  try {
    const playlistResponse = await createPlaylist(userAccessToken, songIds);

    res.status(200).json({
      message: "Playlist created successfully",
      playlist: playlistResponse,
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ message: "Failed to create playlist" });
  }
});

module.exports = router;
