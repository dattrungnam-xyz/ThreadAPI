import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import { htmlToText } from "nodemailer-html-to-text";
import path from "path";
import { fileURLToPath } from "url";
import pug from "pug";


import { createMailTemplate } from "../template/mailTemplate.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Email {
  constructor({ url, email }) {
    this.url = url;
    this.email = email;
  }

  createTransport() {
    return nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async sendMail() {
    let mailTemplate = createMailTemplate(this.url, this.email);
    let mailOptions = {
      form: "datvtrg0510@gmail.com",
      to: this.email,
      subject: "Reset Password",
      html: mailTemplate,
    };
    this.createTransport()
      .use("compile", htmlToText())
      .sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        }
      });
  }
}

export default Email;
