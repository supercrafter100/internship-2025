/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { User, UserProfile } from '@bsaffer/common/entity/user.entity';
import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/services/user/user.service';
import { SessionRequest } from './sessionData';
import session from 'express-session';
@Controller('auth')
export class AuthController {
  private redirectionsMap: Record<string, string> = {};

  constructor(private userService: UserService) {}

  @Get('oauth')
  @UseGuards(AuthGuard('oauth'))
  async oauthLogin() {}

  @Get('oauth/login')
  async login(
    @Query('redirectUrl') redirectTo: string,
    @Query('logoutFirst') logoutFirst: string,
    @Req() req: SessionRequest,
    @Res() res,
  ) {
    if (logoutFirst === 'true' && req.session.user) {
      const response = await fetch(process.env.OAUTH_LOGOUT_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: (req.session.user as any).refreshToken,
          client_secret: process.env.OAUTH_CLIENT_SECRET!,
          client_id: process.env.OAUTH_CLIENT_ID!,
        }),
      }).then((res) => res.text());
      console.log(response);
    }

    this.redirectionsMap[req.session.id] = redirectTo;
    res.redirect('/api/auth/oauth');
  }

  @Get('oauth/callback')
  @UseGuards(AuthGuard('oauth'))
  oauthCallback(@Req() req, @Res() res) {
    // login logic to validate req.body.user and req.body.pass
    // would be implemented here. for this example any combo works
    const user = req.user;
    const sessionId = req.session.id;
    req.session.regenerate((err) => {
      if (err) throw err;
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(async (err) => {
        if (err) throw err;
        // store user information in session, typically a user id
        req.session.user = user;
        req.session.internalUser = await this.userService.registerUser(
          user as { profile: UserProfile },
        );
        req.session.projects = await this.userService.getUserProjects(
          req.session.internalUser.id as number,
        );

        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save((err) => {
          if (err) throw err;
          if (sessionId in this.redirectionsMap) {
            const url = this.redirectionsMap[sessionId];
            const appendedSearchParams = new URLSearchParams();
            appendedSearchParams.set('fromLogin', 'true');
            const redirectUrl = `${url}?${appendedSearchParams.toString()}`;
            res.redirect(redirectUrl);
            delete this.redirectionsMap[sessionId];
            return;
          }
          res.redirect('/home');
        });
      });
    });

    return user;
  }

  @Post('logout')
  logout(
    @Req() req: SessionRequest,
    @Res() res,
    @Query('redirectUrl') redirectTo: string,
  ) {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect(redirectTo ?? '/');
    });
  }
}
