const transporter = require("./zoho.js");

async function sendEmail({ email, subject, html, attachments }) {
  const mailOptions = {
    from: `Töölö`,
    to: email,
    subject,
    html
  };

  if (attachments && attachments.length > 0) {
    mailOptions.attachments = attachments;
  }

  return transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
