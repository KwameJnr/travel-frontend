// src/app/core/constants/role-routes.ts

export const roleRoutes: Record<string, string[]> = {
  'TR_USER': [
    '/travel/list',
    '/travel/user/account',
    '/travel/create'
  ],
  'TR_BU_HEAD': [
    '/travel/list',
    '/travel/create',
    '/travel/user/account',
    '/travel/buhead/list'
  ],
  'TR_CFO': [
    '/travel/list',
    '/travel/cfo/list',
    '/travel/create',
    '/travel/user/account',
    '/travel/cfo/dashboard'
  ],
  'TR_ADMIN': [
    '/travel/cfo/list',
    '/travel/buhead/list',
    '/travel/create',
    '/travel/buhead/create',
    '/travel/list',
    '/travel/user/account',
    '/travel/user/list',
    '/travel/app/list',
    '/travel/perdiem/list',
    '/travel/cfo/dashboard'
  ]
};
