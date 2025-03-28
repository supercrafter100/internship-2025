import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
  @Get('oauth')
  @UseGuards(AuthGuard('oauth'))
  async oauthLogin(@Req() req) {}

  @Get('oauth/callback')
  @UseGuards(AuthGuard('oauth'))
  async oauthCallback(@Req() req, @Res() res) {
    // login logic to validate req.body.user and req.body.pass
    // would be implemented here. for this example any combo works
    const user = req.user;
    console.log(user);
    req.session.regenerate(function (err) {
      if (err) throw err;
      // regenerate the session, which is good practice to help
      // guard against forms of session fixation
      req.session.regenerate(function (err) {
        if (err) throw err;
        // store user information in session, typically a user id
        req.session.user = user;

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
}
