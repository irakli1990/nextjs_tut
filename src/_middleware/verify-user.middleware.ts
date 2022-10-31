import { Middleware } from "next-api-route-middleware";
import DatabaseHelper from "../_helpers/database-helper";
import UserSchema from "../_schemas/user.schema";

export const verifyUser: Middleware = async (req, res, next) => {
  await DatabaseHelper.getInstance().connect;
  let user = await UserSchema.findOne({ email: req.body.email });
  if (user) {
    req.body.user = user;
    next();
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
};
