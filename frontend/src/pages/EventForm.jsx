import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createEventApi, getEventByIdApi, updateEventApi } from "../api/eventApi";
import { getErrorMessage, getFieldErrors } from "../api/axiosClient";
import { useToast } from "../context/ToastContext";
import { CATEGORIES } from "../components/events/CategoryFilter";
import Loader from "../components/common/Loader";
import "./EventForm.css";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "Conference",
  date: "",
  time: "",
  location: "",
  capacity: 50,
};

// Converts an ISO date string to the "YYYY-MM-DD" format <input type="date"> expects
const toDateInputValue = (isoString) => {
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const EventForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const loadEvent = async () => {
      try {
        const res = await getEventByIdApi(id);
        const event = res.data;
        setForm({
          title: event.title,
          description: event.description,
          category: event.category,
          date: toDateInputValue(event.date),
          time: event.time,
          location: event.location,
          capacity: event.capacity,
        });
      } catch (err) {
        setFormError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});
    setSubmitting(true);

    const payload = { ...form, capacity: Number(form.capacity) };

    try {
      if (isEditMode) {
        await updateEventApi(id, payload);
        showToast("Event updated successfully");
      } else {
        const res = await createEventApi(payload);
        showToast("Event created successfully");
        navigate(`/events/${res.data._id}`);
        return;
      }
      navigate(`/events/${id}`);
    } catch (err) {
      setFormError(getErrorMessage(err));
      setFieldErrors(getFieldErrors(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading event..." />;

  return (
    <div className="page">
      <div className="container event-form-container">
        <div className="event-form-card">
          <h2>{isEditMode ? "Edit Event" : "Create a New Event"}</h2>
          <p className="event-form-subtitle">
            {isEditMode
              ? "Update the details below. Attendees will be notified if the date, time, or location changes."
              : "Fill in the details below to publish a new event."}
          </p>

          {formError && <div className="alert alert-error">{formError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="title">Event title</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. React Summit 2026"
                required
                maxLength={120}
              />
              {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}
            </div>

            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What should attendees know about this event?"
                required
                maxLength={3000}
              />
              {fieldErrors.description && (
                <p className="field-error">{fieldErrors.description}</p>
              )}
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="capacity">Capacity</label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.capacity && <p className="field-error">{fieldErrors.capacity}</p>}
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.date && <p className="field-error">{fieldErrors.date}</p>}
              </div>

              <div className="field">
                <label htmlFor="time">Time</label>
                <input
                  id="time"
                  name="time"
                  type="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.time && <p className="field-error">{fieldErrors.time}</p>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Mumbai Convention Centre, Hall B"
                required
                maxLength={200}
              />
              {fieldErrors.location && <p className="field-error">{fieldErrors.location}</p>}
            </div>

            <div className="event-form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting
                  ? isEditMode ? "Saving..." : "Creating..."
                  : isEditMode ? "Save Changes" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;