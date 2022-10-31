import * as nodemailer from "nodemailer";

const { MAILER_SERVICE, MAILER_USER, MAILER_PASS } = process.env;

class MailerHelper {
  private static _instance: MailerHelper;

  private constructor() {}

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new MailerHelper();
    return this._instance;
  }

  mailer = async () => {
    const transporter = await nodemailer.createTransport({
      service: MAILER_SERVICE,
      auth: {
        user: MAILER_USER,
        pass: MAILER_PASS,
      },
    });
    return { transporter };
  };
}

export default MailerHelper;
