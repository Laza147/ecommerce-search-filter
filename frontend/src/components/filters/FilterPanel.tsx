import React, { useState } from 'react';
import type { PriceRange, SearchFilter } from '../../types';
import { CategorySidebar } from './CategorySidebar';
import { PriceSlider } from './PriceSlider';

interface FilterPanelProps {
  filters: SearchFilter[];
  appliedFilters: Record<string, string[]>;
  price: PriceRange | null;
  onFilterChange: (key: string, value: string, checked: boolean) => void;
  onClearFilters: () => void;
  onPriceChange: (range: PriceRange | null) => void;
  contextCategoryPath: string[];
  setCategoryPath: (path: string[]) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  appliedFilters,
  price,
  onFilterChange,
  onClearFilters,
  onPriceChange,
  contextCategoryPath,
  setCategoryPath,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const categoryFilter = filters.find((f) => f.type === 'hierarchical');
  const priceFilter = filters.find(
    (f) => f.type === 'slider' && f.key === 'price'
  );
  const checkboxFilters = filters.filter((f) => f.type === 'checkbox');

  return (
    <div className="filter-panel">
      {Object.keys(appliedFilters).length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
            Applied filters
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {Object.entries(appliedFilters).map(([key, values]) =>
              values.map((val) => (
                <span
                  key={`${key}-${val}`}
                  onClick={() => onFilterChange(key, val, false)}
                  style={{
                    padding: '0.15rem 0.55rem',
                    borderRadius: '999px',
                    background: '#1e293b',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {val} ✕
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {categoryFilter && (
        <div className="filter-section">
          <CategorySidebar
            filter={categoryFilter}
            contextCategoryPath={contextCategoryPath}
            setCategoryPath={setCategoryPath}
          />
        </div>
      )}

      {checkboxFilters.length > 0 && (
        <div className="filter-section">
          <div className="filter-section-header">
            <h3 className="filter-section-title">Filters</h3>
            <button
              onClick={onClearFilters}
              style={{
                border: 'none',
                background: 'none',
                color: '#007185',
                fontSize: '0.8rem',
              }}
            >
              Clear all
            </button>
          </div>

          {checkboxFilters.map((filter) => {
            const isOpen = expanded[filter.key] ?? true;
            const values = filter.values ?? [];

            return (
              <div key={filter.key} className="filter-subsection">
                <div
                  className="filter-section-title"
                  onClick={() => toggleSection(filter.key)}
                  style={{ cursor: 'pointer' }}
                >
                  {filter.key.toUpperCase()}
                  <span style={{ float: 'right' }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </div>

                {isOpen && (
                  <div className="filter-list">
                    {values.map((value) => {
                      const checked =
                        appliedFilters[filter.key]?.includes(value) ?? false;

                      return (
                        <label key={value} className="filter-checkbox">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              onFilterChange(
                                filter.key,
                                value,
                                e.target.checked
                              )
                            }
                          />
                          <span>{value}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {priceFilter && (
        <div className="filter-section">
          <PriceSlider
            min={priceFilter.min ?? 0}
            max={priceFilter.max ?? 0}
            value={price}
            onChange={onPriceChange}
          />
        </div>
      )}
    </div>
  );
};
