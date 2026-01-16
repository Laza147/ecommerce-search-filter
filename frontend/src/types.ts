export interface PriceRange {
  min: number | null;
  max: number | null;
}

export interface SearchRequest {
  query: string;
  filters: Record<string, string[]>;
  price: PriceRange | null;
  sort: string | null;
  page: number;
  limit: number;
  contextCategoryPath: string[];
}

export interface Meta {
  totalResults: number;
  page: number;
  limit: number;
  filtersApplied: boolean;
  relaxed: boolean;
}

export interface SortOption {
  key: string;
  label: string;
}

export interface SearchFilter {
  key: string;
  type: 'checkbox' | 'slider' | 'hierarchical';
  values?: string[]; // checkbox
  levels?: Record<number, string[]>; // hierarchical
  min?: number; // slider
  max?: number; // slider
}

export interface ProductFeature {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  discountPercentage?: number;
  stock?: number;
  availabilityStatus?: string;
  rating?: number;
  reviewCount?: number;
  salesCount?: number;
  viewsCount?: number;
  features?: ProductFeature[];
  description?: string;
  categoryPath?: string[];
  createdAt?: string;
  updatedAt?: string;
  images: string[];
}

export interface SearchResponse {
  products: Product[];
  filters: SearchFilter[];
  sortOptions: SortOption[];
  meta: Meta;
  breadcrumb: string[];
}
