import express from "express";
import accountController from "../controllers/accountController";
import { checkJwt } from "../middleware/auth";
import { validateCreateAccountRequest } from "../middleware/validation";

const route = express.Router();

route.post(
  "/",
  checkJwt,
  validateCreateAccountRequest,
  accountController.createAccount
);

route.get("/", checkJwt, accountController.getAllAccounts);

route.get("/:accountId", checkJwt, accountController.getAccountById);
route.get("/:accountId/favorites", checkJwt, accountController.getFavorite);

route.patch("/:accountId", checkJwt, accountController.addFavoriteMovie);

route.patch("/:accountId", checkJwt, accountController.updateAccount);

export default route;
