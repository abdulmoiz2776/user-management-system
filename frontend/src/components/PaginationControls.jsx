import React from "react";

function PaginationControls({ page, totalPages, onPageChange }) {
  const pageNumbers = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let number = start; number <= end; number += 1) {
    pageNumbers.push(number);
  }

  return (
    <div className="pagination-controls">
      <button onClick={() => onPageChange(1)} disabled={page === 1}>
        First
      </button>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        Prev
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)}>1</button>
          <span className="ellipsis">…</span>
        </>
      )}

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={pageNumber === page ? "page-button active" : "page-button"}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      {end < totalPages && (
        <>
          <span className="ellipsis">…</span>
          <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}

      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        Next
      </button>
      <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>
        Last
      </button>
    </div>
  );
}

export default PaginationControls;
