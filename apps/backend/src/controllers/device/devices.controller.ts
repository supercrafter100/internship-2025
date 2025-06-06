import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { DeviceService } from '../../services/device/device.service';
import { CreateDeviceDto } from '@bsaffer/api/device/dto/create-device.dto';
import { UpdateDeviceDto } from '@bsaffer/api/device/dto/update-device.dto';
import { SetupTTNParametersDTO } from '@bsaffer/api/device/dto/setupTTNParameters.dto';
import { canViewProject } from '../../auth/methods/canViewProject';
import { SessionRequest } from '../../auth/sessionData';
import { ApikeyService } from '../../services/apikey/apikey.service';
import { canEditProject } from 'src/auth/methods/canEditProject';

@Controller('devices')
export class DevicesController {
  constructor(
    private readonly devicesService: DeviceService,
    private readonly apiKeyService: ApikeyService,
  ) {}

  @Post()
  create(
    @Body() createDeviceDto: CreateDeviceDto,
    @Req() request: SessionRequest,
  ) {
    if (!canEditProject(request, createDeviceDto.projectId)) {
      throw new UnauthorizedException();
    }
    return this.devicesService.create(createDeviceDto);
  }

  @Get('project/:id')
  async findAllForProject(
    @Param('id') id: string,
    @Req() request: SessionRequest,
  ) {
    if (!id || isNaN(+id)) {
      throw new NotFoundException('Project ID is not valid');
    }

    if (
      !canViewProject(request, +id) &&
      !(await this.isValidAPIKey(request, +id))
    ) {
      throw new UnauthorizedException();
    }
    return this.devicesService.findAllForProject(+id);
  }

