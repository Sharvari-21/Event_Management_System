const mongoose = require("mongoose");

const EVENT_CATEGORIES = [
  "Conference",
  "Workshop",
  "Meetup",
  "Webinar",
  "Concert",
  "Sports",
  "Other",
];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    category: {
      type: String,
      enum: {
        values: EVENT_CATEGORIES,
        message: "Invalid category",
      },
      default: "Other",
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    time: {
      type: String, // stored as "HH:mm" for simple display alongside date
      required: [true, "Event time is required"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Speeds up listing (sort by date) and search/filter queries
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ title: "text", location: "text", description: "text" });

// Virtual: convenient boolean for the frontend
eventSchema.virtual("isFull").get(function () {
  return this.registeredCount >= this.capacity;
});

eventSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);
module.exports.EVENT_CATEGORIES = EVENT_CATEGORIES;