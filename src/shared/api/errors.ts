// Unified error shape for the whole API layer. Every failure surfaced by
// `request()` is normalized into an `ApiError`, so callers never have to
// branch on fetch-specific vs. HTTP-specific vs. network-specific errors.

export type ApiErrorKind = 'network' | 'http' | 'parse' | 'unknown'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status?: number
  readonly details?: unknown

  constructor(message: string, kind: ApiErrorKind, status?: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
    this.details = details
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 'unknown')
  }

  return new ApiError('An unknown error occurred', 'unknown', undefined, error)
}
