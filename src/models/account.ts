import mongoose from "mongoose";

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  accountName: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    default: "Default",
  },
  createdAt: {
    type: String,
    default: Date.now().toString(),
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
});

const Account = mongoose.model("Account", accountSchema);

export default Account;
