const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const wrapper = (title, bodyHtml) => `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #14201C;">
    <h2 style="color: #0E6B4F; margin-bottom: 4px;">${title}</h2>
    <hr style="border: none; border-top: 1px solid #E6E2D8; margin: 16px 0;" />
    ${bodyHtml}
    <p style="margin-top: 32px; font-size: 12px; color: #8a8a8a;">
      Event Management System &mdash; this is an automated message, please do not reply.
    </p>
  </div>
`;

const welcomeEmail = (name) =>
  wrapper(
    `Welcome, ${name}!`,
    `<p>Your account has been created successfully. You can now browse events and register to attend.</p>`
  );

const registrationConfirmationEmail = (userName, event) =>
  wrapper(
    "You're registered! 🎉",
    `<p>Hi ${userName},</p>
     <p>You have successfully registered for <strong>${event.title}</strong>.</p>
     <table style="width: 100%; margin: 16px 0; border-collapse: collapse;">
       <tr><td style="padding: 4px 0; color: #4B5A54;">Date</td><td style="padding: 4px 0;"><strong>${formatDate(event.date)}</strong></td></tr>
       <tr><td style="padding: 4px 0; color: #4B5A54;">Time</td><td style="padding: 4px 0;"><strong>${event.time}</strong></td></tr>
       <tr><td style="padding: 4px 0; color: #4B5A54;">Location</td><td style="padding: 4px 0;"><strong>${event.location}</strong></td></tr>
     </table>
     <p>We look forward to seeing you there!</p>`
  );

const cancellationEmail = (userName, event) =>
  wrapper(
    "Registration cancelled",
    `<p>Hi ${userName},</p>
     <p>Your registration for <strong>${event.title}</strong> on ${formatDate(event.date)} has been cancelled.</p>
     <p>If this wasn't you, please log in and contact support.</p>`
  );

const eventUpdatedEmail = (userName, event) =>
  wrapper(
    "Event details updated",
    `<p>Hi ${userName},</p>
     <p>An event you registered for, <strong>${event.title}</strong>, has been updated by the organizer. Please review the latest details:</p>
     <table style="width: 100%; margin: 16px 0; border-collapse: collapse;">
       <tr><td style="padding: 4px 0; color: #4B5A54;">Date</td><td style="padding: 4px 0;"><strong>${formatDate(event.date)}</strong></td></tr>
       <tr><td style="padding: 4px 0; color: #4B5A54;">Time</td><td style="padding: 4px 0;"><strong>${event.time}</strong></td></tr>
       <tr><td style="padding: 4px 0; color: #4B5A54;">Location</td><td style="padding: 4px 0;"><strong>${event.location}</strong></td></tr>
     </table>`
  );

const eventCancelledEmail = (userName, event) =>
  wrapper(
    "Event cancelled",
    `<p>Hi ${userName},</p>
     <p>We're sorry to let you know that <strong>${event.title}</strong> (scheduled for ${formatDate(event.date)}) has been cancelled by the organizer.</p>`
  );

module.exports = {
  welcomeEmail,
  registrationConfirmationEmail,
  cancellationEmail,
  eventUpdatedEmail,
  eventCancelledEmail,
};