  @Get('project/:id/dashboard')
  async findAllForProjectDashboard(
    @Param('id') id: string,
    @Req() request: SessionRequest,
  ) {
    if (!id || isNaN(+id)) {
      throw new NotFoundException('Project ID is not valid');
    }

    if (
      !canViewProject(request, +id) &&
      !(await this.isValidAPIKey(request, +id))
    ) {
      throw new UnauthorizedException();
    }

    return this.devicesService.findAllForProjectDashboard(+id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: SessionRequest) {
    if (!id) {
      throw new NotFoundException('Project ID is not valid');
    }

    const device = await this.devicesService.findOne(id);
    if (!device) {
      throw new NotFoundException();
    }

    if (
      !canViewProject(request, device.projectId) &&
      !(await this.isValidAPIKey(request, device.projectId))
    ) {
      throw new UnauthorizedException();
    }

    return this.devicesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
    @Req() request: SessionRequest,
  ) {
    if (!id) {
      throw new NotFoundException('Project ID is not valid');
    }
    const device = await this.devicesService.findOne(id);
    if (!device) {
      throw new NotFoundException();
    }

    if (!canEditProject(request, device.projectId)) {
      throw new UnauthorizedException();
    }
    return this.devicesService.update(+id, updateDeviceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: SessionRequest) {
    if (!id) {
      throw new NotFoundException('Project ID is not valid');
    }

    const device = await this.devicesService.findOne(id);
    if (!device) {
      throw new NotFoundException();
    }

    if (!canEditProject(request, device.projectId)) {
      throw new UnauthorizedException();
    }

    return this.devicesService.remove(+id);
  }

  @Post(':id/ttnParameters')
  async setupTTNParameters(
    @Param('id') id: string,
    @Body() body: SetupTTNParametersDTO,
    @Req() request: SessionRequest,
  ) {
    if (!id) {
      throw new NotFoundException('Project ID is not valid');
    }

    const device = await this.devicesService.findOne(id);
    if (!device) {
      throw new NotFoundException();
    }

    if (!canEditProject(request, device.projectId)) {
      throw new UnauthorizedException();
    }

    await this.devicesService.setTTNParameters(id, body);
    await this.refreshMQTTaco();
  }

  @Get(':id/measurements')
  async getAllMeasurementsForDevice(
    @Param('id') id: string,
    @Req() request: SessionRequest,
  ) {
    if (!id) {
      throw new NotFoundException('Project ID is not valid');
    }

    const device = await this.devicesService.findOne(id);
    if (!device) {
      throw new NotFoundException();
    }

    if (
      !canViewProject(request, device.projectId) &&
      !(await this.isValidAPIKey(request, device.projectId))
    ) {
      throw new UnauthorizedException();
    }

    return await this.devicesService.getAllMeasurementsForDevice(id);
  }

  // Verwacht datum en tijd in volgend formaat 2025-02-22T14:00:00.000Z
  // Dit is een ISO 8601 datum- en tijdnotatie.
  @Get(':id/measurements/:start/:end/')
  async getSpecificDataForDevice(
    @Param('id') id: string,
    @Param('start') start: string,
    @Param('end') end: string,
    @Req() request: SessionRequest,
  ) {
    if (!id) {
      throw new NotFoundException('Project ID is not valid');
    }

    if (!start || !end) {
      throw new NotFoundException('Start and end dates are required');
    }

    if (new Date(start) > new Date(end)) {
      throw new NotFoundException('Start date cannot be after end date');
    }

    if (isNaN(new Date(start).getTime()) || isNaN(new Date(end).getTime())) {
      throw new NotFoundException('Invalid date format');
    }

    const device = await this.devicesService.findOne(id);
    if (!device) {
      throw new NotFoundException();
    }

    if (
      !canViewProject(request, device.projectId) &&
      !(await this.isValidAPIKey(request, device.projectId))
    ) {
      throw new UnauthorizedException();
    }

    return await this.devicesService.getSpecificMeasurementsForDevice(
      id,
      start,
      end,
    );
  }

  // Verwacht datum en tijd in volgend formaat 2025-02-22T14:00:00.000Z
  // Dit is een ISO 8601 datum- en tijdnotatie.
  @Get(':id/measurements/csv/:start/:end')
  async downloadCsv(
    @Param('id') id: string,
    @Param('start') start: string,
    @Param('end') end: string,
    @Res() res: Response,
    @Req() request: SessionRequest,
  ) {
    if (!id) {
      throw new NotFoundException('Project ID is not valid');
    }

    if (!start || !end) {
      throw new NotFoundException('Start and end dates are required');
    }

    if (new Date(start) > new Date(end)) {
      throw new NotFoundException('Start date cannot be after end date');
    }

    if (isNaN(new Date(start).getTime()) || isNaN(new Date(end).getTime())) {
      throw new NotFoundException('Invalid date format');
    }

    const device = await this.devicesService.findOne(id);
    if (!device) {
      throw new NotFoundException();
    }

    if (
      !canViewProject(request, device.projectId) &&
      !(await this.isValidAPIKey(request, device.projectId))
    ) {
      throw new UnauthorizedException();
    }

    // Genereer de CSV in het geheugen
    const csvData = await this.devicesService
      .generateCsvFromMeasurements(id, start, end)
      .catch(() => undefined);

    if (!csvData) {
      throw new NotFoundException(
        'Geen meetgegevens gevonden voor dit apparaat.',
      );
    }

    // Stel de headers in om een CSV-bestand te downloaden
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=measurements.csv',
    );

    // Stuur de CSV-gegevens terug als een bestand
    res.send(csvData);
  }

  @Get(':id/parameters')
  async getDeviceParameters(
    @Param('id') id: string,
    @Req() request: SessionRequest,
  ) {
    if (!id) {
      throw new NotFoundException('Project ID is not valid');
    }

    const device = await this.devicesService.findOne(id);
    if (!device) {
      throw new NotFoundException();
    }

    if (
      !canViewProject(request, device.projectId) &&
      !(await this.isValidAPIKey(request, device.projectId))
    ) {
      throw new UnauthorizedException();
    }

    return await this.devicesService.getDeviceParameters(id);
  }

  @Get(':id/videos')
  async getCameraFiles(
    @Param('id') id: string,
    @Req() request: SessionRequest,
  ) {
    if (!id) {
      throw new NotFoundException('Project ID is not valid');
    }

    const device = await this.devicesService.findOne(id);
    if (!device) {
      throw new NotFoundException();
    }

    if (
      !canViewProject(request, device.projectId) &&
      !(await this.isValidAPIKey(request, device.projectId))
    ) {
      throw new UnauthorizedException();
    }

    return await this.devicesService.getCameraFiles(id);
  }

  private async refreshMQTTaco() {
    await fetch(process.env.MQTTACO_REFRESH_URL!);
  }

  private async isValidAPIKey(request: SessionRequest, projectId: number) {
    if (
      !request.headers.authorization ||
      !request.headers.authorization.startsWith('Bearer')
    ) {
      throw new UnauthorizedException();
    }

    const key = request.headers.authorization.split(' ')[1];
    const matchingKey = await this.apiKeyService.getApiKeyByKey(key);

    if (!matchingKey) {
      throw new UnauthorizedException();
    }

    if (matchingKey.projectId !== projectId) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
