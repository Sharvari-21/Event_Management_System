import "./AttendeeList.css";

const AttendeeList = ({ attendees, totalAttendees, capacity, isAdmin }) => {
  if (totalAttendees === 0) {
    return (
      <div className="attendee-empty">
        <p>No one has registered yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="attendee-list">
      <div className="attendee-list-header">
        <h4>Attendees</h4>
        <span className="badge">
          {totalAttendees}/{capacity}
        </span>
      </div>

      <ul>
        {attendees.map((attendee) => (
          <li key={attendee.id} className="attendee-row">
            <span className="attendee-avatar">{attendee.name.charAt(0).toUpperCase()}</span>
            <div className="attendee-info">
              <span className="attendee-name">{attendee.name}</span>
              {isAdmin && attendee.email && (
                <span className="attendee-email">{attendee.email}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendeeList;