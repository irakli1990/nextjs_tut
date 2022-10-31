import type { NextApiRequest, NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { Transporter } from "nodemailer";
import MailerHelper from "../../../src/_helpers/mailer-helper";
import { ResponseFuncs } from "../../../src/_interfaces/types";
import { allowMethods } from "../../../src/_middleware/allow-method.middleware";
import { captureErrors } from "../../../src/_middleware/error.middleware";
import { verifyUser } from "../../../src/_middleware/verify-user.middleware";
import * as jwt from "jsonwebtoken";
import { User } from "../../../src/_models/user.model";
import { verifyToken } from "../../../src/_middleware/auth/jwt.middleware";
import UserSchema from "../../../src/_schemas/user.schema";
import DatabaseHelper from "../../../src/_helpers/database-helper";
import TokenSchema from "../../../src/_schemas/token.schema";

const { SECRET_KEY } = process.env;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  //function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error });

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS

    // RESPONSE POST REQUESTS
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      console.log(req.body.userId);
      await DatabaseHelper.getInstance().connect;
      let user = new User(
        await UserSchema.findById(req.body.userId).catch(catcher)
      );
      if (user) {
        let token = jwt.sign({ user }, SECRET_KEY!);
        TokenSchema.create({ userId: user._id, token });
        res.status(200).send({ data: { accessToken: token, user } });
      } else {
        res.status(404).json({ message: "User can not be found" });
      }
    },
  };

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

export default use(captureErrors, allowMethods(["POST"]), verifyToken, handler);
