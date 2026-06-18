import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_jkw3k3e";
const TEMPLATE_ID = "template_h6q6h5a";
const PUBLIC_KEY = "0dqD_WCMcjTRDWigA";

export const sendRegistrationEmail = async (
  userName,
  userEmail,
  eventName,
  eventDate,
  eventLocation
) => {
  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        user_name: userName,
        user_email: userEmail,
        event_name: eventName,
        event_date: eventDate,
        event_location: eventLocation,
      },
      PUBLIC_KEY
    );

    console.log("✅ Email sent:", response);
    return true;
  } catch (error) {
    console.error("❌ Email failed:", error);
    return false;
  }
};