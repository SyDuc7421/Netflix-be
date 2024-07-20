import express, { Response, Request } from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

import AuthRoute from "./routes/authRoute";
import AccountRoute from "./routes/accountRoute";
import MovieRoute from "./routes/movieRoute";

const app = express();

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log("Connected to mongodb");
});

app.use(express.json());
app.use(cors());

app.get("/health", async (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      message: "Health OK",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

app.use("/api/auth", AuthRoute);
app.use("/api/account", AccountRoute);
app.use("/api/movie", MovieRoute);

app.listen(3000, () => {
  console.log("Server started on localhost:3000");
});
