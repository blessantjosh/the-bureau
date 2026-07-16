/**
 * Standard successful API response envelope.
 *
 * @typeParam T - Shape of the payload returned in `data`.
 */
export interface ApiResponse<T> {
  /** Always `true` for successful responses. */
  success: true;

  /** The response payload. */
  data: T;

  /** Optional human-readable message (e.g. "Resource created successfully"). */
  message?: string;

  /** ISO-8601 timestamp of when the response was generated. */
  timestamp: string;
}

/**
 * Standard error API response envelope.
 * Mirrors the shape produced by {@link HttpExceptionFilter}.
 */
export interface ApiError {
  /** Always `false` for error responses. */
  success: false;

  /** Short machine-readable error label (e.g. "Not Found"). */
  error: string;

  /** Human-readable description of what went wrong. */
  message: string;

  /** The request path that triggered the error. */
  path: string;

  /** ISO-8601 timestamp of when the error occurred. */
  timestamp: string;
}
