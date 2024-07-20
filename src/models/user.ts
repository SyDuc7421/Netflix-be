import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: Date.now().toString(),
  },
  enable: {
    type: Boolean,
    default: true,
  },
  accounts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
