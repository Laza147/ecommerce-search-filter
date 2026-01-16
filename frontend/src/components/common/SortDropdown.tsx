import React from 'react';
import type { SortOption } from '../../types';

interface SortDropdownProps {
  sortOptions: SortOption[];
  selectedKey: string | null;
  onChange: (key: string | null) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  sortOptions,
  selectedKey,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || null;
    onChange(value);
  };

  return (
    <div style={{ fontSize: '0.85rem' }}>
      <label>
        Sort by:{' '}
        <select value={selectedKey ?? ''} onChange={handleChange}>
          <option value="">Featured</option>
          {sortOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
