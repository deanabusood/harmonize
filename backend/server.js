const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./db/db");
const movieRoutes = require("./routes/movieRoutes");
const spotifyRoutes = require("./routes/spotifyRoutes");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());

//database connection
connectDB()
  .then(() => {
    //routes
    app.use("/movies", movieRoutes);
    app.use("/spotify", spotifyRoutes);
    app.use("/user", userRoutes);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });
