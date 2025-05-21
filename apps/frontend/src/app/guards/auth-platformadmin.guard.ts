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
export class PlatformAdminGuard implements CanActivate {
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

    const isPlatformAdmin = await this.userService.isPlatformAdmin();
    return isPlatformAdmin;
  }
}
