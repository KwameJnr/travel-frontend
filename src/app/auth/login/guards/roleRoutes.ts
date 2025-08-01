// src/app/core/constants/role-routes.ts

export const roleRoutes: Record<string, string[]> = {
  'TR-EMPLOYEE': [
    '/travel/list',
    '/travel/create'
  ],
  'TR-BU_HEAD': [
    '/travel/list',
    '/travel/create',
    '/travel/buhead/list'
  ],
  'TR-CFO': [
    '/travel/list',
    '/travel/cfo/list',
    '/travel/create',
    '/travel/cfo/dashboard'
  ],
  'TR-ADMIN': [
    '/travel/cfo/list',
    '/travel/buhead/list',
    '/travel/create',
    '/travel/buhead/create',
    '/travel/list',
    '/travel/cfo/dashboard'
  ]
};
