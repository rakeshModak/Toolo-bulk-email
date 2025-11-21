const nodemailer = require("nodemailer");
console.log("Zoho transporter initialized", process.env.ZOHO_EMAIL, process.env.ZOHO_PASSWORD);
module.exports = nodemailer.createTransport({
  //host: "smtppro.zoho.in",
  host: "smtp.zeptomail.in",
  //port: 465,
  port: 587,
  // secure: true,
  auth: {
    //user: process.env.ZOHO_EMAIL,
    user: 'emailapikey',
    pass: process.env.ZOHO_PASSWORD
  }
});
