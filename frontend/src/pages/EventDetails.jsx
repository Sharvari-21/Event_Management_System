import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getEventByIdApi, deleteEventApi, getEventAttendeesApi } from "../api/eventApi";
import { registerForEventApi, cancelRegistrationApi } from "../api/registrationApi";
import { getErrorMessage } from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatDate, formatTime, isPastEvent } from "../utils/formatDate";
import AttendeeList from "../components/events/AttendeeList";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Loader from "../components/common/Loader";
import "./EventDetails.css";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [attendeeData, setAttendeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchAttendees = useCallback(async () => {
    try {
      const res = await getEventAttendeesApi(id);
      setAttendeeData(res.data);
    } catch {
      // Non-critical - the page still works without the attendee list.
    }
  }, [id]);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getEventByIdApi(id);
      setEvent(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  useEffect(() => {
    if (isAuthenticated) fetchAttendees();
  }, [isAuthenticated, fetchAttendees]);

  const handleRegister = async () => {
    setActionLoading(true);
    try {
      await registerForEventApi(id);
      showToast("You're registered for this event!");
      await Promise.all([fetchEvent(), fetchAttendees()]);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await cancelRegistrationApi(id);
      showToast("Registration cancelled");
      await Promise.all([fetchEvent(), fetchAttendees()]);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteEventApi(id);
      showToast("Event deleted");
      navigate("/");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
      setActionLoading(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) return <Loader label="Loading event..." />;

  if (error || !event) {
    return (
      <div className="page">
        <div className="container event-not-found">
          <h2>Event not found</h2>
          <p>{error || "This event may have been removed."}</p>
          <Link to="/" className="btn btn-primary">
            Back to events
          </Link>
        </div>
      </div>
    );
  }

  const isFull = event.registeredCount >= event.capacity;
  const eventHasPassed = isPastEvent(event.date);
  const pct = Math.min((event.registeredCount / event.capacity) * 100, 100);
  const meterState = pct >= 100 ? "is-full" : pct >= 80 ? "is-almost-full" : "";

  return (
    <div className="page">
      <div className="container event-details-layout">
        <div className="event-details-main">
          <Link to="/" className="event-back-link">
            ← Back to events
          </Link>

          <div className="event-details-card">
            <div className="event-details-top">
              <span className="badge">{event.category}</span>
              {eventHasPassed && <span className="badge badge-warning">Past event</span>}
              {isFull && !eventHasPassed && <span className="badge badge-danger">Full</span>}
            </div>

            <h1>{event.title}</h1>

            <div className="event-details-meta">
              <span>📅 {formatDate(event.date)}</span>
              <span>🕒 {formatTime(event.time)}</span>
              <span>📍 {event.location}</span>
            </div>

            <p className="event-details-organizer">
              Organized by <strong>{event.organizer?.name || "Gatherly"}</strong>
            </p>

            <div className="event-details-divider" />

            <h3>About this event</h3>
            <p className="event-details-description">{event.description}</p>

            <div className="event-details-divider" />

            <div className="capacity-meter event-details-capacity">
              <div className="capacity-track">
                <div className={`capacity-fill ${meterState}`} style={{ width: `${pct}%` }} />
              </div>
              <span className="capacity-label">
                {event.registeredCount}/{event.capacity} seats filled
              </span>
            </div>

            <div className="event-details-actions">
              {isAdmin && (
                <>
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate(`/events/${id}/edit`)}
                  >
                    Edit Event
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete Event
                  </button>
                </>
              )}

              {!isAuthenticated && !eventHasPassed && (
                <Link to="/login" state={{ from: { pathname: `/events/${id}` } }} className="btn btn-accent">
                  Log in to register
                </Link>
              )}

              {isAuthenticated && !eventHasPassed && (
                event.isRegistered ? (
                  <button className="btn btn-outline" onClick={handleCancel} disabled={actionLoading}>
                    {actionLoading ? "Cancelling..." : "Cancel Registration"}
                  </button>
                ) : (
                  <button
                    className="btn btn-accent"
                    onClick={handleRegister}
                    disabled={actionLoading || isFull}
                  >
                    {actionLoading ? "Registering..." : isFull ? "Event Full" : "Register Now"}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <aside className="event-details-sidebar">
          <div className="event-details-card">
            {isAuthenticated ? (
              attendeeData ? (
                <AttendeeList
                  attendees={attendeeData.attendees}
                  totalAttendees={attendeeData.totalAttendees}
                  capacity={attendeeData.capacity}
                  isAdmin={isAdmin}
                />
              ) : (
                <Loader label="Loading attendees..." />
              )
            ) : (
              <div className="attendee-empty">
                <p>
                  <Link to="/login">Log in</Link> to see who's attending.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {showDeleteDialog && (
        <ConfirmDialog
          title="Delete this event?"
          message={`This will permanently delete "${event.title}" and notify all ${event.registeredCount} registered attendee(s). This cannot be undone.`}
          confirmLabel={actionLoading ? "Deleting..." : "Delete Event"}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
};

export default EventDetails;