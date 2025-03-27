import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable()
export class ProjectAdminGuard implements CanActivate {
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

      this.router.navigate(['/api/auth']);
      return false;
    }

    const params = route.params;
    if (params['id']) {
      const canAccess = await this.userService.canEditProject(+params['id']);
      if (!canAccess) {
        if (route.queryParams['fromLogin']) {
          this.router.navigateByUrl('/home?failedLogin=true');
          return false;
        }

        this.router.navigate([
          '/api/auth/oauth/login?redirectUrl=' + state.url,
        ]);
      }
      return canAccess;
    }

    return false;
  }
}
