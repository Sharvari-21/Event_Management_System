import "./Loader.css";

const Loader = ({ label = "Loading..." }) => (
  <div className="loader-wrap">
    <div className="loader-spinner" />
    <p>{label}</p>
  </div>
);

export default Loader;