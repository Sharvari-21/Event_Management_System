const nodemailer = require("nodemailer");

let transporter = null;

/**
 * Lazily creates a single reusable SMTP transporter.
 * Skipped entirely in EMAIL_DEV_MODE so the app runs without real
 * SMTP credentials during local development/grading.
 */
const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

/**
 * Sends an email. Never throws - email delivery is a "best effort"
 * side-effect and must never break the main request (e.g. a successful
 * event registration should not fail just because SMTP is down).
 *
 * @param {{to: string, subject: string, html: string}} options
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    if (process.env.EMAIL_DEV_MODE === "true") {
      console.log("\n--- EMAIL (dev mode, not actually sent) ---");
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log("--------------------------------------------\n");
      return { success: true, devMode: true };
    }

    const info = await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Email failed to send to ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;