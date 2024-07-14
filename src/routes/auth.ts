import express from "express";
import authController from "../controllers/authController";

import { checkJwt } from "../middleware/auth";

const route = express.Router();

route.post("/sign-in", authController.signIn);

route.post("/sign-up", authController.signUp);

route.post("/refresh-token", authController.refreshToken);

route.delete("/logout", checkJwt, authController.logout);

// TODO: Change password API

export default route;
