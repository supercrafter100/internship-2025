/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { User } from '@bsaffer/common/entity/user.entity';
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
@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Get('oauth')
  @UseGuards(AuthGuard('oauth'))
  async oauthLogin() {}

  @Get('oauth/callback')
  @UseGuards(AuthGuard('oauth'))
  oauthCallback(@Req() req, @Res() res) {
    // login logic to validate req.body.user and req.body.pass
    // would be implemented here. for this example any combo works
    const user = req.user;
    console.log(user);
    req.session.regenerate((err) => {
      if (err) throw err;
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(async (err) => {
        if (err) throw err;
        // store user information in session, typically a user id
        req.session.user = user;
        req.session.internalUser = await this.userService.registerUser(
          user as User,
        );

        // save the session before redirection to ensure page
        // load does not happen before session is saved
        req.session.save(function (err) {
          if (err) throw err;
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
