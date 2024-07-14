import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: String,
    default: Date.now().toString(),
  },
  expiresAt: {
    type: String,
  },
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;
