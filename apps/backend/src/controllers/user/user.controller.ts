import { Controller, Get, Put, Req } from '@nestjs/common';
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

  @Get('projects/:projectId/users')
  async getProjectUsers(@Req() req: SessionRequest) {
    const internalUser = req.session.internalUser;
    const projectId = req.params.projectId;
    let users = await this.userService.getAllProjectUsers(Number(projectId));
    return users;
  }

  @Put('projects/:projectId/users/:userId/admin')
  async updateAdminStatus(@Req() req: SessionRequest) {
    const internalUser = req.body;
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const admin = req.body.admin;

    this.userService.updateAdminStatus(Number(projectId), userId, admin);
  }
}
