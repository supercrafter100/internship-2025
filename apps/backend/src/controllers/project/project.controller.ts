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
import { ProjectService } from '../../services/project/project.service';
import { CreateProjectDto } from '@bsaffer/api/project/dto/create-project.dto';
import { UpdateProjectDto } from '@bsaffer/api/project/dto/update-project.dto';
import { SessionRequest } from '../../auth/sessionData';
import { isAdmin } from '../../auth/methods/isAdmin';

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

  @Get('own')
  async findOwn(@Req() request: SessionRequest) {
    if (!request.session.internalUser) {
      throw new UnauthorizedException();
    }

    if (request.session.internalUser.admin) {
      // just return everything
      return this.projectService.findAll(true);
    }

    return this.projectService
      .findOwn(request.session.internalUser.id)
      .catch((error) => {
        console.error(error);
      });
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
