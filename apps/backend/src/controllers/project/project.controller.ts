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
import { request } from 'http';
import { isAdmin } from 'src/auth/methods/isAdmin';
import { canViewProject } from 'src/auth/methods/canViewProject';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() request: SessionRequest,
  ) {
    if (!isAdmin(request)) {
      throw new UnauthorizedException();
    }

    const project = await this.projectService
      .create(createProjectDto)
      .catch((error) => {
        console.error(error);
      });

    return project;
  }

  @Get()
  async findAll(
    @Query('hidden') showHidden: string,
    @Req() request: SessionRequest,
  ) {
    const admin = isAdmin(request);
    const projects = await this.projectService
      .findAll(admin ? showHidden === 'true' : false)
      .catch((error) => {
        console.error(error);
      });

    return projects;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: SessionRequest) {
    if (!canViewProject(request, +id)) {
      throw new UnauthorizedException();
    }

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
    if (!isAdmin(request)) {
      throw new UnauthorizedException();
    }

    return this.projectService.update(+id, updateProjectDto).catch((error) => {
      console.error(error);
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: SessionRequest) {
    if (!isAdmin(request)) {
      throw new UnauthorizedException();
    }

    return this.projectService.remove(+id).catch((error) => {
      console.error(error);
    });
  }
}
