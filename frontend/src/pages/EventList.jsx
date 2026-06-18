import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getEventsApi } from "../api/eventApi";
import { getErrorMessage } from "../api/axiosClient";
import EventCard from "../components/events/EventCard";
import CategoryFilter from "../components/events/CategoryFilter";
import SearchBar from "../components/common/SearchBar";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";
import "./EventsList.css";

const EventsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";

  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getEventsApi({ page, limit: 9, search, category });
      setEvents(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const updateParams = (next) => {
    const params = { page: String(page), search, category, ...next };
    // Drop default/empty values to keep the URL tidy
    Object.keys(params).forEach((key) => {
      if (!params[key] || params[key] === "All") delete params[key];
    });
    setSearchParams(params);
  };

  const handleSearch = (value) => updateParams({ search: value, page: "1" });
  const handleCategoryChange = (value) => updateParams({ category: value, page: "1" });
  const handlePageChange = (nextPage) => {
    updateParams({ page: String(nextPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page">
      <div className="container">
        <div className="events-header">
          <div>
            <h1>Upcoming Events</h1>
            <p className="events-subtitle">
              Browse what's happening and register in a couple of clicks.
            </p>
          </div>
        </div>

        <div className="events-filters">
          <SearchBar
            initialValue={search}
            onSearch={handleSearch}
            placeholder="Search by title, location, or keyword..."
          />
          <CategoryFilter value={category} onChange={handleCategoryChange} />
        </div>

        {loading && <Loader label="Loading events..." />}

        {!loading && error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && events.length === 0 && (
          <div className="events-empty">
            <h3>No events found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <>
            <div className="events-grid">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EventsList;