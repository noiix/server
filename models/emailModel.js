const nodemailer = require("nodemailer");
require("dotenv").config();

let transport = nodemailer.createTransport({
  host: "smtp.strato.de",
  port: 465,
  auth: {
    user: process.env.MAILUSER,
    pass: process.env.MAILPASS,
  },
});

const sendMail = (mailTo, subject, message) => {
  return new Promise((resolve, reject) => {
    transport
      .sendMail({
        from: "",
        to: mailTo,
        subject: subject,
        html: message,
      })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports = { sendMail };
