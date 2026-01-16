// src/components/filters/CategorySidebar.tsx

import React from 'react';
import type { SearchFilter } from '../../types';

interface CategorySidebarProps {
  filter: SearchFilter;
  contextCategoryPath: string[];
  setCategoryPath: (path: string[]) => void;
}

// 🔥 MASTER ROOT CATEGORIES (frontend-only)
const ROOT_CATEGORIES = ['beauty', 'fashion', 'electronics', 'home', 'sports'];

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  filter,
  contextCategoryPath,
  setCategoryPath,
}) => {
  const levels = filter.levels ?? {};
  const canGoBack = contextCategoryPath.length > 0;

  // Decide what to show at level 0
  const rootLevel =
  contextCategoryPath.length === 0
    ? ROOT_CATEGORIES
    : levels[0] ?? ROOT_CATEGORIES;


  const handleClick = (levelIndex: number, value: string) => {
    const newPath = contextCategoryPath.slice(0, levelIndex);
    newPath[levelIndex] = value;
    setCategoryPath(newPath);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, fontSize: '0.95rem' }}>Categories</h3>
        {canGoBack && (
          <button
            onClick={() => setCategoryPath(contextCategoryPath.slice(0, -1))}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '0.75rem',
              color: '#007185',
            }}
          >
            ← Back
          </button>
        )}
      </div>

      {/* ROOT LEVEL (always visible) */}
      <ul style={{ listStyle: 'none', paddingLeft: 0, margin: '0.5rem 0' }}>
        {rootLevel.map((cat) => {
          const isActive = contextCategoryPath[0] === cat;

          return (
            <li key={cat}>
              <button
                onClick={() => handleClick(0, cat)}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: '0.15rem 0',
                  fontSize: '0.85rem',
                  color: isActive ? '#c45500' : '#007185',
                  fontWeight: isActive ? 700 : 400,
                  cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            </li>
          );
        })}
      </ul>

      {/* DEEPER LEVELS (from backend only) */}
      {Object.entries(levels)
        .filter(([k]) => Number(k) > 0)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([levelKey, values]) => {
          const levelIndex = Number(levelKey);

          return (
            <ul key={levelKey} style={{ listStyle: 'none', paddingLeft: 0 }}>
              {values.map((val) => {
                const isActive = contextCategoryPath[levelIndex] === val;

                return (
                  <li key={val}>
                    <button
                      onClick={() => handleClick(levelIndex, val)}
                      disabled={isActive}
                      style={{
                        border: 'none',
                        background: 'none',
                        padding: '0.15rem 0',
                        fontSize: '0.85rem',
                        color: isActive ? '#c45500' : '#007185',
                        fontWeight: isActive ? 700 : 400,
                        cursor: isActive ? 'default' : 'pointer',
                      }}
                    >
                      {val}
                    </button>
                  </li>
                );
              })}
            </ul>
          );
        })}
    </div>
  );
};
