const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/search-movies", async (req, res) => {
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

module.exports = router;
