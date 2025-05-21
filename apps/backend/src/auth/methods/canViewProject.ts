import { SessionRequest } from '../sessionData';

export function canViewProject(request: SessionRequest, projectId: number) {
  if (!request.session) {
    return false;
  }
  if (request.session.internalUser.admin) return true;
  console.log(request.session.projects);
  return request.session.projects.some((project) => project.id === projectId);
}
