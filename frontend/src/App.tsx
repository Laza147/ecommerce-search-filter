import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from './types';

import { Header } from './components/layout/Header';
import { Breadcrumbs } from './components/layout/Breadcrumbs';
import { FilterPanel } from './components/filters/FilterPanel';
import { ProductGrid } from './components/products/ProductGrid';
import { SortDropdown } from './components/common/SortDropdown';
import { PaginationControls } from './components/common/PaginationControls';
import { useSearch } from './hooks/useSearch';

import { useAuth } from './context/AuthContext';     // ✅ ADDED
import LoginPage from './pages/LoginPage';           // ✅ ADDED

const App: React.FC = () => {
  const { token } = useAuth(); // ✅ ADDED
  const search = useSearch();
  const navigate = useNavigate();

  // 🔒 AUTH GATE (NO UI CHANGE)
  if (!token) {
    return <LoginPage />;
  }

  const handleProductClick = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="app-root">
      <Header
        query={search.query}
        onSearch={(q) => search.setQueryAndSearch(q)}
      />

      <main className="main-layout">
        <aside className="sidebar">
          <FilterPanel
            filters={search.filtersResponse}
            appliedFilters={search.filters} 
            price={search.price}
            onFilterChange={search.updateFilter}
            onClearFilters={search.clearFilters}
            onPriceChange={search.setPriceRange}
            contextCategoryPath={search.contextCategoryPath}   // ✅ ADD
            setCategoryPath={search.setCategoryPath}
          />
        </aside>

        <section className="content">
          <Breadcrumbs
            breadcrumb={search.breadcrumb}
            onSelect={(path) => search.setCategoryPath(path)}
          />

          <div className="results-header">
            <div className="results-meta">
              {search.meta && (
                <span>
                  {search.meta.totalResults} results
                  {search.meta.filtersApplied && ' • Filters applied'}
                </span>
              )}
            </div>

            <SortDropdown
              sortOptions={search.sortOptions}
              selectedKey={search.sort}
              onChange={search.setSort}
            />
          </div>

          {search.loading && <div className="status">Loading products…</div>}

          {search.error && (
            <div className="status status-error">
              <p>Something went wrong while fetching products.</p>
              <button onClick={search.retry}>Retry</button>
            </div>
          )}

          {!search.loading && !search.error && (
            <>
              {search.products.length === 0 ? (
                <div className="status status-empty">
                  <h2>No products found</h2>
                  <p>Try removing some filters or broadening your category.</p>
                  <button onClick={search.clearFilters}>Clear filters</button>
                </div>
              ) : (
                <ProductGrid
                  products={search.products}
                  onProductClick={handleProductClick}
                />
              )}

              {search.meta &&
                search.meta.totalResults > search.meta.limit && (
                  <PaginationControls
                    page={search.meta.page}
                    limit={search.meta.limit}
                    total={search.meta.totalResults}
                    onPageChange={search.goToPage}
                  />
                )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
