import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { SessionRequest } from 'src/auth/sessionData';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // This endpoint is used to retrieve the user information from the session.
  @Get('info')
  getUserInfo(@Req() req: SessionRequest) {
    return {
      user: req.session.user,
      internalUser: req.session.internalUser,
      projects: req.session.projects,
    };
  }

  // This endpoint is used to retrieve all projects associated with the user.
  @Get('projects')
  async getUserProjects(@Req() req: SessionRequest) {
    const internalUser = req.session.internalUser;
    const projects = await this.userService.getUserProjects(internalUser.id);
    return projects;
  }

  // This endpoint is used to retrieve all users associated with a specific project. It requires the project ID in the request parameters.
  @Get('projects/:projectId/users')
  async getProjectUsers(@Req() req: SessionRequest) {
    const internalUser = req.session.internalUser;
    const projectId = req.params.projectId;
    let users = await this.userService.getAllProjectUsers(Number(projectId));
    return users;
  }

  // This endpoint is used to update the admin status of a user in a project. It requires the project ID, user ID, and admin status in the request body.
  @Put('projects/:projectId/users/:userId/admin')
  async updateAdminStatus(@Req() req: SessionRequest) {
    const internalUser = req.body;
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const admin = req.body.admin;

    this.userService.updateAdminStatus(Number(projectId), userId, admin);
  }

  // This endpoint is used to add a user to a project. It requires the project ID and the user's email in the request body.
  @Post('projects/:projectId/users')
  async addUserToProject(@Req() req: SessionRequest) {
    try {
      const projectId = req.params.projectId;
      const userEmail = req.body.email;

      await this.userService.addUserToProject(Number(projectId), userEmail);
      return { message: 'User added to project successfully' };
    } catch (error) {
      throw new BadRequestException(
        'Error adding user to project: ' + error.message,
      );
    }
  }

  // This endpoint is used to remove a user from a project. It requires the project ID and the user's ID in the request body.
  @Delete('projects/:projectId/users')
  async removeUserFromProject(@Req() req: SessionRequest) {
    const projectId = req.params.projectId;
    const userId = req.body.userId;

    await this.userService.removeUserFromProject(Number(projectId), userId);
    return { message: 'User removed from project successfully' };
  }
}
