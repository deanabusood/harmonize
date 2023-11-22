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

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user with password
    const newUser = new UserModel({ username, password: hashedPassword });

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
      return res.status(401).json({ message: "User not found" });
    }

    //compare password with hashed password in db
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //create jwt token
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", //expiration time
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
