/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeviceDto } from '@bsaffer/api/device/dto/create-device.dto';
import { UpdateDeviceDto } from '@bsaffer/api/device/dto/update-device.dto';
import { InfluxdbService } from 'src/influxdb/influxdb.service';
import { WimMeasurement } from '@bsaffer/api/device/parser/wim-measurement';
import { parse } from 'json2csv'; //CSV
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { SetupTTNParametersDTO } from '@bsaffer/api/device/dto/setupTTNParameters.dto';

@Injectable()
export class DeviceService {
  constructor(
    private prisma: PrismaService,
    private influx: InfluxdbService,
    private readonly minioClient: MinioClientService,
  ) {}

  async create(createDeviceDto: CreateDeviceDto) {
    const image = await this.minioClient.uploadDeviceBase64Image(
      createDeviceDto.deviceImage,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { deviceImage, ...createDeviceDBData } = createDeviceDto;

    const createdDevice = await this.prisma.device.create({
      data: {
        deviceType: createDeviceDBData.deviceType.toString(),
        imgKey: image,
        name: createDeviceDBData.deviceName,
        description: createDeviceDBData.deviceDescription,
        latitude: createDeviceDBData.latitude.toString(),
        longitude: createDeviceDBData.longitude.toString(),
        projectId: createDeviceDBData.projectId,
        deviceParameters: {
          create: createDeviceDBData.deviceParameters,
        },
      },
    });

    // Create device parameters in the database
    await this.prisma.deviceParameters.createMany({
      data: createDeviceDBData.deviceParameters.map((param) => ({
        deviceId: createdDevice.id,
        name: param.name,
        description: param.description,
      })),
    });

    return createdDevice;
  }
  findAll() {
    return this.prisma.device.findMany();
  }

  findOne(id: string) {
    return this.prisma.device.findUnique({ where: { id: id } });
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return `This action updates a #${id} device`;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }

  async setTTNParameters(
    id: string,
    setupTTNParameters: SetupTTNParametersDTO,
  ) {
    return await this.prisma.ttnDeviceDetail.create({
      data: {
        ttnDeviceId: setupTTNParameters.ttnDeviceId,
        ttnProviderId: setupTTNParameters.ttnProviderId,
        deviceId: id,
      },
    });
  }

  //Requesting all data for one sensor from influx
  async getAllMeasurementsForDevice(id: string) {
    return await this.influx.queryData(
      `from(bucket: "wim")
        |> range(start: 0)
        |> filter(fn: (r) => r._measurement == "tpm" and r.device == "${id}")
        |> aggregateWindow(every: 1m, fn: last, createEmpty: false) 
        |> pivot(rowKey:["device","_time"], columnKey:["_field"], valueColumn:"_value")
        |> drop(columns: ["_start", "_stop", "_measurement", "result", "table", "device"])
        |> sort(columns:["_time"])`,
    );
  }

  async getSpecificMeasurementsForDevice(
    id: string,
    start: string,
    end: string,
  ) {
    return this.influx.queryData(
      `from(bucket: "wim")
        |> range(start: ${start}, stop: ${end})  // Gebruik start en end als parameters
        |> filter(fn: (r) => r._measurement == "tpm" and r.device == "${id}")
        |> aggregateWindow(every: 1m, fn: last, createEmpty: false) 
        |> pivot(rowKey:["device","_time"], columnKey:["_field"], valueColumn:"_value")
        |> drop(columns: ["_start", "_stop", "_measurement", "device"])
        |> sort(columns:["_time"])`,
    );
  }

  // Functie om CSV te genereren van de meetgegevens van een apparaat
  async generateCsvFromMeasurements(
    id: string,
    start: string,
    end: string,
  ): Promise<string> {
    const measurements = await this.getSpecificMeasurementsForDevice(
      id,
      start,
      end,
    );

    if (!measurements || measurements.length === 0) {
      throw new Error('Geen meetgegevens gevonden voor dit apparaat.');
    }

    // Genereer de CSV in het geheugen
    const csv = parse(measurements);

    // Geef de CSV-string terug
    return csv;
  }

  async getCameraFiles(id: string) {
    const files = await this.minioClient.listFiles(`videos/${id}`);
    return files;
  }

  public findAllForProject(projectId: number) {
    return this.prisma.device.findMany({
      where: {
        projectId: projectId,
      },
    });
  }
}
