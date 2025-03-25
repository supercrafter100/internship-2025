import { SessionRequest } from '../sessionData';

export function isAdmin(request: SessionRequest) {
  if (!request.session) {
    return false;
  }
  return request.session.internalUser.admin;
}
