import mongoose from "mongoose";

const { MONGODB_URL } = process.env;

class DatabaseHelper {
  private static _instance: DatabaseHelper;

  private constructor() {
    mongoose
      .connect(MONGODB_URL as string)
      .then(() => console.log("Mongoose Connection Established"))
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
