import { useCallback, useEffect, useState } from 'react';
import { searchApi } from '../api/search';
import type {
  Meta,
  PriceRange,
  Product,
  SearchFilter,
  SortOption,
} from '../types';

interface UseSearchState {
  products: Product[];
  filtersResponse: SearchFilter[];
  sortOptions: SortOption[];
  meta: Meta | null;
  breadcrumb: string[];
  query: string;
  filters: Record<string, string[]>;
  price: PriceRange | null;
  sort: string | null;
  contextCategoryPath: string[];
  loading: boolean;
  error: string | null;

  setQueryAndSearch: (query: string) => void;
  setCategoryPath: (path: string[]) => void;
  updateFilter: (key: string, value: string, checked: boolean) => void;
  clearFilters: () => void;
  setPriceRange: (range: PriceRange | null) => void;
  setSort: (sortKey: string | null) => void;
  goToPage: (page: number) => void;
  retry: () => void;
}

export function useSearch(): UseSearchState {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtersResponse, setFiltersResponse] = useState<SearchFilter[]>([]);
  const [sortOptions, setSortOptions] = useState<SortOption[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [price, setPrice] = useState<PriceRange | null>(null);
  const [sort, setSortKey] = useState<string | null>(null);
  const [contextCategoryPath, setContextCategoryPath] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeSearch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await searchApi({
        query,
        filters,
        price,
        sort,
        page,
        contextCategoryPath,
      });

      setProducts(res.products ?? []);
      setFiltersResponse(res.filters ?? []); // ✅ TRUST BACKEND
      setSortOptions(res.sortOptions ?? []);
      setMeta(res.meta ?? null);
      setBreadcrumb(res.breadcrumb ?? []);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [query, filters, price, sort, page, contextCategoryPath]);

  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  const setQueryAndSearch = (q: string) => {
    setQuery(q);
    setPage(0);
  };

  const setCategoryPath = (path: string[]) => {
    setContextCategoryPath(path.map(p => p.toLowerCase()));
    setPage(0);
  };
  

  const updateFilter = (key: string, value: string, checked: boolean) => {
    setFilters((prev) => {
      const existing = prev[key] ?? [];
      const nextValues = checked
        ? [...new Set([...existing, value])]
        : existing.filter((v) => v !== value);

      const next = { ...prev };
      if (nextValues.length > 0) next[key] = nextValues;
      else delete next[key];

      return next;
    });
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({});
    setPrice(null);
    setPage(0);
  };

  const setPriceRange = (range: PriceRange | null) => {
    setPrice(range);
    setPage(0);
  };

  const setSort = (sortKey: string | null) => {
    setSortKey(sortKey);
    setPage(0);
  };

  const goToPage = (newPage: number) => {
    setPage(newPage);
  };

  const retry = () => {
    executeSearch();
  };

  return {
    products,
    filtersResponse,
    sortOptions,
    meta,
    breadcrumb,
    query,
    filters,
    price,
    sort,
    contextCategoryPath,
    loading,
    error,
    setQueryAndSearch,
    setCategoryPath,
    updateFilter,
    clearFilters,
    setPriceRange,
    setSort,
    goToPage,
    retry,
  };
}
