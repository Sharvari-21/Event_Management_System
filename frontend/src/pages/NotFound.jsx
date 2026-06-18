import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => (
  <div className="page not-found-page">
    <div className="container not-found-content">
      <span className="not-found-code">404</span>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">
        Back to events
      </Link>
    </div>
  </div>
);

export default NotFound;