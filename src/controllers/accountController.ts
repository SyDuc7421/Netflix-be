import { Request, Response } from "express";
import User from "../models/user";
import Account from "../models/account";
import Movie from "../models/movie";

const createAccount = async (req: Request, res: Response) => {
  try {
    const email = req.email;
    if (!email) {
      return res.status(403).json({ message: "Unknown user registration." });
    }

    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Each user only have maximine 6 accounts
    if (currentUser.accounts.length >= 6) {
      return res
        .status(400)
        .json({ message: "The number of accounts cannot exceed 6." });
    }

    const newAccount = new Account(req.body);
    newAccount.userId = currentUser._id;

    await newAccount.save();

    currentUser.accounts.push(newAccount._id);
    await currentUser.save();

    return res.status(201).json(newAccount.toObject());
  } catch (error) {
    console.log(error);
    return res.status(500).json({ massage: "Failed to create an account." });
  }
};

const getAllAccounts = async (req: Request, res: Response) => {
  try {
    const email = req.email;
    if (!email) {
      return res.status(403).json({ message: "Unknown user registration." });
    }

    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    let accounts: { name: string; _id: string }[] = [];

    const accountPromises = currentUser.accounts.map(async (account) => {
      const currentAccount = await Account.findById(account);
      if (currentAccount) {
        return {
          name: currentAccount.accountName,
          _id: currentAccount._id.toString(),
        };
      }
      return null;
    });

    const resolvedAccounts = await Promise.all(accountPromises);
    accounts = resolvedAccounts.filter((account) => account !== null) as {
      name: string;
      _id: string;
    }[];

    return res.status(200).json(accounts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get accounts." });
  }
};

const getAccountById = async (req: Request, res: Response) => {
  const email = req.email;
  if (!email) {
    return res.status(403).json({ message: "Unknown user registration." });
  }

  const currentUser = await User.findOne({ email });
  if (!currentUser) {
    return res.status(404).json({ message: "User not found." });
  }

  const accountId = req.params.accountId;
  if (!accountId) {
    return res.status(404).json({ message: "Account not found." });
  }

  const currentAccount = await Account.findById(accountId);
  if (!currentAccount) {
    return res.status(404).json({ message: "Account not found." });
  }
  return res.status(200).json(currentAccount.toObject());
};

const addFavoriteMovie = async (req: Request, res: Response) => {
  try {
    const email = req.email;
    if (!email) {
      return res.status(403).json({ message: "Unknown user registration." });
    }

    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const accountId = req.params.accountId;
    if (!accountId) {
      return res.status(404).json({ message: "Account not found." });
    }
    const currentAccount = await Account.findById(accountId);
    if (!currentAccount) {
      return res.status(404).json({ message: "Account not found." });
    }

    const movieId = req.body.movieId;
    if (!movieId) {
      return res.status(404).json({ message: "Movie not found." });
    }
    const currentMovie = await Movie.findById(movieId);
    if (!currentMovie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    if (currentAccount.favorites.includes(movieId)) {
      return res.status(200).json({ message: "Movie already favorite." });
    }
    currentAccount.favorites.push(movieId);
    await currentAccount.save();

    return res
      .status(200)
      .json({ message: "Movie has been added to favorites." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error failed to add favotire movie." });
  }
};

const getFavorite = async (req: Request, res: Response) => {
  try {
    const email = req.email;
    if (!email) {
      return res.status(403).json({ message: "Unknown user registration." });
    }

    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const accountId = req.params.accountId;
    if (!accountId) {
      return res.status(404).json({ message: "Account not found." });
    }
    const currentAccount = await Account.findById(accountId);
    if (!currentAccount) {
      return res.status(404).json({ message: "Account not found." });
    }
    let favorites = [];
    for (const favorite of currentAccount.favorites) {
      const movie = await Movie.findById(favorite);
      if (movie) {
        favorites.push(movie);
      }
    }

    return res.status(200).json(favorites);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error failed to get favorites list." });
  }
};

const updateAccount = (req: Request, res: Response) => {};

const deleteAccount = (req: Request, res: Response) => {};

export default {
  createAccount,
  getAllAccounts,
  getAccountById,
  addFavoriteMovie,
  getFavorite,
  updateAccount,
  deleteAccount,
};
