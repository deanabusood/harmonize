const express = require("express");
const router = express.Router();
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//register new user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    //check if already exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    //create new user with password (prehashed in userModel)
    const newUser = new UserModel({ username, password });

    //save user to db
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
});

//user login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    //find username
    const user = await UserModel.findOne({ username });
    if (!user) {
      console.log("NO USER FOUND");
      return res.status(401).json({ message: "User not found" });
    }

    //compare password with hashed password in db
    const passwordMatch = await bcrypt.compare(
      password.trim(),
      user.password.trim()
    );

    if (!passwordMatch) {
      console.log("Passwords do not match");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //create jwt token
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      {
        // expiresIn: "1h", //expiration time
      }
    );
    res.cookie("token", token);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

//post user favorites
router.post("/favorites/add", async (req, res) => {
  try {
    const { username, selectedSong } = req.body;

    //find username
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //check if already in db -> (note: or do it internally)
    const isAlreadyAdded = user.favorites.some(
      (song) => song.id === selectedSong.id
    );
    if (isAlreadyAdded) {
      return res.status(400).json({ message: "Song already in favorites" });
    }

    //otherwise add to db
    user.favorites.push(selectedSong);
    await user.save();

    res.status(200).json({ message: "Song added to favorites" });
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: "Error adding favorite" });
  }
});

//remove user favorite
router.post("/favorites/remove", async (req, res) => {
  try {
    const { username, songId } = req.body;

    //find user
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //filter out song based on songId
    const updatedFavorites = user.favorites.filter(
      (song) => song.id !== songId
    );
    //update existing favorites
    user.favorites = updatedFavorites;

    await user.save();

    res.status(200).json({ message: "Song removed from favorites" });
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ message: "Error removing favorite" });
  }
});

//get user favorites
router.get("/favorites/:username", async (req, res) => {
  try {
    const username = req.params.username;

    //find user
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //retrieve favorites
    const favorites = user.favorites;

    //return favorites
    res.status(200).json({ favorites });
  } catch (error) {
    console.error("Error getting favorites:", error);
    res.status(500).json({ message: "Error getting favorites" });
  }
});

module.exports = router;
