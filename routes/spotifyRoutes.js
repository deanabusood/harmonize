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

module.exports = router;
