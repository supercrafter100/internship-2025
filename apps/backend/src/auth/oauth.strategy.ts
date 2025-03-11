import { Get, Injectable, Scope } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { AuthService } from './auth.service';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'oauth') {
  constructor(private readonly authService: AuthService) {
    super({
      authorizationURL:
        'https://keycloak.iot-ap.be/realms/DEV_AP_Terra/protocol/openid-connect/auth',
      tokenURL:
        'https://keycloak.iot-ap.be/realms/DEV_AP_Terra/protocol/openid-connect/token',
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/oauth/callback',
      scope: 'openid',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    //Om profiel op te halen
    profile = await fetch(
      'https://keycloak.iot-ap.be/realms/DEV_AP_Terra/protocol/openid-connect/userinfo',
      {
        headers: {
          Authorization: `Bearer ` + accessToken,
        },
      },
    ).then((res) => res.json());

    const user = await this.authService.validateOAuthLogin(profile);
    return user;
  }
}
