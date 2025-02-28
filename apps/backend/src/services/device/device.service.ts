import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { mkConfig, generateCsv, asString } from 'export-to-csv';
import { writeFileSync } from 'fs';

@Injectable()
export class DeviceService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCsv(id: number) {
    //Configuratie voor CSV
    const csvConfig = mkConfig({ useKeysAsHeaders: true });

    //Sensor selecteren

    // Converts Array<Object> to CSV
    //let csv = generateCsv(this.csvConfig);
  }
}
