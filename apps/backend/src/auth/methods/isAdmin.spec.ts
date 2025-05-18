import { isAdmin } from './isAdmin';

describe('isAdmin', () => {
  it('should return false if session is missing', () => {
    const request = { session: null } as any;
    expect(isAdmin(request)).toBe(false);
  });

  it('should return false if session does not have internalUser', () => {
    const request = { session: {} } as any;
    expect(isAdmin(request)).toBe(false);
  });

  it('should return true if user is admin', () => {
    const request = {
      session: {
        internalUser: { admin: true },
      },
    } as any;
    expect(isAdmin(request)).toBe(true);
  });
});
