// Generic, business-agnostic HTTP types shared by the whole API layer.
// No GitHub/User/Repository-specific shapes belong here — those live in
// their owning entity's api/types.

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestOptions {
  method?: HttpMethod
  headers?: Record<string, string>
  query?: Record<string, string | number | boolean | undefined>
  body?: unknown
  signal?: AbortSignal
}

export interface ApiSuccessMeta {
  status: number
}
