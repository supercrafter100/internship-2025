import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  public validateOAuthLogin(profile: any): any {
    if (!profile) {
      throw new UnauthorizedException();
    }

    return { profile };
  }
}
