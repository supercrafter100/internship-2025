import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateOAuthLogin(profile: any): Promise<any> {
    if (!profile) {
      throw new UnauthorizedException();
    }

    return { profile };
  }
}
