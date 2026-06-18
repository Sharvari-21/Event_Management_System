import "./Pagination.css";

/**
 * Renders numbered page buttons with ellipses for large page counts,
 * plus prev/next controls. Collapses to a simple "Page X of Y" + arrows
 * layout on narrow screens via CSS (see Pagination.css).
 */
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const windowSize = 1; // pages shown around the current page

    pages.push(1);
    if (page - windowSize > 2) pages.push("ellipsis-start");

    for (
      let p = Math.max(2, page - windowSize);
      p <= Math.min(totalPages - 1, page + windowSize);
      p++
    ) {
      pages.push(p);
    }

    if (page + windowSize < totalPages - 1) pages.push("ellipsis-end");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination-arrow"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      <div className="pagination-numbers">
        {getPageNumbers().map((p, idx) =>
          typeof p === "number" ? (
            <button
              key={p}
              className={`pagination-number ${p === page ? "is-active" : ""}`}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          ) : (
            <span key={`${p}-${idx}`} className="pagination-ellipsis">
              &hellip;
            </span>
          )
        )}
      </div>

      <span className="pagination-mobile-label">
        Page {page} of {totalPages}
      </span>

      <button
        className="pagination-arrow"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
};

export default Pagination;