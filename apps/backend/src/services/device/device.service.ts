import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { writeFileSync } from 'fs';
import { CreateDeviceDto } from '@bsaffer/api/device/dto/create-device.dto';
import { UpdateDeviceDto } from '@bsaffer/api/device/dto/update-device.dto';
import { InfluxdbService } from 'src/influxdb/influxdb.service';
import { WimMeasurement } from '@bsaffer/api/device/parser/wim-measurement';
import { parse } from 'json2csv'; //CSV
import { join } from 'path';

@Injectable()
export class DeviceService {
  constructor(
    private prisma: PrismaService,
    private influx: InfluxdbService,
  ) {}

  create(createDeviceDto: CreateDeviceDto) {
    return 'This action adds a new device';
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

  //Requesting all data for one sensor from influx
  async getAllMeasurementsForDevice(id: string) {
    //Todo modulair maken voor alle devicetypes
    // Eerst type device opvragen mbhv id
    // Adhv type, het in juiste bucket ophalen of in juiste klasse parsen
    // let deviceType = this.prisma.device.findFirst({where: {id}})

    // Wacht op de resultaten van de query
    return await this.influx.queryData(
      `from(bucket: "wim")
    |> range(start: 0)
    |> filter(fn: (r) => r._measurement == "tpm")
    |> filter(fn: (r) => r.device =~ /^${id}$/)
    |> sort(columns: ["_time"], desc: false)`,
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
        |> filter(fn: (r) => r._measurement == "tpm")
        |> filter(fn: (r) => r.device =~ /^${id}$/)
        |> sort(columns: ["_time"], desc: false)
      `,
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

    // Zet de opgehaalde gegevens om naar het juiste formaat van WimMeasurement
    const dataForCsv: WimMeasurement[] = measurements.map(
      (measurement: any) => ({
        result: measurement.result,
        table: measurement.table,
        _start: new Date(measurement._start),
        _stop: new Date(measurement._stop),
        _time: new Date(measurement._time),
        _value: measurement._value,
        _field: measurement._field,
        _measurement: measurement._measurement,
        device: measurement.device,
      }),
    );

    // Genereer de CSV in het geheugen
    const csv = parse(dataForCsv);

    // Geef de CSV-string terug
    return csv;
  }
}
