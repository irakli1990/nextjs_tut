import { Middleware } from "next-api-route-middleware";
import * as jwt from "jsonwebtoken";

const { SECRET_KEY } = process.env;

export const verifyToken: Middleware = async (req, res, next) => {
  const token = req.body.token || req.headers["x-access-token"];
  if (!token) {
    res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY!) as jwt.JwtPayload;
    let userId = decoded["userId"];
    req.body = { userId };
    next();
  } catch (err) {
    res.status(401).send("Invalid Token");
  }
};
