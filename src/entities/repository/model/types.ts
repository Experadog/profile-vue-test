// Domain model — decoupled from the GitHub DTO shape. UI and other layers
// consume this, never `api/types.ts` directly.

export interface Repository {
  id: number
  name: string
  htmlUrl: string
  ownerLogin: string
  ownerHtmlUrl: string
  private: boolean
}
