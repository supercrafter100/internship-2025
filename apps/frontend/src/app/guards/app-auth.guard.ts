import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { inject } from '@angular/core';

/**
 * The logic below is a simple example, please make it more robust when implementing in your application.
 *
 * Reason: isAccessGranted is not validating the resource, since it is merging all roles. Two resources might
 * have the same role name and it makes sense to validate it more granular.
 */

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  __: RouterStateSnapshot,
  authData: AuthGuardData,
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;
  const router = inject(Router);

  // Redirect naar login als niet ingelogd
  if (!authenticated) {
    return router.parseUrl('/login');
  }

  // Ondersteun zowel 'role' als 'roles' in de route-data
  const requiredRoles: string[] =
    route.data['roles'] || [route.data['role']].filter(Boolean);
  if (!requiredRoles.length) {
    return false; // Geen rollen gedefinieerd, toegang weigeren
  }

  // Controleer per resource of een van de vereiste rollen aanwezig is
  const hasRequiredRole = (rolesToCheck: string[]): boolean => {
    for (const [resource, roles] of Object.entries(
      grantedRoles.resourceRoles,
    )) {
      if (rolesToCheck.some((role) => roles.includes(role))) {
        return true;
      }
    }
    return false;
  };

  return hasRequiredRole(requiredRoles) ? true : router.parseUrl('/forbidden');
};

export const canActivateAuthRole =
  createAuthGuard<CanActivateFn>(isAccessAllowed);
