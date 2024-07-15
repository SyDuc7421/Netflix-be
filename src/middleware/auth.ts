import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      email: string;
    }
  }
}

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (error: any, infos: any) => {
      if (error) {
        console.log(error);
        return res.status(403).json({ message: error });
      }
      req.email = infos.email as string;
      return next();
    }
  );
};
