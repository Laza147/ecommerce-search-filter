import React from 'react';

interface BreadcrumbsProps {
  breadcrumb: string[];
  onSelect: (path: string[]) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumb, onSelect }) => {
  const path = breadcrumb ?? [];

  const handleClick = (index: number) => {
    const newPath = path.slice(0, index + 1);
    onSelect(newPath);
  };

  return (
    <nav style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
      <span
        style={{ cursor: 'pointer', color: '#007185' }}
        onClick={() => onSelect([])}
      >
        Home
      </span>
      {path.map((crumb, idx) => (
        <span key={idx}>
          {' '}
          &gt;{' '}
          <span
            style={{ cursor: 'pointer', color: '#007185' }}
            onClick={() => handleClick(idx)}
          >
            {crumb}
          </span>
        </span>
      ))}
    </nav>
  );
};
