// src/app/core/constants/role-routes.ts

export const roleRoutes: Record<string, string[]> = {
  'TR_USER': [
    '/travel/list',
    '/travel/create'
  ],
  'TR_BU_HEAD': [
    '/travel/list',
    '/travel/create',
    '/travel/buhead/list'
  ],
  'TR_CFO': [
    '/travel/list',
    '/travel/cfo/list',
    '/travel/create',
    '/travel/cfo/dashboard'
  ],
  'TR_ADMIN': [
    '/travel/cfo/list',
    '/travel/buhead/list',
    '/travel/create',
    '/travel/buhead/create',
    '/travel/list',
    '/travel/cfo/dashboard'
  ]
};
