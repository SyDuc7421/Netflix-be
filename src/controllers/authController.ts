import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import Token from "../models/token";

const signIn = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const currentUser = await User.findOne({ email });

    if (!currentUser) {
      return res.status(400).json({
        message: "User does not exist.",
      });
    }

    if (password !== currentUser.password) {
      return res.status(400).json({
        message: "Email or password is incorrect.",
      });
    }

    const refreshToken = await generateRefreshToken(currentUser.email);

    // Each user only have one refresh token
    if (!refreshToken) {
      return res.status(400).json({
        message: "User aldready login in another device.",
      });
    }

    return res.status(200).json({
      accessToken: generateAccessToken(currentUser.email),
      refreshToken: refreshToken,
      username: currentUser.username,
      email: currentUser.email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error failed to sign in user.",
    });
  }
};

const signUp = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User or email already exist.",
      });
    }

    const newUser = new User(req.body);
    await newUser.save();

    return res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error failed to sign up user.",
    });
  }
};

const generateAccessToken = (email: string) => {
  if (!email) {
    return;
  }
  return jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = async (email: string) => {
  const alreadyExist = await Token.findOne({ email });

  if (alreadyExist) {
    // TODO: Xử lý ntn nếu email đã được sử dụng để có 1 refreshToken?
    return;
  }

  const refreshToken = jwt.sign(
    { email: email },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );

  const createdAt = new Date();
  const expiresAt = new Date(createdAt);
  expiresAt.setDate(expiresAt.getDate() + 7);

  const newToken = new Token({
    email,
    token: refreshToken,
    createdAt: createdAt.toString(),
    expiresAt: expiresAt.toString(),
  });

  await newToken.save();

  return refreshToken;
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token is not null.",
    });
  }

  const token = await Token.findOne({ token: refreshToken });

  if (!token) {
    return res.status(403).json({
      message: "Refresh token does not exist.",
    });
  }
  //   TODO: Check refresh token belongs to true user
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    async (error: any, infos: any) => {
      if (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
          // Delete refresh token if it has expired
          const currentToken = await Token.findOne({ token: refreshToken });
          if (currentToken) {
            await currentToken.deleteOne();
            return res.status(403).json({
              message: "Refresh token has expired.",
            });
          }
        }
        return res.status(403).json({
          message: "Refresh token is incorrect.",
        });
      }

      return res.status(200).json({
        accessToken: generateAccessToken(infos.email),
      });
    }
  );
};

const logout = async (req: Request, res: Response) => {
  const email = req.email || "";

  const currentToken = await Token.findOne({ email });

  if (!currentToken) {
    return res.status(403).json({ message: "Forbidden." });
  }

  await currentToken.deleteOne();

  return res.status(200).json({
    message: "User logged out successfully.",
  });
};

export default { signIn, signUp, refreshToken, logout };
