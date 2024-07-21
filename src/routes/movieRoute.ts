import express from "express";
import movieController from "../controllers/movieController";
import { checkJwt } from "../middleware/auth";
import { validateAddMovieRequest } from "../middleware/validation";

const route = express.Router();

route.post("/", checkJwt, validateAddMovieRequest, movieController.addMovie);
route.get("/", checkJwt, movieController.getMovie);
route.get("/:movieId", checkJwt, movieController.getMovieById);
route.patch("/:movieId", checkJwt, movieController.updateMovie);
route.delete("/:movieId", checkJwt, movieController.deleteMovie);

export default route;
