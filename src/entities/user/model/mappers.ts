import type { GitHubUserDto, GitHubUserSearchResponseDto } from '../api/types'
import type { User, UserSearchResult } from './types'

// The only place GitHub DTOs are converted into the domain model.
export function mapGithubUserToUser(dto: GitHubUserDto): User {
  return {
    id: dto.id,
    login: dto.login,
    avatarUrl: dto.avatar_url,
    profileUrl: dto.html_url,
    followers: dto.followers,
    following: dto.following,
    publicRepos: dto.public_repos,
    createdAt: dto.created_at,
    name: dto.name ?? undefined,
    bio: dto.bio ?? undefined,
    location: dto.location ?? undefined,
    company: dto.company ?? undefined,
    blog: dto.blog ?? undefined,
    email: dto.email ?? undefined,
  }
}

export function mapGithubUserSearchResponseToUserSearchResult(
  dto: GitHubUserSearchResponseDto,
): UserSearchResult {
  return {
    totalCount: dto.total_count,
    incompleteResults: dto.incomplete_results,
    users: dto.items.map(mapGithubUserToUser),
  }
}
