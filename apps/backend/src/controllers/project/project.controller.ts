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
} from '@nestjs/common';
import { ProjectService } from 'src/services/project/project.service';
import { CreateProjectDto } from '@bsaffer/api/project/dto/create-project.dto';
import { UpdateProjectDto } from '@bsaffer/api/project/dto/update-project.dto';
import { Public, Roles, KeycloakUser } from 'nest-keycloak-connect';

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

  //@Roles('Gebruiker')
  @Get()
  async findAll(@Query('hidden') showHidden: string, @Req() req) {
    console.log(req.session);

    const projects = await this.projectService
      .findAll(showHidden === 'true')
      .catch((error) => {
        console.error(error);
      });

    return projects;
  }

  @Get('user')
  async Get() {
    return KeycloakUser.name;
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
  ) {
    return this.projectService.update(+id, updateProjectDto).catch((error) => {
      console.error(error);
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.projectService.remove(+id).catch((error) => {
      console.error(error);
    });
  }
}
