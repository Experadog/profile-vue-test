// Raw GitHub OAuth token-exchange response. GitHub can reply with HTTP 200
// and still carry an `error` field (e.g. a reused/expired authorization
// code), so callers must check for that instead of relying on the HTTP
// status alone.
export interface GitHubAccessTokenResponseDto {
  access_token?: string
  token_type?: string
  scope?: string
  error?: string
  error_description?: string
}
