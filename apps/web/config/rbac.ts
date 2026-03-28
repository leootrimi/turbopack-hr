export type Role = 'admin' | 'hr' | 'employee';

export type RouteConfig = {
  path: string;
  roles: Role[];
};
//
export const ROUTE_ACCESS: RouteConfig[] = [
  { path: '/dashboard/admin', roles: ['admin', 'hr'] },
  { path: '/dashboard/timeoff/requests', roles: ['admin', 'hr'] },
  { path: '/dashboard', roles: ['admin', 'hr', 'employee'] },
  { path: '/dashboard/equipment/my', roles: ['admin', 'hr', 'employee'] },
  { path: '/dashboard/equipment/add', roles: ['admin', 'hr'] },
  { path: '/dashboard/equipment/assigned', roles: ['admin', 'hr'] },
  { path: '/dashboard/equipment/archived', roles: ['admin', 'hr'] },
];

export function canAccess(role: string | undefined, path: string): boolean {
  if (!role) return false;
  
  const match = [...ROUTE_ACCESS]
    .sort((a, b) => b.path.length - a.path.length)
    .find(route => path.startsWith(route.path));
    
  if (match) {
    return match.roles.includes(role as Role);
  }
  
  return true;
}
