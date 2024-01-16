import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import { htmlToText } from "nodemailer-html-to-text";
import path from "path";
import { fileURLToPath } from "url";
import pug from "pug";
// import { CustomError } from "./CustomError.js";

import { mailTemplate } from "../template/mailTemplate.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Email {
  constructor() {
    // this.from = options.from;
    // this.to = options.to;
    // this.subject = options.subject;
    // this.text = options.text;
    // this.options = options;
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
   
    let mailOptions = {
      form: "dattrungnam",
      to: "datvtrg0510@gmail.com",
      subject: "this.subject",
      // text: convert(html),
      html: mailTemplate,
    };
    this.createTransport().use('compile', htmlToText()).sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);

      }
    });
  }
}

export default Email;

