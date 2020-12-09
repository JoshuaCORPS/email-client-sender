const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  let transport;

  if (process.env.NODE_ENV === 'development')
    transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  else
    transport = nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SEND_GRID_USERNAME,
        pass: process.env.SEND_GRID_PASSWORD,
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
