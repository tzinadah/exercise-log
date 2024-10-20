import mongoose from "mongoose";

// Schemas
const exerciseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  exercises: [exerciseSchema],
});

export default mongoose.model("User", userSchema);
