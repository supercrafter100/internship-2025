import { SessionRequest } from '../sessionData';

export function isAdmin(request: SessionRequest) {
  if (!request.session || !request.session.internalUser) {
    return false;
  }
  return request.session.internalUser.admin;
}
