import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyRegistrationsApi, cancelRegistrationApi } from "../api/registrationApi";
import { getErrorMessage } from "../api/axiosClient";
import { useToast } from "../context/ToastContext";
import { formatDate, formatTime, isPastEvent } from "../utils/formatDate";
import Loader from "../components/common/Loader";
import ConfirmDialog from "../components/common/ConfirmDialog";
import "./MyRegistrations.css";

const MyRegistrations = () => {
  const { showToast } = useToast();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getMyRegistrationsApi();
      setRegistrations(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await cancelRegistrationApi(cancelTarget.event._id);
      showToast("Registration cancelled");
      setRegistrations((prev) =>
        prev.filter((r) => r.registrationId !== cancelTarget.registrationId)
      );
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setCancelling(false);
      setCancelTarget(null);
    }
  };

  if (loading) return <Loader label="Loading your registrations..." />;

  return (
    <div className="page">
      <div className="container">
        <h1>My Registrations</h1>
        <p className="events-subtitle">Events you're signed up to attend.</p>

        {error && <div className="alert alert-error">{error}</div>}

        {!error && registrations.length === 0 && (
          <div className="events-empty">
            <h3>You haven't registered for any events yet</h3>
            <p>
              <Link to="/">Browse upcoming events</Link> to find something you'll enjoy.
            </p>
          </div>
        )}

        <div className="my-reg-list">
          {registrations.map((reg) => {
            const past = isPastEvent(reg.event.date);
            return (
              <div key={reg.registrationId} className="my-reg-row">
                <div className="my-reg-info">
                  <div className="my-reg-title-row">
                    <Link to={`/events/${reg.event._id}`} className="my-reg-title">
                      {reg.event.title}
                    </Link>
                    {past && <span className="badge badge-warning">Past</span>}
                  </div>
                  <div className="my-reg-meta">
                    <span>📅 {formatDate(reg.event.date)}</span>
                    <span>🕒 {formatTime(reg.event.time)}</span>
                    <span>📍 {reg.event.location}</span>
                  </div>
                </div>
                <div className="my-reg-actions">
                  <Link to={`/events/${reg.event._id}`} className="btn btn-outline btn-sm">
                    View
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setCancelTarget(reg)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {cancelTarget && (
        <ConfirmDialog
          title="Cancel registration?"
          message={`You'll lose your spot for "${cancelTarget.event.title}".`}
          confirmLabel={cancelling ? "Cancelling..." : "Cancel Registration"}
          onConfirm={handleCancel}
          onCancel={() => setCancelTarget(null)}
        />
      )}
    </div>
  );
};

export default MyRegistrations;