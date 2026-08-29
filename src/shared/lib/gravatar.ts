import { md5 } from './md5'

// Builds a Gravatar URL for use as an avatar fallback when GitHub has no
// `avatar_url` for a user. `d=identicon` gives a deterministic placeholder
// image instead of erroring when the email has no registered Gravatar.
export function buildGravatarUrl(email: string, size = 64): string {
  const hash = md5(email.trim().toLowerCase())
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
}
