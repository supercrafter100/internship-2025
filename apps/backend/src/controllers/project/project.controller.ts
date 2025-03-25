import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  Delete,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectService } from 'src/services/project/project.service';
import { CreateProjectDto } from '@bsaffer/api/project/dto/create-project.dto';
import { UpdateProjectDto } from '@bsaffer/api/project/dto/update-project.dto';
import { SessionRequest } from 'src/auth/sessionData';
import { Role } from '@prisma/client';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    const project = await this.projectService
      .create(createProjectDto)
      .catch((error) => {
        console.error(error);
      });

    return project;
  }

  @Get()
  async findAll(@Query('hidden') showHidden: string) {
    const projects = await this.projectService
      .findAll(showHidden === 'true')
      .catch((error) => {
        console.error(error);
      });

    return projects;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectService.findOne(+id).catch((error) => {
      console.error(error);
    });

    return project;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() request: SessionRequest,
  ) {
    // Check if logged in user has access to edit this project
    if (
      request.session.internalUser.admin ||
      request.session.projects.find(
        (p) => p.projectId === +id && p.role === Role.ADMIN,
      )
    ) {
      return this.projectService
        .update(+id, updateProjectDto)
        .catch((error) => {
          console.error(error);
        });
    }
    throw new UnauthorizedException();
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: SessionRequest) {
    if (
      request.session.internalUser.admin ||
      request.session.projects.find(
        (p) => p.projectId === +id && p.role === Role.ADMIN,
      )
    ) {
      return this.projectService.remove(+id).catch((error) => {
        console.error(error);
      });
    }
    throw new UnauthorizedException();
  }
}
