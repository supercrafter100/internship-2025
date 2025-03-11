import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  @Get('oauth')
  @UseGuards(AuthGuard('oauth'))
  async oauthLogin(@Req() req) {}

  @Get('oauth/callback')
  @UseGuards(AuthGuard('oauth'))
  async oauthCallback(@Req() req) {
    const user = req.user;
    // TODO JWT add cookie + redirect

    return user;
  }
}
