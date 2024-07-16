import mongoose from "mongoose";

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  thumbnail: {
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
  // TODO: A movie belong to unique user
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
