import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<GuardResult> {
    const authenticated = await this.userService.isAuthenticated();
    if (!authenticated) {
      if (route.queryParams['fromLogin']) {
        this.router.navigateByUrl('/home?failedLogin=true');
        return false;
      }

      window.location.href =
        '/api/auth/oauth/login?redirectUrl=' + encodeURIComponent(state.url);
      return false;
    }

    const params = route.params;
    if (params['id']) {
      if (Number.isNaN(+params['id'])) {
        this.router.navigateByUrl('/home');
        return false;
      }

      const canAccess = await this.userService.canAccessProject(+params['id']);
      if (!canAccess) {
        if (route.queryParams['fromLogin']) {
          this.router.navigateByUrl('/home?failedLogin=true');
          return false;
        }

        window.location.href =
          '/api/auth/oauth/login?redirectUrl=' + encodeURIComponent(state.url);
      }

      if (route.queryParams['fromLogin']) {
        // Redirect to same page without query params
        this.router.navigateByUrl(state.url.split('?')[0]);
      }
      return canAccess;
    }

    return false;
  }
}
