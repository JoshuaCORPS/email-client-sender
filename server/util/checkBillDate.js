const Client = require('../models/clientModel');
const sendEmail = require('./email');

const checkBillingDate = async () => {
  const clients = await Client.find();
  const users = [];

  for (let client of clients) {
    for (let user of client.users) users.push(user);
  }
  const dateNow = new Date(Date.now());
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const subject = `Your Bill for the Month of ${
    monthNames[new Date().getMonth()]
  }`;

  for (let user of users) {
    const userBillDate = new Date(user.billDate);
    const billSentDate = new Date(user.billSentDate);

    if (
      userBillDate.getDate() === dateNow.getDate() &&
      billSentDate.toLocaleDateString() !== dateNow.toLocaleDateString()
    ) {
      user.billSentDate = new Date(Date.now()).toLocaleDateString();
      user.balance += user.monthlyBill;
      await user.save();

      const message = `Dear ${user.name},\n\n\nWe're pleased to send your e-Bill with the following details:\n\nAmount to pay: ${user.balance}`;

      await sendEmail({
        from: `Sender <no-reply@sender.com>`,
        email: user.email,
        subject,
        message,
      });
      console.log(
        `e-bill sent to ${user.email} at ${new Date(
          Date.now()
        ).toLocaleDateString()}`
      );
    }
  }
};

module.exports = checkBillingDate;
