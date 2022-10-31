import { Middleware } from "next-api-route-middleware";

export const Role = (allowUsers: string[]): Middleware => {
  return async function (req, res, next) {
    if (allowUsers.includes(req.body.role)) {
      next();
    } else {
      res.status(405).send({ message: "Method not allowed." });
    }
  };
};
