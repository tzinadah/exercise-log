import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";

// Init
dotenv.config();
const server = express();
const __dirname = import.meta.dirname;
const PORT = process.env.PORT || 3000;

// Connecting to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("Connected to database"))
  .catch((err) => console.error(err));

// Logger middleware
server.use((req, res, next) => {
  console.log("request: ", req.method, req.url);
  next();
});

// Middleware for post body parsing
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Get endpoints
server.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/user-form.html");
});

server.get("/:username/log", (req, res) => {
  // TODO check validity of username
  res.sendFile(__dirname + "/public/exercise-form.html");
});

// Post endpoints
server.post("/users", (req, res) => {
  const user = new User({ username: req.body.username, exercises: [] });
  user
    .save()
    .then((savedUser) => {
      console.log(`Saved document ${savedUser}`);
      res.status(201).json({ message: "User created succesfully" });
    })
    .catch((err) => {
      console.error(err);
      // handles duplicates
      if (err.code === 11000) {
        res.status(409).json({ message: "Username already exists" });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    });
});

// Starting server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
