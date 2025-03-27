import { Controller, Get, Req } from '@nestjs/common';
import { SessionRequest } from 'src/auth/sessionData';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  getUserInfo(@Req() req: SessionRequest) {
    return {
      user: req.session.user,
      internalUser: req.session.internalUser,
      projects: req.session.projects,
    };
  }

  @Get('projects')
  async getUserProjects(@Req() req: SessionRequest) {
    const internalUser = req.session.internalUser;
    const projects = await this.userService.getUserProjects(internalUser.id);
    return projects;
  }
}
