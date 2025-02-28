import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { mkConfig, generateCsv, asString } from 'export-to-csv';
import { writeFileSync } from 'fs';
import { CreateDeviceDto } from '@bsaffer/api/device/dto/create-device.dto';
import { UpdateDeviceDto } from '@bsaffer/api/device/dto/update-device.dto';
import { InfluxdbService } from 'src/influxdb/influxdb.service';

@Injectable()
export class DeviceService {
  constructor(
    private prisma: PrismaService,
    private influx: InfluxdbService,
  ) {}

  create(createDeviceDto: CreateDeviceDto) {
    return 'This action adds a new device';
  }

  //Requesting data from influx
  async getData(id: string) {
    return this.influx.queryData(
      `from(bucket: "wim")
  |> range(start: -1h)  // Pas het tijdsbereik aan
  |> filter(fn: (r) => r._measurement == "tpm")
  |> filter(fn: (r) => r.device =~ /^${id}$/)
  |> sort(columns: ["_time"], desc: false)`,
    );
  }

  findAll() {
    return this.prisma.device.findMany();
  }

  findOne(id: number) {
    return this.prisma.device.findUnique({ where: { id: id } });
  }

  update(id: number, updateDeviceDto: UpdateDeviceDto) {
    return `This action updates a #${id} device`;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }

  async createCsv(id: number) {
    //Configuratie voor CSV
    const csvConfig = mkConfig({ useKeysAsHeaders: true });

    //Sensor selecteren

    // Converts Array<Object> to CSV
    //let csv = generateCsv(this.csvConfig);
  }
}
