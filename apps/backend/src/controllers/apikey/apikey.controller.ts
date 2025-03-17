import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiKey } from '@prisma/client';
import { ApikeyService } from 'src/services/apikey/apikey.service';
import { CreateApiKeyDto } from '@bsaffer/api/api/dto/create-apiKey.dto';

@Controller('apikey')
export class ApikeyController {
  constructor(private apiKeyService: ApikeyService) {}

  @Get('project/:id')
  public async getProjectKeys(@Param('id') id: string): Promise<ApiKey[]> {
    return await this.apiKeyService.getProjectKeys(+id);
  }

  @Post('project/:id')
  public async createApiKey(
    @Param('id') id: string,
    @Body() body: CreateApiKeyDto,
  ): Promise<ApiKey> {
    return await this.apiKeyService.createApiKey(+id, body.name);
  }

  @Delete('/:key')
  public async deleteApiKey(@Param('key') key: string): Promise<void> {
    await this.apiKeyService.deleteApiKey(+key);
  }
}
