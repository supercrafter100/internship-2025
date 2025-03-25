import { Role } from '@prisma/client';
import { SessionRequest } from '../sessionData';

export function canEditProject(request: SessionRequest, projectId: number) {
  if (!request.session) {
    return false;
  }
  if (request.session.internalUser.admin) return true;
  return request.session.projects.some(
    (project) => project.id === projectId && project.role === Role.ADMIN,
  );
}
