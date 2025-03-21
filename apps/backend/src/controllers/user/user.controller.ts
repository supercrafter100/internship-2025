import { Controller, Get, Req } from '@nestjs/common';
import { SessionRequest } from 'src/auth/sessionData';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  getUserInfo(@Req() req: SessionRequest) {
    return req.session.user;
  }

  @Get('projects')
  async getUserProjects(@Req() req: SessionRequest) {
    const internalUser = req.session.internalUser;
    const projects = await this.userService.getUserProjects(internalUser.id);
    return projects;
  }
}
