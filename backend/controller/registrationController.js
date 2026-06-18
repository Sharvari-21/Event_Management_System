const asyncHandler = require("express-async-handler");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const sendEmail = require("../utils/sendEmail");
const {
  registrationConfirmationEmail,
  cancellationEmail,
} = require("../utils/emailTemplates");

/**
 * @desc    Register the current user for an event.
 * @route   POST /api/events/:id/register
 * @access  Private (user or admin)
 *
 * Concurrency note: capacity is enforced atomically via a single
 * findOneAndUpdate using $expr to compare registeredCount < capacity
 * directly in MongoDB, so two simultaneous requests can't both slip
 * through and overbook the last seat. The Registration document's
 * unique (event, user) index guards against double registration even
 * under a race between two requests from the same user.
 */
const registerForEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user._id;

  const alreadyRegistered = await Registration.findOne({
    event: eventId,
    user: userId,
  });

  if (alreadyRegistered) {
    res.status(400);
    throw new Error("You are already registered for this event");
  }

  // Atomically increment registeredCount only if there's still room.
  const event = await Event.findOneAndUpdate(
    { _id: eventId, $expr: { $lt: ["$registeredCount", "$capacity"] } },
    { $inc: { registeredCount: 1 } },
    { new: true }
  );

  if (!event) {
    const exists = await Event.findById(eventId);
    if (!exists) {
      res.status(404);
      throw new Error("Event not found");
    }
    res.status(400);
    throw new Error("This event is full");
  }

  try {
    await Registration.create({ event: eventId, user: userId });
  } catch (error) {
    // Roll back the optimistic increment if registration creation failed
    // (most likely a duplicate-key race from a near-simultaneous request).
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: -1 } });

    if (error.code === 11000) {
      res.status(400);
      throw new Error("You are already registered for this event");
    }
    throw error;
  }

  sendEmail({
    to: req.user.email,
    subject: `Registration confirmed: ${event.title}`,
    html: registrationConfirmationEmail(req.user.name, event),
  }).catch((err) => console.error("Registration email error:", err.message));

  res.status(201).json({
    success: true,
    message: "Successfully registered for the event",
    data: {
      eventId: event._id,
      registeredCount: event.registeredCount,
      capacity: event.capacity,
    },
  });
});

/**
 * @desc    Cancel the current user's registration for an event
 * @route   DELETE /api/events/:id/register
 * @access  Private (user or admin)
 */
const cancelRegistration = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user._id;

  const registration = await Registration.findOneAndDelete({
    event: eventId,
    user: userId,
  });

  if (!registration) {
    res.status(400);
    throw new Error("You are not registered for this event");
  }

  const event = await Event.findOneAndUpdate(
    { _id: eventId, registeredCount: { $gt: 0 } },
    { $inc: { registeredCount: -1 } },
    { new: true }
  );

  if (event) {
    sendEmail({
      to: req.user.email,
      subject: `Registration cancelled: ${event.title}`,
      html: cancellationEmail(req.user.name, event),
    }).catch((err) => console.error("Cancellation email error:", err.message));
  }

  res.status(200).json({
    success: true,
    message: "Registration cancelled successfully",
  });
});

/**
 * @desc    Get all events the current user has registered for
 * @route   GET /api/registrations/my
 * @access  Private
 */
const getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ user: req.user._id })
    .populate({
      path: "event",
      populate: { path: "organizer", select: "name email" },
    })
    .sort({ registeredAt: -1 });

  // An event could theoretically have been deleted; filter those out defensively.
  const data = registrations
    .filter((reg) => reg.event)
    .map((reg) => ({
      registrationId: reg._id,
      registeredAt: reg.registeredAt,
      event: reg.event,
    }));

  res.status(200).json({
    success: true,
    data,
  });
});

module.exports = { registerForEvent, cancelRegistration, getMyRegistrations };