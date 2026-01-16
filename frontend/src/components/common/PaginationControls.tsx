import React from 'react';

interface PaginationControlsProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  limit,
  total,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const prevDisabled = page <= 0;
  const nextDisabled = page >= totalPages - 1;

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
      <button
        disabled={prevDisabled}
        onClick={() => !prevDisabled && onPageChange(page - 1)}
      >
        Previous
      </button>
      <span style={{ fontSize: '0.9rem' }}>
        Page {page + 1} of {totalPages}
      </span>
      <button
        disabled={nextDisabled}
        onClick={() => !nextDisabled && onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};
