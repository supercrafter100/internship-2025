import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { TtnService } from 'src/services/ttn/ttn.service';
import { canEditProject } from 'src/auth/methods/canEditProject';
import { SessionRequest } from 'src/auth/sessionData';
import { TtnProvider } from '@prisma/client';
import { CreateTtnCredDto } from '@bsaffer/api/ttncred/dto/create-ttncred.dto';
import { UpdateDeviceDto } from '@bsaffer/api/device/dto/update-device.dto';

@Controller('ttncred')
export class TtncredController {
  constructor(private ttnService: TtnService) {}

  // Get all TTN credentials for a project
  @Get('project/:id')
  public async getProjectTtnCreds(
    @Param('id') id: string,
    @Req() request: SessionRequest,
  ): Promise<TtnProvider[]> {
    if (!canEditProject(request, +id)) {
      throw new UnauthorizedException();
    }
    const response = await this.ttnService.getAllTtnCredentialsFromProject(+id);
    return response.ttnCredentials;
  }

  // Add TTN credentials to a project
  @Post('project/:id')
  public async createTtnCreds(
    @Param('id') id: string,
    @Body() body: CreateTtnCredDto,
    @Req() request: SessionRequest,
  ): Promise<TtnProvider> {
    if (!canEditProject(request, +id)) {
      throw new UnauthorizedException();
    }
    return await this.ttnService.addTtnCredentialsToProject(
      body,
      request.session.internalUser.id,
    );
  }

  // Update TTN credentials for a project
  @Patch('project/:id')
  public async updateTtnCreds(
    @Param('id') id: string,
    @Body() body: UpdateDeviceDto,
    @Req() request: SessionRequest,
    @Res() res: any,
  ) {
    if (!canEditProject(request, +id)) {
      throw new UnauthorizedException();
    }
    return res.status(200).json({ message: 'Update successful' });
  }

  // Delete TTN credentials from a project
  @Delete('project/:id')
  public async deleteTtnCreds(
    @Param('id') id: string,
    @Body('ttnId') ttnId: number,
    @Req() request: SessionRequest,
  ): Promise<void> {
    if (!canEditProject(request, +id)) {
      throw new UnauthorizedException();
    }

    if (ttnId == undefined) {
      throw new Error('TTN ID is undefined');
    }
    await this.ttnService.removeTtnCredentialsFromProject(+id, ttnId);
  }
}
