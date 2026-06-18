import { useEffect, useRef, useState } from "react";
import "./SearchBar.css";

/**
 * Debounces input so we don't fire a network request on every keystroke.
 * Calls onSearch(value) ~400ms after the user stops typing.
 */
const SearchBar = ({ initialValue = "", onSearch, placeholder = "Search..." }) => {
  const [value, setValue] = useState(initialValue);
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 400);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="search-bar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search events"
      />
      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={() => setValue("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;