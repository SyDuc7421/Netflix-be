import mongoose from "mongoose";

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
  },
  duration: {
    type: String,
    default: "1 minute",
  },
  createdAt: {
    type: String,
    default: Date.now().toString(),
  },
  updatedAt: {
    type: String,
    default: Date.now().toString(),
  },
  // TODO: A movie belong to unique user
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
