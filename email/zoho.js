const nodemailer = require("nodemailer");
console.log("Zoho transporter initialized", process.env.ZOHO_EMAIL, process.env.ZOHO_PASSWORD);
module.exports = nodemailer.createTransport({
  host: "smtppro.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD
  }
});
