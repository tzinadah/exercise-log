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
  res.status(200).sendFile(__dirname + "/public/index.html");
});

server.get("/register", (req, res) => {
  res.status(200).sendFile(__dirname + "/public/user-form.html");
});

server.get("/:username/log", (req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      if (user) {
        res.status(200).sendFile(__dirname + "/public/exercise-form.html");
      } else {
        res.status(404).json({ message: "Username wasn't found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
});

server.get("/users", (req, res) => {
  User.find({}, { username: 1, exercises: 0, _id: 0, __v: 0 })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.status(500).json({ message: "Internal server error" }));
});

server.get("/:username", (req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      if (user) {
        res.status(200).json(user.exercises);
      } else {
        res.status(404).json({ message: "Username wasn't found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
});

// Post endpoints
server.post("/users", (req, res) => {
  const user = new User({ username: req.body.username, exercises: [] });
  user
    .save()
    .then((savedUser) => {
      res.status(201).json({ message: "User created succesfully" });
    })
    .catch((err) => {
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
