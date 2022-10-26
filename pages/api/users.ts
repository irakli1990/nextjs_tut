import { allowMethods } from "./../../src/_middleware/allow-method.middleware";
import type { NextApiRequest, NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import DatabaseHelper from "../../src/_helpers/connection";
import { ResponseFuncs } from "../../src/_interfaces/types";
import { auth } from "../../src/_middleware/auth.middleware";
import UserModel from "../../src/_models/user";
import { captureErrors } from "../../src/_middleware/error.middleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error });

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      req.headers.authorization = "Admin";
      console.log(req.headers.authorization);
      await DatabaseHelper.getInstance().connect; // connect to database
      res.json(await UserModel.find({}).catch(catcher));
    },
    // RESPONSE POST REQUESTS
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      await DatabaseHelper.getInstance().connect; // connect to database
      res.json(await UserModel.create(req.body).catch(catcher));
    },
  };

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default use(
  captureErrors,
  allowMethods(["GET", "POST"]),
  // auth(["Admin"]),
  handler
);
