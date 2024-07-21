import { Request, Response } from "express";
import Movie from "../models/movie";

const addMovie = async (req: Request, res: Response) => {
  try {
    const title = req.body.title;

    if (!title) {
      return res.status(400).json({ message: "Movie title is not exits." });
    }
    const existingMovie = await Movie.findOne({ title });

    if (existingMovie) {
      return res.status(400).json({ message: "Movie title already exits." });
    }
    const newMovie = new Movie(req.body);
    await newMovie.save();
    return res.status(201).json(newMovie.toObject());
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error failed to add movie." });
  }
};

const getMovie = async (req: Request, res: Response) => {
  try {
    let movies;
    const title = req.query.title;

    if (title) {
      movies = await Movie.find({ title });
    } else movies = await Movie.find({});

    if (!movies) {
      return res.status(404).json({ message: "Movie title not found." });
    }

    return res.status(200).json(movies);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error failed to get movies.",
    });
  }
};

const getMovieById = async (req: Request, res: Response) => {
  try {
    const movieId = req.params.movieId;
    if (!movieId) {
      return res.status(404).json({ message: "Movie ID not found." });
    }
    const currentMovie = await Movie.findById(movieId);

    if (!currentMovie) {
      return res.status(404).json({ message: "Movie ID not found." });
    }

    return res.status(200).json(currentMovie);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error failed to get movies.",
    });
  }
};

const updateMovie = async (req: Request, res: Response) => {
  try {
    const movieId = req.params.movieId;
    if (!movieId) {
      return res.status(404).json({ message: "Movie not found." });
    }
    const currentMovie = await Movie.findById(movieId);
    if (!currentMovie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    const { title, description, videoUrl, thumbnailUrl, genre, duration } =
      req.body;

    currentMovie.title = title;
    currentMovie.description = description;
    currentMovie.videoUrl = videoUrl;
    currentMovie.thumbnailUrl = thumbnailUrl;
    currentMovie.genre = genre;
    currentMovie.duration = duration;

    await currentMovie.save();

    return res.status(200).json(currentMovie.toObject());
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error failed to update movie" });
  }
};

const deleteMovie = async (req: Request, res: Response) => {
  try {
    const movieId = req.params.movieId;
    if (!movieId) {
      return res.status(404).json({ message: "Movie not found." });
    }
    const currentMovie = await Movie.findById(movieId);
    if (!currentMovie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    await currentMovie.deleteOne();

    return res.status(200).json({ message: "Movie has been deleted." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error failed to delete movie" });
  }
};

export default {
  addMovie,
  getMovie,
  getMovieById,
  updateMovie,
  deleteMovie,
};
