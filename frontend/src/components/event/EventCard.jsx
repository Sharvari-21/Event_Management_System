import { Link } from "react-router-dom";
import { formatDateShort, formatTime } from "../../utils/formatDate";
import "./EventCard.css";

const CapacityMeter = ({ registeredCount, capacity }) => {
  const pct = Math.min((registeredCount / capacity) * 100, 100);
  const state = pct >= 100 ? "is-full" : pct >= 80 ? "is-almost-full" : "";

  return (
    <div className="capacity-meter">
      <div className="capacity-track">
        <div className={`capacity-fill ${state}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="capacity-label">
        {registeredCount}/{capacity} seats
      </span>
    </div>
  );
};

const EventCard = ({ event }) => {
  const isFull = event.registeredCount >= event.capacity;

  return (
    <Link to={`/events/${event._id}`} className="event-card">
      <div className="event-card-top">
        <span className="badge">{event.category}</span>
        <span className="badge badge-accent event-card-date">
          {formatDateShort(event.date)}
        </span>
      </div>

      <h3 className="event-card-title">{event.title}</h3>
      <p className="event-card-desc">{event.description}</p>

      <div className="event-card-meta">
        <span>📍 {event.location}</span>
        <span>🕒 {formatTime(event.time)}</span>
      </div>

      <CapacityMeter registeredCount={event.registeredCount} capacity={event.capacity} />

      <div className="event-card-footer">
        {event.isRegistered ? (
          <span className="badge">You're registered</span>
        ) : isFull ? (
          <span className="badge badge-danger">Full</span>
        ) : (
          <span className="event-card-cta">View details →</span>
        )}
      </div>
    </Link>
  );
};

export default EventCard;