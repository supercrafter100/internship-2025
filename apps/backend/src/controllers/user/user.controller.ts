import { Controller, Get, Req, Res } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get('info')
  async getUserInfo(@Req() req, @Res() res) {
    return req.session.user;
  }
}
