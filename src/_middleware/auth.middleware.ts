import { Middleware } from "next-api-route-middleware";

export const auth = (allowUsers: string[]): Middleware => {
  return async function (req, res, next) {
    console.log(req.body);
    if (allowUsers.includes(req.body.role)) {
      next();
    } else {
      res.status(405).send({ message: "Method not allowed." });
    }
  };
};
