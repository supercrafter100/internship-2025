import { canEditProject } from './canEditProject';

describe('canEditProject', () => {
  it('should return false if session is missing', () => {
    const request = { session: null } as any;
    expect(canEditProject(request, 5)).toBe(false);
  });

  it('should return true for admin user', () => {
    const request = {
      session: {
        internalUser: { admin: true },
        projects: [],
      },
    } as any;
    expect(canEditProject(request, 5)).toBe(true);
  });

  it('should return true if user is admin for that project', () => {
    const request = {
      session: {
        internalUser: { admin: false },
        projects: [{ id: 5, admin: true }],
      },
    } as any;
    expect(canEditProject(request, 5)).toBe(true);
  });

  it('should return false if user has no admin access to project', () => {
    const request = {
      session: {
        internalUser: { admin: false },
        projects: [{ id: 5, admin: false }],
      },
    } as any;
    expect(canEditProject(request, 5)).toBe(false);
  });
});
