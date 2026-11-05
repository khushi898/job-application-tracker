import Button from "./Button.jsx";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <Button
        variant="secondary"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Previous
      </Button>

      <span>
        Page {page} of {totalPages}
      </span>

      <Button
        variant="secondary"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </Button>
    </nav>
  );
}

export default Pagination;
