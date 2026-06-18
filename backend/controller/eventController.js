const asyncHandler = require("express-async-handler");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const sendEmail = require("../utils/sendEmail");
const {
  eventUpdatedEmail,
  eventCancelledEmail,
} = require("../utils/emailTemplates");

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private/Admin
 */
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, category, date, time, location, capacity } =
    req.body;

  const event = await Event.create({
    title,
    description,
    category,
    date,
    time,
    location,
    capacity,
    organizer: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    data: event,
  });
});

/**
 * @desc    Get all events with pagination, search and category filter.
 *          If the request is authenticated, each event is annotated with
 *          `isRegistered` so the frontend can show "Registered"/"Register".
 * @route   GET /api/events?page=1&limit=9&search=&category=&sortBy=date
 * @access  Public
 */
const getEvents = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 9, 1), 50);
  const { search, category } = req.query;

  const filter = {};

  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [{ title: regex }, { location: regex }, { description: regex }];
  }

  if (category && category !== "All") {
    filter.category = category;
  }

  const sortOptions = { date: 1 }; // soonest events first

  const [events, totalEvents] = await Promise.all([
    Event.find(filter)
      .populate("organizer", "name email")
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit),
    Event.countDocuments(filter),
  ]);

  let eventsWithFlags = events;

  if (req.user) {
    const registrations = await Registration.find({
      user: req.user._id,
      event: { $in: events.map((e) => e._id) },
    }).select("event");

    const registeredEventIds = new Set(
      registrations.map((r) => r.event.toString())
    );

    eventsWithFlags = events.map((event) => ({
      ...event.toJSON(),
      isRegistered: registeredEventIds.has(event._id.toString()),
    }));
  }

  const totalPages = Math.max(Math.ceil(totalEvents / limit), 1);

  res.status(200).json({
    success: true,
    data: eventsWithFlags,
    pagination: {
      page,
      limit,
      totalEvents,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

/**
 * @desc    Get a single event by id
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate(
    "organizer",
    "name email"
  );

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  let isRegistered = false;
  if (req.user) {
    const existing = await Registration.findOne({
      event: event._id,
      user: req.user._id,
    });
    isRegistered = !!existing;
  }

  res.status(200).json({
    success: true,
    data: { ...event.toJSON(), isRegistered },
  });
});

/**
 * @desc    Update an event. If the date, time or location changes,
 *          all registered attendees are notified by email.
 * @route   PUT /api/events/:id
 * @access  Private/Admin
 */
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  const allowedFields = [
    "title",
    "description",
    "category",
    "date",
    "time",
    "location",
    "capacity",
  ];

  // Prevent shrinking capacity below the number of people already registered
  if (
    req.body.capacity !== undefined &&
    Number(req.body.capacity) < event.registeredCount
  ) {
    res.status(400);
    throw new Error(
      `Capacity cannot be lower than the ${event.registeredCount} attendee(s) already registered`
    );
  }

  const detailsChanged =
    (req.body.date && new Date(req.body.date).getTime() !== event.date.getTime()) ||
    (req.body.time && req.body.time !== event.time) ||
    (req.body.location && req.body.location !== event.location);

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      event[field] = req.body[field];
    }
  });

  const updatedEvent = await event.save();

  if (detailsChanged) {
    const registrations = await Registration.find({ event: event._id }).populate(
      "user",
      "name email"
    );

    // Best-effort notification - failures are logged, not thrown.
    Promise.allSettled(
      registrations.map((reg) =>
        sendEmail({
          to: reg.user.email,
          subject: `Update: ${updatedEvent.title}`,
          html: eventUpdatedEmail(reg.user.name, updatedEvent),
        })
      )
    ).catch((err) => console.error("Event update email batch error:", err.message));
  }

  res.status(200).json({
    success: true,
    message: "Event updated successfully",
    data: updatedEvent,
  });
});

/**
 * @desc    Delete an event and cascade-delete its registrations.
 *          Registered attendees are notified by email beforehand.
 * @route   DELETE /api/events/:id
 * @access  Private/Admin
 */
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  const registrations = await Registration.find({ event: event._id }).populate(
    "user",
    "name email"
  );

  if (registrations.length > 0) {
    Promise.allSettled(
      registrations.map((reg) =>
        sendEmail({
          to: reg.user.email,
          subject: `Cancelled: ${event.title}`,
          html: eventCancelledEmail(reg.user.name, event),
        })
      )
    ).catch((err) => console.error("Event cancellation email batch error:", err.message));
  }

  await Registration.deleteMany({ event: event._id });
  await event.deleteOne();

  res.status(200).json({
    success: true,
    message: "Event deleted successfully",
  });
});

/**
 * @desc    Get the list of attendees registered for an event.
 *          Admins see each attendee's email; regular users only see names,
 *          to avoid exposing other users' contact details unnecessarily.
 * @route   GET /api/events/:id/attendees
 * @access  Private
 */
const getEventAttendees = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  const registrations = await Registration.find({ event: event._id })
    .populate("user", "name email")
    .sort({ registeredAt: 1 });

  const isAdmin = req.user.role === "admin";

  const attendees = registrations.map((reg) => ({
    id: reg._id,
    name: reg.user.name,
    email: isAdmin ? reg.user.email : undefined,
    registeredAt: reg.registeredAt,
  }));

  res.status(200).json({
    success: true,
    data: {
      eventId: event._id,
      totalAttendees: attendees.length,
      capacity: event.capacity,
      attendees,
    },
  });
});

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventAttendees,
};