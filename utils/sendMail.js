import nodemailer from "nodemailer"; 
import * as dotenv from "dotenv";

import { CustomError } from "./CustomError.js";

dotenv.config();



class Email {
  constructor(options) {
    // this.from = options.from;
    // this.to = options.to;
    // this.subject = options.subject;
    // this.text = options.text;
    this.options = options;
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

  sendMail() {
    // let mailOptions = {
    //   form: this.from,
    //   to: this.to,
    //   subject: this.subject,
    //   text: this.text,
    // };
    this.createTransport().sendMail(this.options, (error, info) => {
      if (error) {
        console.log(error);
        return CustomError(500, error);
       
      }
    });
  }
}

export default Email;

// var mailOptions = {
//   from: '"Dat Nguyen" <e29bechanh@gmail.com>',
//   to: "datvtrg0510@gmail.com, dungtranvtrg@gmail.com",
//   subject: "test",
//   text: "Hey there, it’s our first message sent with Nodemailer ",
// };

// transport.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     return console.log(error);
//   }
//   //console.log("Message sent: %s", info.messageId);
// });
