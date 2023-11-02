const PORT = 8000;
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());

app.get("/search-movies", async (req, res) => {
  try {
    const { query } = req.query;

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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
