import type { RouteRecordRaw } from 'vue-router'

import { ROUTE_NAMES } from '@/shared/config/routes-names'

export const routes: RouteRecordRaw[] = [
  {
    // No route is defined for the bare root, so land visitors on the
    // "Other users" search page instead of a blank screen.
    path: '/',
    redirect: { name: ROUTE_NAMES.users },
  },
  {
    path: '/users',
    name: ROUTE_NAMES.users,
    component: () => import('@/pages/users-page').then((m) => m.UsersPage),
  },
  {
    path: '/users/:username',
    name: ROUTE_NAMES.userProfile,
    component: () => import('@/pages/user-profile-page').then((m) => m.UserProfilePage),
  },
  {
    // Technical route: GitHub redirects here with `?code=...` after the
    // user approves the OAuth App. Never linked to directly.
    path: '/oauth/callback',
    name: ROUTE_NAMES.authCallback,
    component: () => import('@/pages/auth-callback-page').then((m) => m.AuthCallbackPage),
  },
  {
    // Fallback for any unknown path.
    path: '/:pathMatch(.*)*',
    redirect: { name: ROUTE_NAMES.users },
  },
]
