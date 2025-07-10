// src/app/core/constants/role-routes.ts

export const roleRoutes: Record<string, string[]> = {
    EMPLOYEE: [
      '/travel/list',
      '/travel/create'
    ],
    BU_HEAD: [
      '/travel/list',
      '/travel/create',
      '/travel/buhead/list'
    ],
    CFO: [
        '/travel/list',
      '/travel/cfo/list',
      '/travel/create',
      `/travel/cfo/dashboard`
    ],
    ADMIN: [
      '/travel/cfo/list',
      '/travel/buhead/list',
      '/travel/create',
      '/travel/buhead/create',
      '/travel/list',
      `/travel/cfo/dashboard`
    ]
  };
  