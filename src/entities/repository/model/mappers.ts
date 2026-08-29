import type { GitHubRepositoryDto } from '../api/types'
import type { Repository } from './types'

// The only place GitHub DTOs are converted into the domain model.
export function mapGithubRepositoryToRepository(dto: GitHubRepositoryDto): Repository {
  return {
    id: dto.id,
    name: dto.name,
    htmlUrl: dto.html_url,
    ownerLogin: dto.owner.login,
    ownerHtmlUrl: dto.owner.html_url,
    private: dto.private,
  }
}
