const nodemailer = require("nodemailer");
require("dotenv").config();

let transport = nodemailer.createTransport({
  host: "smtp.strato.de",
  port: 465,
  auth: {
    user: "sigurdurgur@gmail.com",
    pass: "12345678",
  },
});

const sendMail = (mailTo, subject, message) => {
  return new Promise((resolve, reject) => {
    transport
      .sendMail({
        from: "sigurdurgur@gmail.com",
        to: mailTo,
        subject: subject,
        html: message,
      })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

module.exports = { sendMail };
