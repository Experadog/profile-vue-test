// Raw GitHub REST API DTO only — shape exactly as GitHub returns it.
// Never used directly in UI; always passed through mappers.ts first.

export interface GitHubRepositoryOwnerDto {
  login: string
  html_url: string
}

export interface GitHubRepositoryDto {
  id: number
  name: string
  html_url: string
  owner: GitHubRepositoryOwnerDto
  private: boolean
}
