import mongoose from "mongoose";

const Schema = mongoose.Schema;

const accessToken = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
});

const TokenSchema =
  mongoose.models.Token || mongoose.model("Token", accessToken);

export default TokenSchema;
