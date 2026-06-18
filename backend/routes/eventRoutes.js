const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventAttendees,
} = require("../controllers/eventController");

const {
  registerForEvent,
  cancelRegistration,
} = require("../controllers/registrationController");

const { protect, optionalAuth, authorize } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateMiddleware");
const {
  eventValidator,
  eventUpdateValidator,
} = require("../validators/eventValidator.js");

// Public listing/search (optionalAuth attaches req.user if a valid token is sent)
router.get("/", optionalAuth, getEvents);
router.get("/:id", optionalAuth, getEventById);

// Admin-only event management (RBAC)
router.post("/", protect, authorize("admin"), eventValidator, validateRequest, createEvent);
router.put("/:id", protect, authorize("admin"), eventUpdateValidator, validateRequest, updateEvent);
router.delete("/:id", protect, authorize("admin"), deleteEvent);

// Attendee list - any authenticated user can view, admins see emails too
router.get("/:id/attendees", protect, getEventAttendees);

// Registration - any authenticated user (admin or user) can register/cancel
router.post("/:id/register", protect, registerForEvent);
router.delete("/:id/register", protect, cancelRegistration);

module.exports = router;