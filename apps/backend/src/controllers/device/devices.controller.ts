import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DeviceService } from '../../services/device/device.service';
import { CreateDeviceDto } from '@bsaffer/api/device/dto/create-device.dto';
import { UpdateDeviceDto } from '@bsaffer/api/device/dto/update-device.dto';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DeviceService) {}

  @Post()
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }

  @Get()
  findAll() {
    return this.devicesService.findAll();
  }

  @Get('project/:id')
  findAllForProject(@Param('id') id: string) {
    return this.devicesService.findAllForProject(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.devicesService.update(+id, updateDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devicesService.remove(+id);
  }

  @Get(':id/measurements')
  async getAllMeasurementsForDevice(@Param('id') id: string) {
    return await this.devicesService.getAllMeasurementsForDevice(id);
  }

  // Verwacht datum en tijd in volgend formaat 2025-02-22T14:00:00.000Z
  // Dit is een ISO 8601 datum- en tijdnotatie.
  @Get(':id/:start/:end/measurements')
  async getSpecificDataForDevice(
    @Param('id') id: string,
    @Param('start') start: string,
    @Param('end') end: string,
  ) {
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
  ) {
    // Genereer de CSV in het geheugen
    const csvData = await this.devicesService.generateCsvFromMeasurements(
      id,
      start,
      end,
    );

    // Stel de headers in om een CSV-bestand te downloaden
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=measurements.csv',
    );

    // Stuur de CSV-gegevens terug als een bestand
    res.send(csvData);
  }
}
