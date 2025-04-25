import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  public validateOAuthLogin(profile: any): any {
    if (!profile) {
      throw new UnauthorizedException();
    }
    const { email, ...user } = profile;

    // Make email lowercase
    return { profile: { ...user, email: email.toLowerCase() } };
  }
}
