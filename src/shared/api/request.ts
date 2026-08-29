import { buildHeaders } from './client'
import { ApiError, toApiError } from './errors'
import type { RequestOptions } from './types'

function buildUrl(baseUrl: string, path: string, query?: RequestOptions['query']): string {
  const url = new URL(path, baseUrl)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  return url.toString()
}

// Generic, typed request executor. Entity/feature `api/` modules call this
// with a base URL (from `endpoints.ts`) and a path — it never knows about
// GitHub, users, or repositories itself.
export async function request<TResponse>(
  baseUrl: string,
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { method = 'GET', headers, query, body, signal } = options

  let response: Response
  try {
    response = await fetch(buildUrl(baseUrl, path, query), {
      method,
      headers: buildHeaders(headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (error) {
    throw new ApiError('Network request failed', 'network', undefined, toApiError(error))
  }

  if (!response.ok) {
    let details: unknown
    try {
      details = await response.json()
    } catch {
      details = undefined
    }

    throw new ApiError(
      `Request failed with status ${response.status}`,
      'http',
      response.status,
      details,
    )
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  try {
    return (await response.json()) as TResponse
  } catch (error) {
    throw new ApiError('Failed to parse response body', 'parse', response.status, error)
  }
}
