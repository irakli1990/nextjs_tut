import mongoose from "mongoose";
import UserSchema from "../_schemas/user.schema";

const {
  MONGODB_URL,
  INITIAL_USER_EMAIL,
  INITIAL_USER_NAME,
  INITIAL_USER_ROLE,
} = process.env;

class DatabaseHelper {
  private static _instance: DatabaseHelper;

  private constructor() {
    mongoose
      .connect(MONGODB_URL as string)
      .then(async () => {
        let initialUser = await UserSchema.findOne({
          email: INITIAL_USER_EMAIL,
        });
        if (!initialUser) {
          UserSchema.insertMany([
            {
              email: INITIAL_USER_EMAIL,
              name: INITIAL_USER_NAME,
              role: INITIAL_USER_ROLE,
            },
          ])
            .then(() => console.log("Initial user created"))
            .catch((error: Error) => console.log(error.message));
        }
      })
      .catch((err) => console.log(err));
  }

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new DatabaseHelper();
    return this._instance;
  }

  connect = async () => {
    const conn = await mongoose
      .connect(MONGODB_URL as string)
      .catch((err) => console.log(err));
    console.log("Mongoose Connection Established");
    return { conn };
  };
}

export default DatabaseHelper;
