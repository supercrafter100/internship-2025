import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKey } from '@prisma/client';
import { ApikeyService } from '../../services/apikey/apikey.service';
import { CreateApiKeyDto } from '@bsaffer/api/api/dto/create-apiKey.dto';
import { SessionRequest } from '../../auth/sessionData';
import { canEditProject } from '../../auth/methods/canEditProject';

@Controller('apikey')
export class ApikeyController {
  constructor(private apiKeyService: ApikeyService) {}

  @Get('project/:id')
  public async getProjectKeys(
    @Param('id') id: string,
    @Req() request: SessionRequest,
  ): Promise<ApiKey[]> {
    if (!id || isNaN(+id)) {
      throw new UnauthorizedException('Project ID is not valid');
    }

    if (!canEditProject(request, +id)) {
      throw new UnauthorizedException();
    }

    return await this.apiKeyService.getProjectKeys(+id);
  }

  @Post('project/:id')
  public async createApiKey(
    @Param('id') id: string,
    @Body() body: CreateApiKeyDto,
    @Req() request: SessionRequest,
  ): Promise<ApiKey> {
    if (!id || isNaN(+id)) {
      throw new UnauthorizedException('Project ID is not valid');
    }

    if (!canEditProject(request, +id)) {
      throw new UnauthorizedException();
    }

    return await this.apiKeyService.createApiKey(+id, body.name);
  }

  @Delete('/:key')
  public async deleteApiKey(
    @Param('key') key: string,
    @Req() request: SessionRequest,
  ): Promise<void> {
    if (!key) {
      throw new UnauthorizedException('API Key is not valid');
    }

    // Get the project associated to this key
    const apiKey = await this.apiKeyService.getApiKey(+key);
    if (!apiKey) {
      throw new UnauthorizedException();
    }

    // Check if the user has access to the project
    if (!canEditProject(request, apiKey.projectId)) {
      throw new UnauthorizedException();
    }

    await this.apiKeyService.deleteApiKey(apiKey.id);
  }
}
