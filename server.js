import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

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

// Static get endpoints
server.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/user-form.html");
});

server.get("/:username/log", (req, res) => {
  res.sendFile(__dirname + "/public/exercise-form.html");
});

// Starting server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
