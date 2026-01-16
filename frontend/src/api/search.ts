import type { SearchRequest, SearchResponse } from '../types';

const DEFAULT_LIMIT = 20;

export async function searchApi(
  params: Partial<SearchRequest>
): Promise<SearchResponse> {
  const body: SearchRequest = {
    query: params.query ?? '',
    filters: params.filters ?? {},
    price: params.price ?? null,
    sort: params.sort ?? null,
    page: params.page ?? 0,
    limit: params.limit ?? DEFAULT_LIMIT,
    contextCategoryPath: params.contextCategoryPath ?? [],
  };

  const res = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Search API error: ${res.status}`);
  }

  return res.json();
}
