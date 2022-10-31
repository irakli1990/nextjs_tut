import mongoose from "mongoose";
import { UserTypes } from "../_interfaces/user-types";
const Schema = mongoose.Schema;

const user = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    enum: [UserTypes.Admin, UserTypes.User],
  },
});

const UserSchema = mongoose.models.User || mongoose.model("User", user);

export default UserSchema;
