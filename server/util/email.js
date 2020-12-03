const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const emailOptions = {
    from: options.from,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(emailOptions);
};

module.exports = sendEmail;
