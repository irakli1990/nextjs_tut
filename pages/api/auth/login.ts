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
      let user = new User(req.body.user);
      let token = await jwt.sign({ userId: user._id }, SECRET_KEY!, {
        expiresIn: "1h",
      });
      res.status(200).send({ accessToken: token });
      let mailer = await await MailerHelper.getInstance().mailer();
      let transporter = mailer.transporter;
      let message = await sendMail(req, transporter, token, catcher);
      if (message) res.status(200).send({ message });
    },
  };

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: "No Response for This Request" });
};

const sendMail = async (
  req: NextApiRequest,
  transporter: Transporter,
  token: string,
  catcher: any
) => {
  let message;
  await transporter
    .sendMail({
      from: process.env.MAILER_USER,
      to: req.body.email,
      subject: process.env.MAILER_LOGIN_SUBJECT,
      html: `<p>To login follow <a href="${req.body.clientUrl}/${token}">this link</a></p>`,
    })
    .then(() => (message = "Email sent"))
    .catch(catcher);
  return message;
};

export default use(captureErrors, allowMethods(["POST"]), verifyUser, handler);
