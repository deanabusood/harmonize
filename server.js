const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./db/db");
const movieRoutes = require("./routes/movieRoutes");
const spotifyRoutes = require("./routes/spotifyRoutes");
require("dotenv").config();

const PORT = 8000;
const app = express();

app.use(cors());

//database connection
connectDB()
  .then(() => {
    //routes
    app.use("/movies", movieRoutes);
    app.use("/spotify", spotifyRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
