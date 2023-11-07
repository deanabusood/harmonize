const PORT = 8000;
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());

app.get("/search-movies", async (req, res) => {
  try {
    const { query } = req.query; // movie title

    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&page=1`;
    const headers = {
      Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
    };

    const response = await axios.get(url, { headers });

    res.json(response.data);
  } catch (error) {
    console.error(error);
  }
});

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

app.get("/get-spotify-recommendations", async (req, res) => {
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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
