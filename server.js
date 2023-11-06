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

// app.get("/search-spotify", async (req, res) => {
//   try {
//     const { query } = req.query; // use spotify genres from movie

//     // spotify api endpoint
//     const url = `https://api.spotify.com/v1/recommendations?limit=1&seed_genres=${query}`;
//     const headers = {
//       Authorization: `Bearer ${process.env.SPOTIFY_BEARER_TOKEN}`,
//     };

//     const response = await axios.get(url, { headers });

//     res.json(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// });

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
