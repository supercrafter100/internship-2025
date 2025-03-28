import { Controller, Get, Req, Res } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get('info')
  async getUserInfo(@Req() req) {
    return req.session.user;
  }
}
