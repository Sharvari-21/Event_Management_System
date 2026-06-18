import "./CategoryFilter.css";

export const CATEGORIES = [
  "All",
  "Conference",
  "Workshop",
  "Meetup",
  "Webinar",
  "Concert",
  "Sports",
  "Other",
];

const CategoryFilter = ({ value, onChange }) => (
  <select
    className="category-filter"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    aria-label="Filter by category"
  >
    {CATEGORIES.map((cat) => (
      <option key={cat} value={cat}>
        {cat === "All" ? "All categories" : cat}
      </option>
    ))}
  </select>
);

export default CategoryFilter;