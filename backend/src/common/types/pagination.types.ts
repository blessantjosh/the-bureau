/**
 * Metadata returned alongside a paginated collection.
 */
export interface PaginationMeta {
  /** Current page number (1-indexed). */
  page: number;

  /** Number of items per page. */
  limit: number;

  /** Total number of items across all pages. */
  total: number;

  /** Total number of available pages. */
  totalPages: number;
}

/**
 * Generic paginated result wrapper.
 *
 * @typeParam T - The type of each item in the data array.
 */
export interface PaginatedResult<T> {
  /** The subset of items for the current page. */
  data: T[];

  /** Pagination metadata. */
  meta: PaginationMeta;
}
