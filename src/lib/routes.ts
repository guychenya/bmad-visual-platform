export const routes = {
  home: '/',
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
  },
  dashboard: {
    home: '/dashboard',
    agents: '/dashboard/agents',
    create: '/dashboard/create',
    hierarchy: '/dashboard/hierarchy',
    organizations: '/dashboard/organizations',
    projects: '/dashboard/projects',
    settings: '/dashboard/settings',
    templates: '/dashboard/templates',
    workflow: '/dashboard/workflow',
    projectDetail: (id: string) => `/dashboard/projects/${id}`,
    agentDetail: (id: string) => `/dashboard/agents/${id}`,
  },
  // Add other top-level routes as needed
};
