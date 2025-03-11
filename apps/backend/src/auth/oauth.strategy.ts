import { Get, Injectable, Scope } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { AuthService } from './auth.service';

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, 'oauth') {
  constructor(private readonly authService: AuthService) {
    super({
      authorizationURL: process.env.OATH_AUTHORIZATION_URL,
      tokenURL: process.env.OAUTH_TOKEN_URL,
      clientID: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_CALLBACK_URL,
      scope: 'openid',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    //Om profiel op te halen
    profile = await fetch(process.env.OAUTH_PROFILE_INFO_URL!, {
      headers: {
        Authorization: `Bearer ` + accessToken,
      },
    }).then((res) => res.json());

    const user = await this.authService.validateOAuthLogin(profile);
    return user;
  }
}
