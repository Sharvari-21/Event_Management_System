const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS?.replace(/\s/g, ""),
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP Verification Failed:", error.message);
    } else {
      console.log("✅ Gmail SMTP Ready");
    }
  });

  return transporter;
};

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
      from: `"Event Management System" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(`❌ Email failed to send to ${to}:`, error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = sendEmail;