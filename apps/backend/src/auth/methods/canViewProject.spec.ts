import { canViewProject } from './canViewProject';

describe('canViewProject', () => {
  it('should return false if session is missing', () => {
    const request = { session: null } as any;
    expect(canViewProject(request, 5)).toBe(false);
  });

  it('should return true for admin user', () => {
    const request = {
      session: {
        internalUser: { admin: true },
        projects: [],
      },
    } as any;
    expect(canViewProject(request, 5)).toBe(true);
  });

  it('should return true if user has access to that project', () => {
    const request = {
      session: {
        internalUser: { admin: false },
        projects: [{ projectId: 5 }],
      },
    } as any;
    expect(canViewProject(request, 5)).toBe(true);
  });
});
